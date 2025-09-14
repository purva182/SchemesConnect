"use client";

import { useState } from "react";
import { User, Bookmark, BookmarkCheck } from "lucide-react";
import Chatbot from "../chatbot/page"; 
import Profile from "../profile/page"; 
import Community from "../community/page";


interface Scheme {
  id: number;
  title: string;
  description: string;
  publishDate: string;
  category: string;
  eligibility: string;
  documents: string[];
  applyLink: string;
}

const schemes: Scheme[] = [
  {
    id: 1,
    title: "Pradhan Mantri Awas Yojana-Urban 2.0",
    description: "Ambitious housing initiative by the Government of India, aimed at ensuring affordable housing for all in urban areas.",
    publishDate: "03/04/2025",
    category: "Housing",
    eligibility: "Low-income groups, EWS, and middle-income groups living in urban areas.",
    documents: ["Aadhaar Card", "Income Certificate", "Proof of Residence"],
    applyLink: "https://pmaymis.gov.in/",
  },
  {
    id: 2,
    title: "National Scholarship Portal",
    description: "Centralized portal for students to apply for scholarships provided by various government departments and ministries.",
    publishDate: "15/06/2024",
    category: "Education",
    eligibility: "Students from minority, SC/ST, OBC, and economically weaker backgrounds.",
    documents: ["Aadhaar Card", "Income Certificate", "Previous Marksheet", "Bank Account Details"],
    applyLink: "https://scholarships.gov.in/",
  },
  {
    id: 3,
    title: "Pradhan Mantri Fasal Bima Yojana",
    description: "Crop Insurance Scheme providing financial support to farmers in case of crop failure due to natural calamities, pests, and diseases.",
    publishDate: "20/09/2024",
    category: "Farming",
    eligibility: "All farmers growing notified crops in notified areas.",
    documents: ["Aadhaar Card", "Land Ownership Papers", "Bank Account Details"],
    applyLink: "https://pmfby.gov.in/",
  },
  {
    id: 4,
    title: "Women & Child Welfare Program",
    description: "Schemes for nutrition, education, and safety of women and children across India.",
    publishDate: "12/08/2024",
    category: "Women & Child",
    eligibility: "Women and children from economically weaker sections.",
    documents: ["Aadhaar Card", "Birth Certificate", "Income Certificate"],
    applyLink: "https://wcd.nic.in/",
  },
  {
    id: 5,
    title: "Ayushman Bharat - Pradhan Mantri Jan Arogya Yojana",
    description: "World’s largest health assurance scheme providing free treatment up to ₹5 lakh per family per year.",
    publishDate: "01/01/2024",
    category: "Health",
    eligibility: "Economically weaker families listed under SECC database.",
    documents: ["Aadhaar Card", "Ration Card"],
    applyLink: "https://pmjay.gov.in/",
  },
  {
    id: 6,
    title: "Pradhan Mantri Kaushal Vikas Yojana",
    description: "Flagship scheme for skill development to train youth in industry-relevant skills.",
    publishDate: "10/07/2024",
    category: "Employment",
    eligibility: "Unemployed youth, school/college dropouts.",
    documents: ["Aadhaar Card", "Educational Certificate"],
    applyLink: "https://www.pmkvyofficial.org/",
  },
  {
    id: 7,
    title: "Atal Pension Yojana",
    description: "Government-backed pension scheme for workers in the unorganized sector.",
    publishDate: "25/04/2024",
    category: "Pension",
    eligibility: "All Indian citizens between 18-40 years with a savings account.",
    documents: ["Aadhaar Card", "Bank Account Details"],
    applyLink: "https://npscra.nsdl.co.in/scheme-details.php",
  },
];

export default function CitizenDashboard() {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("schemes");
  const [expanded, setExpanded] = useState<number | null>(null);
  const [bookmarks, setBookmarks] = useState<number[]>([]);

  const categories = ["All", "Housing", "Education", "Farming", "Women & Child", "Health", "Employment", "Pension"];

  const filteredSchemes = schemes.filter((scheme) => {
    const matchCategory = filter === "All" || scheme.category === filter;
    const matchSearch = scheme.title.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  const toggleBookmark = (id: number) => {
    setBookmarks((prev) =>
      prev.includes(id) ? prev.filter((bid) => bid !== id) : [...prev, id]
    );
  };

  return (
    <div className="p-6">
      {/* 🔹 App Header */}
      <header className="mb-10 text-center">
        <h1 className="text-5xl font-extrabold text-indigo-700 drop-shadow-sm">
          SchemesConnect
        </h1>
        <p className="mt-2 text-lg text-gray-600 italic">
          Connecting Citizens to Government Schemes
        </p>
      </header>
    
      {/* Tabs + Profile */}
      <div className="flex justify-between items-center border-b mb-6">
        <div className="flex space-x-4">
          {["schemes", "community", "chatbot"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 px-4 font-medium ${
                activeTab === tab
                  ? "border-b-4 border-indigo-600 text-indigo-600"
                  : "text-gray-600 hover:text-indigo-500"
              }`}
            >
              {tab === "schemes" && "Schemes"}
              {tab === "community" && "Community 💬"}
              {tab === "govtupdate" && "Govt Updates 📰"}
              {tab === "chatbot" && "Chatbot 🤖"}
            </button>
          ))}
        </div>
        <button
          onClick={() => setActiveTab("profile")}
          className={`p-2 rounded-full ${
            activeTab === "profile"
              ? "bg-indigo-100 text-indigo-600"
              : "text-gray-600 hover:text-indigo-500"
          }`}
        >
          <User className="w-6 h-6" />
        </button>
      </div>

      {/* Render Active Tab */}
      {activeTab === "schemes" && (
        <>
          <h1 className="text-3xl font-bold mb-6">Schemes</h1>

          <div className="flex flex-wrap items-center gap-3 bg-gray-100 p-4 rounded-lg mb-6">
            <input
              type="text"
              placeholder="🔍 Search schemes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border p-2 rounded-md flex-1"
            />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border p-2 rounded-md"
            >
              {categories.map((cat) => (
                <option key={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="space-y-6">
            {filteredSchemes.map((scheme) => (
              <div key={scheme.id} className="border rounded-lg shadow-sm p-6 bg-white">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-bold mb-2">{scheme.title}</h2>
                    <p className="text-gray-600 mb-3">{scheme.description}</p>
                    <p className="text-sm text-gray-500 mb-4">
                      PUBLISH DATE: {scheme.publishDate}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button onClick={() => toggleBookmark(scheme.id)}>
                      {bookmarks.includes(scheme.id) ? (
                        <BookmarkCheck className="text-indigo-600 w-6 h-6" />
                      ) : (
                        <Bookmark className="text-gray-500 w-6 h-6" />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => setExpanded(expanded === scheme.id ? null : scheme.id)}
                  className="mt-3 bg-yellow-700 hover:bg-yellow-800 text-white px-4 py-2 rounded-md"
                >
                  {expanded === scheme.id ? "Hide Details" : "View Details"}
                </button>

                {expanded === scheme.id && (
                  <div className="mt-4 p-4 bg-gray-50 border rounded-lg">
                    <p className="mb-2">
                      <span className="font-semibold">Eligibility:</span> {scheme.eligibility}
                    </p>
                    <p className="mb-2 font-semibold">Documents Required:</p>
                    <ul className="list-disc list-inside text-gray-700 mb-2">
                      {scheme.documents.map((doc, i) => (
                        <li key={i}>{doc}</li>
                      ))}
                    </ul>
                    <p>
                      <span className="font-semibold">Where to Apply:</span>{" "}
                      <a href={scheme.applyLink} target="_blank" className="text-blue-600 underline">
                        {scheme.applyLink}
                      </a>
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {activeTab === "community" && <Community />}
      {activeTab === "chatbot" && <Chatbot />}
      {activeTab === "profile" && <Profile />}
    </div>
  );
}
