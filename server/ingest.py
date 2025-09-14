# ingest.py
import argparse
import os
import shutil
import time
import hashlib
from urllib.parse import urlparse
import requests
from bs4 import BeautifulSoup

# Disable chroma telemetry (avoid noisy errors)
os.environ["ANONYMIZED_TELEMETRY"] = "False"

# Windows-safe PDF loader import
from langchain_community.document_loaders.pdf import PyPDFDirectoryLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain.schema import Document
from langchain_chroma import Chroma

from get_embedding_function import get_embedding_function

BASE_DIR = os.path.dirname(__file__)
CHROMA_PATH = os.path.join(BASE_DIR, "chroma")
DATA_PATH = os.path.join(BASE_DIR, "data")
WEBSITES_FILE = os.path.join(BASE_DIR, "websites.txt")

# --- Scraping helpers ---
HEADERS = {
    "User-Agent": "RAGChatBot/1.0 (+mailto:you@example.com)",
}

def polite_get(url, timeout=15):
    resp = requests.get(url, headers=HEADERS, timeout=timeout)
    resp.raise_for_status()
    return resp

def scrape_website(url, delay=1.0):
    """Scrape full rendered page text with Playwright (JS support)."""
    try:
        from playwright.sync_api import sync_playwright

        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            page = browser.new_page()
            page.set_extra_http_headers(HEADERS)
            page.goto(url, timeout=30000)  # wait up to 30s
            page.wait_for_load_state("networkidle")  # wait until network requests finish
            time.sleep(delay)  # polite delay if needed

            # Extract rendered HTML
            html = page.content()
            browser.close()

        soup = BeautifulSoup(html, "html.parser")
        # Remove noisy tags
        for tag in soup(["script", "style", "nav", "footer", "header", "noscript", "iframe"]):
            tag.decompose()

        title_tag = soup.find("title")
        title = title_tag.get_text(strip=True) if title_tag else urlparse(url).netloc

        text = soup.get_text(separator="\n", strip=True)
        return text, title

    except Exception as e:
        print(f"[scrape_website] failed for {url}: {e}")
        return "", url

def read_websites(path):
    if not os.path.exists(path):
        return []
    with open(path, "r", encoding="utf-8") as f:
        lines = [line.strip() for line in f if line.strip() and not line.startswith("#")]
    return lines

# --- Crawler helper ---
def crawl_website(start_url, max_depth=1, max_pages=10, delay=1.0):
    """
    Crawl a website starting from start_url.
    - max_depth: how deep to follow links
    - max_pages: maximum number of pages to scrape per site
    """
    visited = set()
    to_visit = [(start_url, 0)]
    docs = []

    while to_visit and len(visited) < max_pages:
        url, depth = to_visit.pop(0)
        if url in visited or depth > max_depth:
            continue
        visited.add(url)

        text, title = scrape_website(url, delay=delay)
        if text:
            doc = Document(
                page_content=text,
                metadata={"source": url, "source_type": "web", "title": title, "page": 0}
            )
            docs.append(doc)

        # Only follow links if within same domain and depth not exceeded
        if depth < max_depth:
            try:
                resp = polite_get(url)
                soup = BeautifulSoup(resp.text, "html.parser")
                base_netloc = urlparse(start_url).netloc

                for link_tag in soup.find_all("a", href=True):
                    link = link_tag["href"]
                    absolute_url = requests.compat.urljoin(url, link)
                    # stay within same domain
                    if urlparse(absolute_url).netloc == base_netloc:
                        if absolute_url not in visited:
                            to_visit.append((absolute_url, depth + 1))
            except Exception as e:
                print(f"[crawl_website] link extraction failed for {url}: {e}")

    return docs

# --- Text chunking helpers ---
def split_documents(documents):
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=800,
        chunk_overlap=80,
        length_function=len,
        is_separator_regex=False,
    )
    return text_splitter.split_documents(documents)

def sha256_text(text: str):
    return hashlib.sha256(text.encode("utf-8")).hexdigest()

def calculate_chunk_ids(chunks):
    """
    Create stable IDs and chunk metadata.
    For PDFs, expects chunk.metadata['source'] includes path and chunk.metadata['page'] exists.
    For web docs, source=URL, page=0.
    """

    last_page_id = None
    current_chunk_index = 0

    for chunk in chunks:
        source = chunk.metadata.get("source", "")
        page = chunk.metadata.get("page", 0)
        # Normalize Windows path separators into forward slashes for IDs
        current_page_id = f"{source}:{page}"

        if current_page_id == last_page_id:
            current_chunk_index += 1
        else:
            current_chunk_index = 0

        chunk_id = f"{current_page_id}:{current_chunk_index}"
        chunk.metadata["id"] = chunk_id

        # Add dedup hash
        chunk_hash = sha256_text(chunk.page_content)
        chunk.metadata["sha256"] = chunk_hash

        last_page_id = current_page_id

    return chunks

# --- Main add/update logic ---
def add_to_chroma(chunks):
    embedding_fn = get_embedding_function()
    db = Chroma(persist_directory=CHROMA_PATH, embedding_function=embedding_fn)

    # Fetch existing docs metadata + ids
    existing_items = db.get(include=["metadatas"])
    metadatas = existing_items.get("metadatas", []) or []
    ids = existing_items.get("ids", []) or []

    # Extract hashes of already stored docs
    existing_hashes = {m.get("sha256") for m in metadatas if m and "sha256" in m}

    print(f"Number of existing documents in DB (by hash): {len(existing_hashes)}")

    # Only add new ones
    new_chunks = [c for c in chunks if c.metadata.get("sha256") not in existing_hashes]

    if not new_chunks:
        print("✅ No new documents to add")
        return

    print(f"👉 Adding new documents: {len(new_chunks)}")
    new_ids = [c.metadata["id"] for c in new_chunks]
    db.add_documents(new_chunks, ids=new_ids)

def load_pdf_documents():
    if not os.path.exists(DATA_PATH):
        return []
    loader = PyPDFDirectoryLoader(DATA_PATH)
    try:
        docs = loader.load()
        return docs
    except Exception as e:
        print(f"[load_pdf_documents] loader failed: {e}")
        return []

def build_web_documents(websites, crawl=True):
    docs = []
    for url in websites:
        if crawl:
            print(f"🌐 Crawling {url}")
            site_docs = crawl_website(url, max_depth=1, max_pages=10)
            docs.extend(site_docs)
        else:
            text, title = scrape_website(url)
            if not text:
                continue
            doc = Document(page_content=text, metadata={"source": url, "source_type": "web", "title": title, "page": 0})
            docs.append(doc)
    return docs

def clear_database():
    if os.path.exists(CHROMA_PATH):
        shutil.rmtree(CHROMA_PATH)
        print("Chroma directory removed.")

def ingest(reset: bool = False, websites_file: str = WEBSITES_FILE):
    if reset:
        print("✨ Clearing Database")
        clear_database()

    # Load PDFs
    pdf_docs = load_pdf_documents()
    # Load websites if provided
    websites = read_websites(websites_file)
    web_docs = build_web_documents(websites, crawl=True) if websites else []

    all_docs = pdf_docs + web_docs
    if not all_docs:
        print("No documents found (PDFs or websites). Nothing to do.")
        return

    chunks = split_documents(all_docs)
    chunks = calculate_chunk_ids(chunks)
    add_to_chroma(chunks)

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--reset", action="store_true", help="Reset the database.")
    parser.add_argument("--websites-file", type=str, default=WEBSITES_FILE, help="Path to websites.txt")
    args = parser.parse_args()
    ingest(reset=args.reset, websites_file=args.websites_file)