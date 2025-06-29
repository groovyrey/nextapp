'use client';

import { useState, useEffect } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "/lib/firebase.js";
import { useRouter } from "next/navigation";
import { useUser } from '../context/UserContext';
import LoadingMessage from '../components/LoadingMessage';

export default function LoginPage() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
	const router = useRouter();
  const { user, loading, login } = useUser();

  useEffect(() => {
    if (!loading && user) {
      router.push('/');
    }
  }, [user, loading, router]);
	
	const handleLogin = async () => {
    setError('');
    setIsLoggingIn(true);
    try {
      await login(email, password);
      router.push('/');
    } catch (err) {
      setError("Login failed: " + err.message);
    } finally {
      setIsLoggingIn(false);
    }
  };
	
  if (loading) {
    return <LoadingMessage />;
  }

  if (user) {
    return <LoadingMessage />;
  }

	return (
		<div className="container">
		  <div className="card m-2">
		    <div className="card-body">
      <h2 className="card-title">Login</h2>
      {error && <p className="text-danger">{error}</p>}
      <input type="email" className="form-control mb-3" placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <input type="password" className="form-control mb-3" placeholder="Password" onChange={e => setPassword(e.target.value)} />
      <button className="btn btn-primary w-100" onClick={handleLogin} disabled={isLoggingIn}>
        {isLoggingIn ? (
          <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        ) : (
          <i className="bi-box-arrow-in-right"></i>
        )}{' '}
        {isLoggingIn ? 'Logging in...' : 'Login'}
      </button>
      <p className="mt-3 text-center">Don't have an account? <a className="text-primary" href="/signup">Sign up</a></p>
      </div>
      </div>
    </div>
	);
}