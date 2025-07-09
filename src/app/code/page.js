'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

function getFileIcon(filename) {
    if (!filename) return 'bi-file-earmark';
    const extension = filename.split('.').pop();
    switch (extension) {
        case 'js':
            return 'bi-filetype-js';
        case 'py':
            return 'bi-filetype-py';
        case 'html':
            return 'bi-filetype-html';
        case 'css':
            return 'bi-filetype-css';
        case 'json':
            return 'bi-filetype-json';
        case 'md':
            return 'bi-filetype-md';
        case 'cpp':
            return 'bi-filetype-cpp';
        case 'svg':
            return 'bi-filetype-svg';
        default:
            return 'bi-file-earmark';
    }
}

export default function CodePage() {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchFiles() {
      try {
        const res = await fetch('/api/code');
        if (!res.ok) {
          throw new Error('Failed to fetch file list');
        }
        const data = await res.json();
        setFiles(data);
      } catch (err) {
        setError(err.message);
      }
    }
    fetchFiles();
  }, []);

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Code Files</h1>
      {error && <p className="text-danger">{error}</p>}
      <div className="list-group">
        {files.map(file => (
          <Link key={file} href={`/code/view/${file}`} className="list-group-item list-group-item-action d-flex align-items-center">
            <i className={`bi ${getFileIcon(file)} me-3 fs-4`}></i>
            <span>{file}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}