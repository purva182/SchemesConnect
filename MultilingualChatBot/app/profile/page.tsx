"use client";

import { useState, useEffect } from "react";

interface Scheme {
  id: number;
  title: string;
  category: string;
  description: string;
  eligibility: string;
  documents: string[];
  applyLink: string;
}

export default function Profile() {
  const [profile, setProfile] = useState({
    fullName: "",
    age: "",
    gender: "",
    income: "",
    occupation: "",
    location: "",
    casteCategory: "",
    disability: "",
  });

  const [recommendedSchemes, setRecommendedSchemes] = useState<Scheme[]>([]);

  // Hardcoded scheme data
  const schemes: Scheme[] = [
    {
      id: 1,
      title: "Pradhan Mantri Awas Yojana-Urban 2.0",
      description:
        "Affordable housing initiative by the Government of India for urban areas.",
      category: "Housing",
      eligibility: "Low-income groups, EWS, and middle-income groups.",
      documents: ["Aadhaar Card", "Income Certificate", "Proof of Residence"],
      applyLink: "https://pmaymis.gov.in/",
    },
    {
      id: 2,
      title: "National Scholarship Portal",
      description:
        "Centralized portal for students to apply for scholarships.",
      category: "Education",
      eligibility: "Students from minority, SC/ST, OBC, and weaker backgrounds.",
      documents: ["Aadhaar Card", "Income Certificate", "Previous Marksheet", "Bank Account Details"],
      applyLink: "https://scholarships.gov.in/",
    },
    {
      id: 3,
      title: "Pradhan Mantri Fasal Bima Yojana",
      description: "Crop insurance scheme for farmers.",
      category: "Farming",
      eligibility: "All farmers growing notified crops.",
      documents: ["Aadhaar Card", "Land Ownership Papers", "Bank Account Details"],
      applyLink: "https://pmfby.gov.in/",
    },
    {
      id: 4,
      title: "Ayushman Bharat - Pradhan Mantri Jan Arogya Yojana",
      description: "Health assurance scheme providing free treatment up to ₹5 lakh.",
      category: "Health",
      eligibility: "Economically weaker families.",
      documents: ["Aadhaar Card", "Ration Card"],
      applyLink: "https://pmjay.gov.in/",
    },
    // add more schemes if needed
  ];

  // Load profile from localStorage when component mounts
  useEffect(() => {
    const savedProfile = localStorage.getItem("citizenProfile");
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("citizenProfile", JSON.stringify(profile));
    alert("Profile saved! You can now check recommended schemes below.");
  };

  // Hardcoded recommendation logic
  const recommendSchemes = () => {
    const recommendations: Scheme[] = [];
    schemes.forEach((scheme) => {
      if (scheme.category === "Housing" && profile.income === "Below 2.5 Lakh") recommendations.push(scheme);
      else if (scheme.category === "Education" && profile.occupation === "Student") recommendations.push(scheme);
      else if (scheme.category === "Farming" && profile.occupation === "Farmer") recommendations.push(scheme);
      else if (scheme.category === "Health" && profile.income === "Below 2.5 Lakh") recommendations.push(scheme);
    });
    setRecommendedSchemes(recommendations);
  };

  return (
    <div className="min-h-screen w-full bg-gray-100 p-6 overflow-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Citizen Profile</h1>
      <p className="text-gray-600 mb-6 text-center">
        Fill in your details to get personalized scheme recommendations.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
        {/* Full Name */}
        <div>
          <label className="block font-semibold mb-1">Full Name</label>
          <input type="text" name="fullName" value={profile.fullName} onChange={handleChange} className="w-full border p-2 rounded-lg" placeholder="Enter your full name" />
        </div>

        {/* Age */}
        <div>
          <label className="block font-semibold mb-1">Age</label>
          <input type="number" name="age" value={profile.age} onChange={handleChange} className="w-full border p-2 rounded-lg" placeholder="Enter your age" />
        </div>

        {/* Gender */}
        <div>
          <label className="block font-semibold mb-1">Gender</label>
          <select name="gender" value={profile.gender} onChange={handleChange} className="w-full border p-2 rounded-lg">
            <option value="">Select gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Income */}
        <div>
          <label className="block font-semibold mb-1">Annual Household Income</label>
          <select name="income" value={profile.income} onChange={handleChange} className="w-full border p-2 rounded-lg">
            <option value="">Select income range</option>
            <option value="Below 2.5 Lakh">Below ₹2.5 Lakh</option>
            <option value="2.5L-5L">₹2.5 Lakh – ₹5 Lakh</option>
            <option value="5L-10L">₹5 Lakh – ₹10 Lakh</option>
            <option value="Above 10L">Above ₹10 Lakh</option>
          </select>
        </div>

        {/* Occupation */}
        <div>
          <label className="block font-semibold mb-1">Occupation</label>
          <select name="occupation" value={profile.occupation} onChange={handleChange} className="w-full border p-2 rounded-lg">
            <option value="">Select occupation</option>
            <option value="Farmer">Farmer</option>
            <option value="Student">Student</option>
            <option value="Unemployed">Unemployed</option>
            <option value="Employed">Employed</option>
            <option value="Self-Employed">Self-Employed</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Location */}
        <div>
          <label className="block font-semibold mb-1">Location</label>
          <input type="text" name="location" value={profile.location} onChange={handleChange} className="w-full border p-2 rounded-lg" placeholder="City / Village / District" />
        </div>

        {/* Caste Category */}
        <div>
          <label className="block font-semibold mb-1">Caste Category</label>
          <select name="casteCategory" value={profile.casteCategory} onChange={handleChange} className="w-full border p-2 rounded-lg">
            <option value="">Select category</option>
            <option value="General">General</option>
            <option value="EWS">EWS</option>
            <option value="OBC">OBC</option>
            <option value="SC">SC</option>
            <option value="ST">ST</option>
            <option value="Minority">Minority</option>
          </select>
        </div>

        {/* Disability */}
        <div>
          <label className="block font-semibold mb-1">Disability (if any)</label>
          <select name="disability" value={profile.disability} onChange={handleChange} className="w-full border p-2 rounded-lg">
            <option value="">Select option</option>
            <option value="No">No</option>
            <option value="Yes">Yes</option>
          </select>
        </div>

        <div className="flex gap-4">
          <button type="submit" className="flex-1 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition">Save Profile</button>
          <button type="button" onClick={recommendSchemes} className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition">Recommend Schemes</button>
        </div>
      </form>

      {/* Recommended Schemes */}
      {recommendedSchemes.length > 0 && (
        <div className="max-w-4xl mx-auto mt-8 space-y-4">
          <h2 className="text-2xl font-bold mb-4">Recommended Schemes for You</h2>
          {recommendedSchemes.map((scheme) => (
            <div key={scheme.id} className="border p-4 rounded-lg bg-white shadow">
              <h3 className="text-xl font-semibold">{scheme.title}</h3>
              <p className="text-gray-600">{scheme.description}</p>
              <p className="text-sm text-gray-500">Category: {scheme.category}</p>
              <a href={scheme.applyLink} target="_blank" className="text-blue-600 underline">Apply Here</a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
