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
          <div className="form-floating mb-3">
            <input type="text" className="form-control" id="firstNameInput" placeholder="First Name" onChange={e => setFirstName(e.target.value)} />
            <label htmlFor="firstNameInput"><i className="bi bi-person me-2"></i>First Name</label>
          </div>
          <div className="form-floating mb-3">
            <input type="text" className="form-control" id="lastNameInput" placeholder="Last Name" onChange={e => setLastName(e.target.value)} />
            <label htmlFor="lastNameInput"><i className="bi bi-person me-2"></i>Last Name</label>
          </div>
          <div className="form-floating mb-3">
            <input type="number" className="form-control" id="ageInput" placeholder="Age" onChange={e => setAge(e.target.value)} />
            <label htmlFor="ageInput"><i className="bi bi-calendar me-2"></i>Age</label>
          </div>
          <div className="form-floating mb-3">
            <input type="email" className="form-control" id="emailInput" placeholder="Email" onChange={e => setEmail(e.target.value)} />
            <label htmlFor="emailInput"><i className="bi bi-envelope me-2"></i>Email</label>
          </div>
          <div className="form-floating mb-3">
            <input type="password" className="form-control" id="passwordInput" placeholder="Password" onChange={e => setPassword(e.target.value)} />
            <label htmlFor="passwordInput"><i className="bi bi-lock me-2"></i>Password</label>
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
