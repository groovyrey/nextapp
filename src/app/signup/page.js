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
  const router = useRouter();
  const { user, loading } = useUser();

  useEffect(() => {
    if (!loading && user) {
      router.push('/');
    }
  }, [user, loading, router]);

  const handleSignup = async () => {
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
          <h2 className="card-title">Sign Up</h2>
          {error && <p className="text-danger">{error}</p>}
          <input type="text" className="form-control my-2" placeholder="First Name" onChange={e => setFirstName(e.target.value)} />
          <input type="text" className="form-control my-2" placeholder="Last Name" onChange={e => setLastName(e.target.value)} />
          <input type="number" className="form-control my-2" placeholder="Age" onChange={e => setAge(e.target.value)} />
          <input type="email" className="form-control my-2" placeholder="Email" onChange={e => setEmail(e.target.value)} />
          <input type="password" className="form-control my-2" placeholder="Password" onChange={e => setPassword(e.target.value)} />
          <button className="btn btn-primary" onClick={handleSignup}><i className="bi-person-plus"></i> Sign Up</button>
          <p className="mt-3">Already have an account? <a className="text-primary" href="/login">Login</a></p>
        </div>
      </div>
    </div>
  );
}
