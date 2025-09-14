"use client";

import { useState, useEffect } from "react";
import { User, ThumbsUp } from "lucide-react"; // ✅ correct import


// Types
interface Post {
  id: number;
  user: string;
  title: string;
  content: string;
  category: string;
  timestamp: string;
}

interface Comment {
  id: number;
  postId: number;
  user: string;
  content: string;
  timestamp: string;
}

const initialPosts: Post[] = [
  {
    id: 1,
    user: "Ravi",
    title: "PMAY Urban Query",
    content: "What documents are required for applying to PMAY Urban 2.0?",
    category: "Housing",
    timestamp: "2025-09-14 12:00",
  },
  {
    id: 2,
    user: "Sneha",
    title: "Scholarship Eligibility",
    content: "Are OBC students eligible for the National Scholarship Portal?",
    category: "Education",
    timestamp: "2025-09-13 16:30",
  },
];

const initialComments: Comment[] = [
  { id: 1, postId: 1, user: "Admin", content: "You need Aadhaar, Income Certificate, and Proof of Residence.", timestamp: "2025-09-14 12:15" },
];

export default function Community() {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [newComment, setNewComment] = useState<{ [key: number]: string }>({});
  const [upvotes, setUpvotes] = useState<number[]>([]); // post IDs upvoted

  const categories = ["All", "Housing", "Education", "Health", "Farming", "Employment", "Women & Child", "Pension"];

  // Add new post
  const handleAddPost = () => {
    if (!newPostTitle || !newPostContent) return;
    const post: Post = {
      id: posts.length + 1,
      user: "You",
      title: newPostTitle,
      content: newPostContent,
      category: selectedCategory === "All" ? "General" : selectedCategory,
      timestamp: new Date().toISOString(),
    };
    setPosts([post, ...posts]);
    setNewPostTitle("");
    setNewPostContent("");
  };

  // Add comment
  const handleAddComment = (postId: number) => {
    if (!newComment[postId]) return;
    const comment: Comment = {
      id: comments.length + 1,
      postId,
      user: "You",
      content: newComment[postId],
      timestamp: new Date().toISOString(),
    };
    setComments([...comments, comment]);
    setNewComment({ ...newComment, [postId]: "" });
  };

  // Toggle upvote
  const toggleUpvote = (postId: number) => {
    setUpvotes(prev => prev.includes(postId) ? prev.filter(id => id !== postId) : [...prev, postId]);
  };

  // Filtered posts
  const filteredPosts = posts.filter(p => selectedCategory === "All" || p.category === selectedCategory);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Community Discussions</h1>

      {/* New Post */}
      <div className="border p-4 rounded-lg mb-6 bg-gray-50">
        <h2 className="font-semibold mb-2">Create a New Post</h2>
        <input
          type="text"
          placeholder="Title"
          className="border p-2 rounded-md w-full mb-2"
          value={newPostTitle}
          onChange={(e) => setNewPostTitle(e.target.value)}
        />
        <textarea
          placeholder="Your question or experience..."
          className="border p-2 rounded-md w-full mb-2"
          value={newPostContent}
          onChange={(e) => setNewPostContent(e.target.value)}
        />
        <select
          className="border p-2 rounded-md mb-2"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {categories.map(cat => <option key={cat}>{cat}</option>)}
        </select>
        <button
          onClick={handleAddPost}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          Post
        </button>
      </div>

      {/* Category Filter */}
      <div className="flex gap-3 mb-4">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 rounded-full ${selectedCategory === cat ? "bg-indigo-600 text-white" : "bg-gray-200"}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Posts */}
      <div className="space-y-6">
        {filteredPosts.map(post => (
          <div key={post.id} className="border p-4 rounded-lg bg-white shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold">{post.title}</h3>
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => toggleUpvote(post.id)}>
                 <ThumbsUp className={`w-5 h-5 ${upvotes.includes(post.id) ? "text-blue-600" : "text-gray-500"}`} />
                    <span>{upvotes.includes(post.id) ? 1 : 0}</span>
               </div>
            </div>
            <p className="text-gray-700 mb-2">{post.content}</p>
            <p className="text-sm text-gray-500 mb-2">By {post.user} | {new Date(post.timestamp).toLocaleString()}</p>
            <div className="ml-2">
              {/* Comments */}
              {comments.filter(c => c.postId === post.id).map(c => (
                <div key={c.id} className="border-l-2 border-gray-300 pl-2 mb-1">
                  <p className="text-gray-700"><span className="font-semibold">{c.user}:</span> {c.content}</p>
                  <p className="text-xs text-gray-400">{new Date(c.timestamp).toLocaleString()}</p>
                </div>
              ))}

              {/* Add Comment */}
              <div className="mt-2 flex gap-2">
                <input
                  type="text"
                  placeholder="Add a comment..."
                  className="border p-2 rounded-md flex-1"
                  value={newComment[post.id] || ""}
                  onChange={(e) => setNewComment({ ...newComment, [post.id]: e.target.value })}
                />
                <button
                  onClick={() => handleAddComment(post.id)}
                  className="bg-indigo-600 text-white px-3 py-1 rounded-md hover:bg-indigo-700"
                >
                  Comment
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
