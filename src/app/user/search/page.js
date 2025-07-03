'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import UserSearchResultCard from '@/app/components/UserSearchResultCard';
import LoadingMessage from '@/app/components/LoadingMessage';
import { showToast } from '../../../app/utils/toast';

export default function SearchUserPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSearchResults([]);

    if (!searchQuery.trim()) {
      showToast('Please enter a search query.', 'error');
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
      showToast(err.message, 'error');
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
      <div className="text-center mb-4">
        <img src="/luloy.svg" alt="Luloy Logo" style={{ height: '3em', marginBottom: '1em' }} />
        <h1 className="text-center my-4 text-primary"><i className="bi bi-search me-2"></i>Search Users</h1>
      </div>
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
          
        </div>
      </div>

      {loading && <LoadingMessage />}

      {!loading && searchResults.length === 0 && searchQuery.trim() && !error && (
        <div className="alert alert-info text-center" role="alert">
          No users found matching your search.
        </div>
      )}

      <motion.div
        className="row"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1,
            },
          },
        }}
        initial="hidden"
        animate="visible"
      >
        {searchResults.map((user) => (
          <UserSearchResultCard user={user} key={user.id} />
        ))}
      </motion.div>
    </motion.div>
  );
}
