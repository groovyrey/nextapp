'use client';

import { useState, useEffect } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "/lib/firebase.js";
import { useRouter } from "next/navigation";
import { useUser } from '../context/UserContext';
import LoadingMessage from '../components/LoadingMessage';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [age, setAge] = useState('');
  const [error, setError] = useState('');
  const [isSigningUp, setIsSigningUp] = useState(false);
  const router = useRouter();
  const { user, loading } = useUser();

  useEffect(() => {
    if (!loading && user) {
      router.push('/');
    }
  }, [user, loading, router]);

  const handleSignup = async () => {
    setError('');
    setIsSigningUp(true);
    try {
      if (!firstName || !lastName || !age) {
        setError("Please fill in all fields.");
        return;
      }
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(user, {
        displayName: `${firstName} ${lastName}`
      });
      
      const idToken = await user.getIdToken();

      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken, firstName, lastName, age: parseInt(age) }),
      });

      if (res.ok) {
        const sessionRes = await fetch('/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ idToken }),
        });
        if (sessionRes.ok) {
          router.push('/');
        } else {
          setError('Failed to create session.');
        }
      } else {
        const errorData = await res.json();
        setError(errorData.error || 'Failed to save user data.');
      }
    } catch (err) {
      setError("Signup failed: " + err.message);
    } finally {
      setIsSigningUp(false);
    }
  };

  if (loading) {
    return <LoadingMessage />;
  }

  if (user) {
    return <LoadingMessage />;
  }

  return (
    <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '80vh' }}>
      <div className="card m-2" style={{ maxWidth: '400px', width: '100%' }}>
        <div className="card-body">
          <h2 className="card-title text-center mb-4"><i className="bi bi-person-plus-fill me-2"></i>Sign Up</h2>
          {error && <div className="alert alert-danger" role="alert">{error}</div>}
          <div className="input-group mb-3">
            <span className="input-group-text"><i className="bi bi-person"></i></span>
            <input type="text" className="form-control" placeholder="First Name" onChange={e => setFirstName(e.target.value)} />
          </div>
          <div className="input-group mb-3">
            <span className="input-group-text"><i className="bi bi-person"></i></span>
            <input type="text" className="form-control" placeholder="Last Name" onChange={e => setLastName(e.target.value)} />
          </div>
          <div className="input-group mb-3">
            <span className="input-group-text"><i className="bi bi-calendar"></i></span>
            <input type="number" className="form-control" placeholder="Age" onChange={e => setAge(e.target.value)} />
          </div>
          <div className="input-group mb-3">
            <span className="input-group-text"><i className="bi bi-envelope"></i></span>
            <input type="email" className="form-control" placeholder="Email" onChange={e => setEmail(e.target.value)} />
          </div>
          <div className="input-group mb-3">
            <span className="input-group-text"><i className="bi bi-lock"></i></span>
            <input type="password" className="form-control" placeholder="Password" onChange={e => setPassword(e.target.value)} />
          </div>
          <button className="btn btn-primary w-100" onClick={handleSignup} disabled={isSigningUp}>
            {isSigningUp ? (
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            ) : (
              <i className="bi-person-plus me-2"></i>
            )}{' '}{isSigningUp ? 'Signing up...' : 'Sign Up'}
          </button>
          <p className="mt-3 text-center">Already have an account? <a className="text-primary" href="/login"><i className="bi bi-box-arrow-in-right me-2"></i>Login</a></p>
        </div>
      </div>
    </div>
  );
}
