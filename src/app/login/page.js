'use client';

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./lib/firebase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
 const [email, setEmail] = useState('');
 const [password, setPassword] = useState('');
 const [error, setError] = useState('');
 const router = useRouter();
 
 const handleLogin = async () => {
  try {
   await signInWithEmailAndPassword(auth, email, password);
   router.push("/dashboard"); // redirect after login
  } catch (err) {
   setError("Login failed: " + err.message);
  }
 };
 
 return (
  <div className="container mt-5">
      <h2>Login</h2>
      {error && <p className="text-danger">{error}</p>}
      <input type="email" className="form-control my-2" placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <input type="password" className="form-control my-2" placeholder="Password" onChange={e => setPassword(e.target.value)} />
      <button className="btn btn-primary" onClick={handleLogin}>Login</button>
    </div>
 );
}