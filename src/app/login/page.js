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

  

	return (
    <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '80vh' }}>
      <div className="card m-2" style={{ maxWidth: '400px', width: '100%' }}>
        <div className="card-body">
          <h2 className="card-title text-center mb-4"><i className="bi bi-person-circle me-2"></i>Login</h2>
          {error && <div className="alert alert-danger" role="alert">{error}</div>}
          <div className="form-floating input-group mb-3">
            <input type="email" className="form-control" id="emailInput" placeholder="Email" onChange={e => setEmail(e.target.value)} />
            <label htmlFor="emailInput"><i className="bi bi-envelope me-2"></i>Email</label>
          </div>
          <div className="form-floating input-group mb-3">
            <input type="password" className="form-control" id="passwordInput" placeholder="Password" onChange={e => setPassword(e.target.value)} />
            <label htmlFor="passwordInput"><i className="bi bi-lock me-2"></i>Password</label>
          </div>
          <button className="btn btn-primary w-100" onClick={handleLogin} disabled={isLoggingIn}>
            {isLoggingIn ? (
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            ) : (
              <i className="bi-box-arrow-in-right me-2"></i>
            )}{' '}
            {isLoggingIn ? 'Logging in...' : 'Login'}
          </button>
          <p className="mt-3 text-center">Don't have an account? <a className="text-primary" href="/signup"><i className="bi bi-person-plus me-2"></i>Sign up</a></p>
        </div>
      </div>
    </div>
  );
}