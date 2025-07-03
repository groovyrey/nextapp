"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function UpdateAuthLevelPage() {
  const [uid, setUid] = useState("");
  const [authLevel, setAuthLevel] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setIsUpdating(true);

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
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '80vh' }}>
      <div className="card m-2" style={{ maxWidth: '600px', width: '100%' }}>
        <div className="card-body">
          <div className="text-center mb-4">
            <img src="/luloy.svg" alt="Luloy Logo" style={{ height: '3em', marginBottom: '1em' }} />
            <h2 className="card-title text-center">Update User Auth Level</h2>
          </div>
          {error && <div className="alert alert-danger" role="alert">{error}</div>}
          {message && <div className="alert alert-success" role="alert">{message}</div>}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="uid" className="form-label">User UID:</label>
              <input
                type="text"
                id="uid"
                className="form-control"
                value={uid}
                onChange={(e) => setUid(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="authLevel" className="form-label">Auth Level:</label>
              <input
                type="number"
                id="authLevel"
                className="form-control"
                value={authLevel}
                onChange={(e) => setAuthLevel(e.target.value)}
                required
                min="0"
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={isUpdating}
            >
              {isUpdating ? (
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              ) : (
                ''
              )}{' '}{isUpdating ? 'Updating...' : 'Update Auth Level'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
