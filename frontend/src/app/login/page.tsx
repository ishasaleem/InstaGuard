'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Logo from '@/assets/logosaas.png';
import ReCAPTCHA from 'react-google-recaptcha';
import { useRouter } from 'next/navigation';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { GoogleOAuthProvider, GoogleLogin, CredentialResponse } from '@react-oauth/google';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [captcha, setCaptcha] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!captcha) {
      setErrorMessage("Please complete the CAPTCHA.");
      return;
    }

    try {
      const { email, password } = formData;

      if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
        setErrorMessage("Invalid form data.");
        return;
      }

      setLoading(true);

      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, captcha }),
      });

      const result = await response.json();

      if (response.ok) {
        localStorage.setItem('token', result.token);
        localStorage.setItem('role', result.role);
        localStorage.setItem('loginTime', new Date().toISOString());

        setSuccessMessage("Login successful! Redirecting...");

        setTimeout(() => {
          if (result.role === 'admin') {
            router.push('/admin-dashboard');
          } else {
            router.push('/user-dashboard');
          }
        }, 1500);
      } else {
        setErrorMessage(result.message || "Login failed.");
      }
    } catch (error) {
      console.error('Error logging in:', error);
      setErrorMessage('An error occurred during login.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (res: CredentialResponse) => {
    if (!res.credential) {
      setErrorMessage("No credential returned from Google");
      return;
    }

    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const response = await fetch("http://localhost:5000/google-signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ id_token: res.credential }),
      });

      const result = await response.json();

      if (response.ok) {
        localStorage.setItem('token', result.access_token);
        localStorage.setItem('role', result.role);
        setSuccessMessage("Google sign-in successful!");

        setTimeout(() => {
          if (result.role === 'admin') {
            router.push('/admin-dashboard');
          } else {
            router.push('/user-dashboard');
          }
        }, 1500);
      } else {
        setErrorMessage(result.message || "Google sign-in failed");
      }
    } catch (err) {
      console.error("Google login error:", err);
      setErrorMessage("Server error during Google sign-in");
    } finally {
      setLoading(false);
    }
  };

  if (!siteKey || !clientId) {
    console.error("Missing site key or Google Client ID");
    return <p className="text-red-600 text-center mt-10">reCAPTCHA or Google OAuth not configured.</p>;
  }

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <>
        {/* Header */}
        <header className="sticky top-0 bg-white shadow-sm z-20">
          <div className="py-5">
            <div className="container flex items-center space-x-2">
              <Image src={Logo} alt="Logo here" height={40} width={40} />
              <a
                href="/"
                className="text-3xl font-bold tracking-wide font-sans bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 text-transparent bg-clip-text hover:opacity-80 transition-all"
              >
                InstaGuard
              </a>
            </div>
          </div>
        </header>

        {/* Main Section */}
        <section className="bg-gradient-to-b from-white to-[#ffeef3] py-24 overflow-x-clip">
          <div className="container max-w-3xl mx-auto px-4">
            <div className="text-center">
              <h2 className=" section-title text-3xl font-bold">Welcome Back</h2>
              <p className="mt-3">Log in to continue using InstaGuard.</p>
            </div>

            {successMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-center gap-3 p-4 bg-green-100 border border-purple-400 text-purple-800 rounded-lg shadow-md mt-6"
              >
                <span className="text-sm font-semibold">{successMessage}</span>
              </motion.div>
            )}

            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-center gap-3 p-4 bg-red-100 border border-red-400 text-red-800 rounded-lg shadow-md mt-6"
              >
                <span className="text-sm font-semibold">{errorMessage}</span>
              </motion.div>
            )}

            <motion.form
              onSubmit={handleSubmit}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mt-10 space-y-6 bg-[#ffeef3] p-6 rounded-lg shadow-lg"
            >
              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-lg font-medium">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="flex flex-col gap-2 relative">
                <label htmlFor="password" className="text-lg font-medium">Password</label>
                <input
                  type={passwordVisible ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="input-field pr-12"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xl text-gray-700"
                  onClick={() => setPasswordVisible(!passwordVisible)}
                >
                  {passwordVisible ? <AiFillEyeInvisible /> : <AiFillEye />}
                </button>
              </div>

              <div className="my-4" aria-label="CAPTCHA challenge">
                <ReCAPTCHA sitekey={siteKey} onChange={setCaptcha} />
              </div>

              <button
                type="submit"
                className="w-full bg-[#da0c50] hover:bg-[#b43a9c] py-2 text-white transition flex items-center justify-center disabled:opacity-70"
                disabled={loading}
              >
                {loading && (
                  <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                )}
                {loading ? 'Logging in...' : 'Login'}
              </button>

              <div className="text-center mt-2">
                Don’t have an account?{' '}
                <a href="/signup" className="text-pink-600 hover:underline">Sign Up</a>
              </div>
            </motion.form>

            {/* Google Login */}
            <div className="mt-6 text-center">
              <GoogleLogin
                onSuccess={handleGoogleLogin}
                onError={() => setErrorMessage("Google login failed")}
                auto_select
              />
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-black text-white text-sm py-10 text-center mt-10">
          <div className="container">
            <div className="inline-flex relative before:content-[''] before:top-2 before:bottom-0 before:h-full before:blur before:w-full before:bg-[linear-gradient(to-right , #F87BFF,#FB92CF,#FFDD9B,#C2F0B1,#2FD8FE)] before:absolute">
              <Image src={Logo} alt="logo here" height={40} className="relative" />
            </div>
          </div>
          <p className="mt-6">&copy; InstaGuard, Inc. All rights reserved.</p>
        </footer>
      </>
    </GoogleOAuthProvider>
  );
}
