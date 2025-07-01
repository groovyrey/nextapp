"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function UpdateAuthLevelPage() {
  const [uid, setUid] = useState("");
  const [authLevel, setAuthLevel] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!uid || authLevel === "") {
      setError("Please enter both UID and Auth Level.");
      return;
    }

    try {
      const response = await fetch("/api/user/update-authlevel", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ uid, authLevel: parseInt(authLevel) }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        setUid("");
        setAuthLevel("");
      } else {
        setError(data.error || "Failed to update auth level.");
      }
    } catch (err) {
      console.error("Error updating auth level:", err);
      setError("An unexpected error occurred.");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "500px", margin: "0 auto" }}>
      <h1>Update User Auth Level</h1>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        <div>
          <label htmlFor="uid" style={{ display: "block", marginBottom: "5px" }}>User UID:</label>
          <input
            type="text"
            id="uid"
            value={uid}
            onChange={(e) => setUid(e.target.value)}
            style={{ width: "100%", padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
            required
          />
        </div>
        <div>
          <label htmlFor="authLevel" style={{ display: "block", marginBottom: "5px" }}>Auth Level:</label>
          <input
            type="number"
            id="authLevel"
            value={authLevel}
            onChange={(e) => setAuthLevel(e.target.value)}
            style={{ width: "100%", padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
            required
            min="0"
          />
        </div>
        <button
          type="submit"
          style={{
            padding: "10px 15px",
            backgroundColor: "#0070f3",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Update Auth Level
        </button>
      </form>
      {message && <p style={{ color: "green", marginTop: "15px" }}>{message}</p>}
      {error && <p style={{ color: "red", marginTop: "15px" }}>{error}</p>}
    </div>
  );
}
