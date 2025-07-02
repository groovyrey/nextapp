'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import UserSearchResultCard from '@/app/components/UserSearchResultCard';
import LoadingMessage from '@/app/components/LoadingMessage';

export default function SearchUserPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSearchResults([]);

    if (!searchQuery.trim()) {
      setError('Please enter a search query.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/user/search?query=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch search results.');
      }

      setSearchResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-center my-4 text-primary"><i className="bi bi-search me-2"></i>Search Users</h1>
      <div className="card mb-4">
        <div className="card-body">
          <form onSubmit={handleSearch} className="d-flex">
            <input
              type="text"
              className="form-control me-2"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? (
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              ) : (
                <i className="bi bi-search"></i>
              )}
            </button>
          </form>
          {error && <div className="alert alert-danger mt-3" role="alert">{error}</div>}
        </div>
      </div>

      {loading && <LoadingMessage />}

      {!loading && searchResults.length === 0 && searchQuery.trim() && !error && (
        <div className="alert alert-info text-center" role="alert">
          No users found matching your search.
        </div>
      )}

      <div className="row">
        {searchResults.map((user) => (
          <div className="col-md-6 col-lg-4 mb-4" key={user.id}>
            <UserSearchResultCard user={user} />
          </div>
        ))}
      </div>
    </motion.div>
  );
}
