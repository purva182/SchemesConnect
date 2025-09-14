# Schemes Connect

**Schemes Connect** is an AI-powered platform that helps users discover, explore, and benefit from government and organizational schemes.  
It combines **intelligent automation, personalized recommendations, chatbot assistance, community engagement, and timely alerts** to create a one-stop solution for scheme awareness and participation.

---

## 🚀 Features

- **Schemes Tab**  
  Browse through a structured list of schemes with:
  - Eligibility criteria  
  - Required documents  
  - Categories and benefits  

- **Personalized Recommendations**  
  AI-driven suggestions tailored to user profiles, preferences, and needs.  

- **Chatbot Assistance** 🤖  
  Conversational interface to answer scheme-related queries instantly.  

- **Community Tab** 👥  
  A dedicated space for users to share experiences, ask questions, and discuss schemes.  

- **Alerts & Deadlines** ⏰  
  Stay updated with:
  - Application deadlines  
  - Expiring opportunities  
  - New scheme launches  

---

## 🛠️ Tech Stack

- **Frontend:** Next.js / React, Tailwind CSS  
- **Backend:** FastAPI (Python), Uvicorn  
- **Database:** PostgreSQL / MongoDB (based on requirements)  
- **AI/NLP:** Transformers for chatbot + recommendation engine  
- **Notifications:** Scheduler + Push notifications / Email alerts  

---

## 🔧 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/schemes-connect.git
cd schemes-connect
```

### 2. Setup Backend
```bash
cd server
python ingest.py --reset --websites-file websites.txt
uvicorn server:app --reload --port 8000
```

- Backend will run at: **http://localhost:8000**

### 3. Setup Frontend
```bash
cd MultilingualChatBot
npm install
npm run dev
```

- Frontend will run at: **http://localhost:3000**

### 4. Access the App
- **Frontend:** [http://localhost:3000](http://localhost:3000)  
- **Backend API:** [http://localhost:8000](http://localhost:8000)  

---

## 🎯 Use Cases

- Students looking for scholarships  
- Farmers exploring agriculture-related benefits  
- Citizens seeking government subsidies, grants, or financial aid  
- Community-based discussions for sharing scheme experiences  






---
