"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import noodleImage from '@/assets/noodle.png';
import Logo from '@/assets/logosaas.png';
import { useRouter } from 'next/navigation';
import ReCAPTCHA from 'react-google-recaptcha';
import { GoogleOAuthProvider, GoogleLogin, CredentialResponse } from '@react-oauth/google';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const SignupPage = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    password: '',
    confirmPassword: '',
    mobile: '',
  });

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [captcha, setCaptcha] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setLoading(true);

    if (!formData.fullname || !formData.email || !formData.password || !formData.mobile) {
      setErrorMessage("Please fill in all the required fields!");
      setLoading(false);
      return;
    }

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(formData.email)) {
      setErrorMessage("Please enter a valid email address!");
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match!");
      setLoading(false);
      return;
    }

    const passwordPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>/?]).{8,}$/;
    if (!passwordPattern.test(formData.password)) {
      setErrorMessage("Password must be at least 8 characters long, include an uppercase letter, a number, and a special character.");
      setLoading(false);
      return;
    }

    if (!captcha) {
      setErrorMessage("Please complete the reCAPTCHA verification.");
      setLoading(false);
      return;
    }

    const signupData = { ...formData, captcha };

    try {
      const response = await fetch("http://localhost:5000/signup", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signupData),
      });

      const result = await response.json();
      if (response.ok) {
        setSuccessMessage(result.message || "Signup successful! Redirecting...");
        setTimeout(() => {
          const createdAt = new Date().toISOString();
          localStorage.setItem('profileCreatedAt', createdAt);
          router.push('/login');
        }, 2000);
      } else {
        setErrorMessage(result.message || "Signup failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during signup:", error);
      setErrorMessage("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (res: CredentialResponse) => {
    setErrorMessage(null);
    setSuccessMessage(null);
    setLoading(true);

    if (!res.credential) {
      setErrorMessage("No credential returned from Google");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/google-signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ id_token: res.credential }),
      });

      const payload = await response.json();

      if (response.ok) {
        const accessToken = payload.access_token;

        if (accessToken) {
          localStorage.setItem("token", accessToken);
          setSuccessMessage(payload.message || "Google Sign-in successful!");
          setTimeout(() => {
            router.push("/user-dashboard");
          }, 1500);
        } else {
          setErrorMessage("Access token not found in server response.");
        }
      } else {
        setErrorMessage(payload.message || "Google sign-in failed");
      }
    } catch (err) {
      console.error("Error calling Google-signin:", err);
      setErrorMessage("Server error during Google sign-in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID!}>
      <>
        <header className="sticky top-0 z-30 w-full backdrop-blur-md bg-white/70 shadow-sm transition-all duration-300">
          <div className="py-5">
            <div className="container flex items-center space-x-2">
              <Image src={Logo} alt="Logo here" height={40} width={40} />
              <a
                href="/"
                className="text-3xl font-bold tracking-wide font-sans bg-gradient-to-r from-[#fdc468] via-[#da0c50] to-[#b43a9c] text-transparent bg-clip-text hover:opacity-80 transition-all"
              >
                InstaGuard
              </a>
            </div>
          </div>
        </header>

        <section className="bg-gradient-to-b from-white to-[#FCE7F3] py-24 overflow-x-clip">
          <div className="container max-w-4xl mx-auto px-4">
            <div className="section-heading relative text-center">
              <h2 className="section-title text-3xl font-bold">Create an Account</h2>
              <p className="section-description mt-3">Sign up to get started. It only takes a few seconds!</p>

              {successMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="flex items-center gap-3 p-4 bg-green-100 border border-green-400 text-green-800 rounded-lg shadow-md"
                >
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm font-semibold">{successMessage}</span>
                </motion.div>
              )}

              {errorMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="flex items-center gap-3 p-4 bg-red-100 border border-red-400 text-red-800 rounded-lg shadow-md"
                >
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span className="text-sm font-semibold">{errorMessage}</span>
                </motion.div>
              )}

              
            </div>

            <motion.form
              onSubmit={handleSubmit}
              initial={{ scale: 0.95, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              viewport={{ once: true }}
              className="mt-10 space-y-6 bg-[#FCE7F3] p-6 rounded-lg shadow-lg"
            >
              <GoogleLogin onSuccess={handleGoogleLogin} onError={() => console.log("Login Failed!")} auto_select />

              <div className="flex flex-col gap-2">
                <label htmlFor="fullname" className="text-lg font-medium">Full Name</label>
                <input type="text" id="fullname" name="fullname" value={formData.fullname} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-lg font-medium">Email Address</label>
                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
              </div>

              <div className="flex flex-col gap-2 relative">
                <label htmlFor="password" className="text-lg font-medium">Password</label>
                <input type={passwordVisible ? 'text' : 'password'} id="password" name="password" value={formData.password} onChange={handleChange} className="w-full border rounded px-3 py-2 pr-10" required />
                <button type="button" className="absolute right-3 top-1/2 transform -translate-y-1/2" onClick={() => setPasswordVisible(!passwordVisible)}>
                  {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              <div className="flex flex-col gap-2 relative">
                <label htmlFor="confirmPassword" className="text-lg font-medium">Confirm Password</label>
                <input type={confirmPasswordVisible ? 'text' : 'password'} id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="w-full border rounded px-3 py-2 pr-10" required />
                <button type="button" className="absolute right-3 top-1/2 transform -translate-y-1/2" onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}>
                  {confirmPasswordVisible ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-lg font-medium">Mobile Number</label>
                <PhoneInput country={'us'} value={formData.mobile} onChange={(mobile) => setFormData({ ...formData, mobile })} inputProps={{ name: 'mobile', required: true }} inputClass="!w-full !px-3 !py-2 !border !rounded !text-base" buttonClass="!border-r !bg-white" containerClass="!w-full" />
                <div className="mt-4">
                  <ReCAPTCHA sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!} onChange={setCaptcha} />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full rounded py-2 text-white transition ${
                  loading ? "bg-pink-300 cursor-not-allowed" : "bg-[#da0c50] hover:bg-[#b43a9c]"
                } flex justify-center items-center gap-2`}
              >
                {loading && (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                )}
                {loading ? "Signing Up..." : "Sign Up"}
              </button>

              <p className="text-sm text-center mt-2">
                Already have an account? <a href="/login" className="text-pink-600 hover:underline">Login</a>
              </p>
            </motion.form>
          </div>
        </section>

        <footer className="bg-black text-[#BCBCBC] text-sm py-10 text-center ">
          <div className="container">
            <div className="inline-flex relative before:content-[''] before:top-2 before:bottom-0 before:h-full before:blur before:w-full before:bg-[linear-gradient(to-right , #FCE7F3,#fccde2,#fff)] before:absolute">
              <Image src={Logo} alt="logo here" height={40} className="relative" />
            </div>
          </div>
          <p className="mt-6 text-white">&copy; InstaGuard, Inc. All rights reserved.</p>
        </footer>
      </>
    </GoogleOAuthProvider>
  );
};

export default SignupPage;
