'use client';

import { useState, useEffect } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "/lib/firebase.js";
import { useRouter } from "next/navigation";
import { useUser } from '../context/UserContext';

export default function LoginPage() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const router = useRouter();
  const { user, loading } = useUser();

  useEffect(() => {
    if (!loading && user) {
      router.push('/');
    }
  }, [user, loading, router]);
	
	const handleLogin = async () => {
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await user.getIdToken();

      const res = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken }),
      });

      if (res.ok) {
        router.push('/');
      } else {
        setError('Failed to create session.');
      }
    } catch (err) {
      setError("Login failed: " + err.message);
    }
  };
	
  if (loading) {
    return <div>Loading...</div>;
  }

  if (user) {
    return null; // User is logged in, redirect will happen in useEffect
  }

	return (
		<div className="container">
		  <div className="card">
		    <div className="card-body">
      <h2 className="card-title">Login</h2>
      {error && <p className="text-danger">{error}</p>}
      <input type="email" className="form-control my-2" placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <input type="password" className="form-control my-2" placeholder="Password" onChange={e => setPassword(e.target.value)} />
      <button className="btn btn-primary" onClick={handleLogin}>Login</button>
      </div>
      </div>
    </div>
	);
}