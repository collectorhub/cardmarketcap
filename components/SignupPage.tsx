"use client"

import React, { Suspense, useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { FcGoogle } from 'react-icons/fc' 
import { FaFacebook, FaApple, FaDiscord } from 'react-icons/fa' 
import { FaXTwitter } from 'react-icons/fa6' 
import { Button } from "@/components/ui/button"
import Cookies from 'js-cookie'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
const BASE_URL = process.env.NEXT_PUBLIC_APP_URL;

function SignupPageFunc() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const externalError = searchParams.get('error');
  
  const initialFormState = {
    email: '',
    password: '',
    username: '',
    full_name: '', 
    marketing_accepted: true,
  };

  const [formData, setFormData] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
  if (externalError) {
    // We map the OAuth error to the email field since that's usually the conflict
    setErrors((prev) => ({
      ...prev,
      email: decodeURIComponent(externalError)
    }));
  }
}, [externalError]);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.full_name.trim()) newErrors.full_name = "Full name is required.";
    if (!formData.email || !emailRegex.test(formData.email)) newErrors.email = "Valid email is required.";
    if (formData.password.length < 8) newErrors.password = "Min 8 characters required.";
    if (!formData.username || formData.username.includes(" ")) newErrors.username = "Username cannot have spaces.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSocialLogin = async (provider: string) => {
    // window.location.origin dynamically handles localhost, vercel, or cardmarketcap.io
    const callbackUrl = `${window.location.origin}/api/auth/callback/${provider}`;
    
    let rootUrl = "";
    let options: Record<string, string> = {};

    switch (provider) {
      case 'google':
        rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";
        options = {
          redirect_uri: callbackUrl,
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
          access_type: "offline",
          response_type: "code",
          prompt: "consent",
          scope: "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email",
          state: provider,
        };
        break;

      case 'discord':
        rootUrl = "https://discord.com/api/oauth2/authorize";
        options = {
          client_id: process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID!, // Add this to your .env
          redirect_uri: callbackUrl,
          response_type: "code",
          scope: "identify email",
          state: provider,
        };
        break;

      case 'twitter':
        rootUrl = "https://twitter.com/i/oauth2/authorize";

        // Generate a proper PKCE code_verifier (43-128 chars, URL-safe)
        const array = new Uint8Array(32);
        crypto.getRandomValues(array);
        const verifier = btoa(String.fromCharCode(...array))
          .replace(/\+/g, '-')
          .replace(/\//g, '_')
          .replace(/=/g, '');

        // Generate code_challenge = BASE64URL(SHA-256(verifier))
        const encoder = new TextEncoder();
        const data = encoder.encode(verifier);
        const digest = await crypto.subtle.digest('SHA-256', data);
        const challenge = btoa(String.fromCharCode(...new Uint8Array(digest)))
          .replace(/\+/g, '-')
          .replace(/\//g, '_')
          .replace(/=/g, '');

        Cookies.set('twitter_code_verifier', verifier, { expires: 1, path: '/' });

        options = {
          response_type: "code",
          client_id: process.env.NEXT_PUBLIC_TWITTER_CLIENT_ID!,
          redirect_uri: callbackUrl,
          scope: "users.read tweet.read",  // ⚠️ remove email.read — not a valid Twitter scope
          state: provider,
          code_challenge: challenge,        // hashed challenge, not the verifier
          code_challenge_method: "S256",
        };
        break;
    }

    if (rootUrl) {
      const qs = new URLSearchParams(options).toString();
      window.location.href = `${rootUrl}?${qs}`;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/signup.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, is_oauth: false }),
      });

      const result = await response.json();

      if (result.success) {
        localStorage.setItem('user_token', result.token);
        localStorage.setItem('user_data', JSON.stringify(result.user));
        Cookies.set('user_token', result.token, { 
          expires: 7,    // Keeps user logged in for 7 days
          path: '/',     // Makes cookie available on all pages
          secure: true,  // Recommended for production
          sameSite: 'strict' 
        });
        window.dispatchEvent(new Event('storage'));
        router.push('/'); 
      } else {
        alert("Error: " + result.message);
      }
    } catch (error) {
      console.error("Signup error:", error);
      alert("Failed to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 flex flex-col md:flex-row font-sans selection:bg-[#00BA88]/20">
      
      {/* --- LEFT SIDE: BRAND/MARKETING SECTION --- */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative w-full md:w-1/2 bg-[#040d21] p-10 md:p-20 flex flex-col justify-between min-h-[550px] md:h-screen md:sticky md:top-0 overflow-hidden"
      >
        <div className="absolute inset-0 z-0">
          <Image 
            src="/auth-bg.jpg" 
            alt="Market background"
            fill
            className="object-cover opacity-10 mix-blend-overlay"
            priority
            onError={(e) => (e.currentTarget.style.display = 'none')} 
          />
          
          <div className="absolute bottom-0 left-0 w-full h-[380px] md:h-[480px] pointer-events-none">
            <Image 
              src="/signup-banner.jpeg" 
              alt="Background characters" 
              fill 
              className="object-cover object-bottom"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-transparent via-[#040d21]/10 to-[#040d21] top-[-2px]" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#040d21]/40 via-transparent to-[#040d21]/40" />
          </div>
          <div className="absolute bottom-0 left-0 w-full h-[20%] bg-gradient-to-t from-[#040d21] to-transparent pointer-events-none z-10" />
        </div>

        <div className="relative z-20">
          <Link href="/" className="flex items-center gap-2 mb-10">
            <div className="relative h-10 w-10">
              <Image src="/logo.png" alt="Logo" fill className="object-contain" />
            </div>
            <span className="text-xl font-bold tracking-tighter text-white font-heading">
              CardMarket<span className="text-[#00BA88]">Cap</span>
            </span>
          </Link>

          <div className="max-w-lg">
            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-[1.05] mb-4 font-sora selection:text-white selection:bg-[#00BA88]/30">
              Create your <br /> 
              <span className="text-[#00BA88]">free account</span>
            </h1>
            <p className="text-slate-400 text-[14px] font-medium leading-relaxed mb-12 max-w-md">
              Explore CardMarketCap&apos;s core features for individuals and organizations.
            </p>
          </div>
        </div>
      </motion.div>

      {/* --- RIGHT SIDE: SIGN UP FORM --- */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-16 bg-white dark:bg-slate-950">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-[440px] py-10"
        >
          <div className="mb-8 flex justify-between items-baseline border-b border-slate-100 dark:border-slate-800 pb-6">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white tracking-tight font-sora">Sign up to CardMarketCap</h2>
            <div className="text-[13px] text-slate-500">
              Already have an account? <Link href="/sign-in" className="text-[#00BA88] hover:underline font-bold">Sign in →</Link>
            </div>
          </div>

          {/* --- Updated Social Buttons Grid --- */}
          <div className="grid grid-cols-2 gap-3 mb-8">
            <Button 
              onClick={() => handleSocialLogin('google')} 
              variant="outline" 
              className="w-full rounded-md font-semibold h-12 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all text-[14px]"
            >
              <FcGoogle className="mr-2 h-5 w-5" /> Google
            </Button>

            <Button 
              onClick={() => handleSocialLogin('apple')} 
              variant="outline" 
              className="w-full rounded-md font-semibold h-12 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all text-[14px]"
            >
              <FaApple className="mr-2 h-5 w-5" /> Apple
            </Button>
            
            <Button 
              onClick={() => handleSocialLogin('twitter')} 
              variant="outline" 
              className="w-full rounded-md font-semibold h-12 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all text-[14px]"
            >
              <FaXTwitter className="mr-2 h-5 w-5 dark:text-white" /> X (Twitter)
            </Button>

            <Button 
              onClick={() => handleSocialLogin('discord')} 
              variant="outline" 
              className="w-full rounded-md font-semibold h-12 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all text-[14px]"
            >
              <FaDiscord className="mr-2 h-5 w-5 dark:text-white" /> Discord
            </Button>
          </div>

          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-200 dark:border-slate-800" /></div>
            <div className="relative flex justify-center text-[12px] font-medium text-slate-400">
              <span className="bg-white dark:bg-slate-950 px-4 italic">or email signup</span>
            </div>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit} noValidate>
            <div className="space-y-2">
              <label className="text-[14px] font-semibold text-slate-900 dark:text-slate-200 block">Full Name *</label>
              <input 
                type="text" 
                placeholder="John Doe"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                className={`w-full h-11 bg-transparent dark:bg-slate-900 border ${errors.full_name ? 'border-red-500' : 'border-[#d0d7de]'} dark:border-slate-700 rounded-md px-3 text-[14px] focus:ring-2 focus:ring-[#00BA88]/20 focus:border-[#00BA88] outline-none transition-all dark:text-white placeholder:text-slate-400`}
                required
              />
              {errors.full_name && <p className="text-red-500 text-[12px] font-medium">{errors.full_name}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-[14px] font-semibold text-slate-900 dark:text-slate-200 block">Email *</label>
              <input 
                type="email" 
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={`w-full h-11 bg-transparent dark:bg-slate-900 border ${errors.email ? 'border-red-500' : 'border-[#d0d7de]'} dark:border-slate-700 rounded-md px-3 text-[14px] focus:ring-2 focus:ring-[#00BA88]/20 focus:border-[#00BA88] outline-none transition-all dark:text-white placeholder:text-slate-400`}
                required
              />
              {errors.email && <p className="text-red-500 text-[12px] font-medium">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-[14px] font-semibold text-slate-900 dark:text-slate-200 block">Password *</label>
              <input 
                type="password" 
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className={`w-full h-11 bg-transparent dark:bg-slate-900 border ${errors.password ? 'border-red-500' : 'border-[#d0d7de]'} dark:border-slate-700 rounded-md px-3 text-[14px] focus:ring-2 focus:ring-[#00BA88]/20 focus:border-[#00BA88] outline-none transition-all dark:text-white placeholder:text-slate-400`}
                required
              />
              {errors.password && <p className="text-red-500 text-[12px] font-medium">{errors.password}</p>}
              <p className="text-[12px] text-slate-500 leading-normal px-0.5">
                Password should be at least 15 characters OR at least 8 characters including a number and a lowercase letter.
              </p>
            </div>
            
            <div className="space-y-2">
              <label className="text-[14px] font-semibold text-slate-900 dark:text-slate-200 block">Username *</label>
              <input 
                type="text" 
                placeholder="Username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className={`w-full h-11 bg-transparent dark:bg-slate-900 border ${errors.username ? 'border-red-500' : 'border-[#d0d7de]'} dark:border-slate-700 rounded-md px-3 text-[14px] focus:ring-2 focus:ring-[#00BA88]/20 focus:border-[#00BA88] outline-none transition-all dark:text-white placeholder:text-slate-400`}
                required
              />
              {errors.username && <p className="text-red-500 text-[12px] font-medium">{errors.username}</p>}
              <p className="text-[12px] text-slate-500 leading-normal px-0.5">
                Username may only contain alphanumeric characters or single hyphens.
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <h3 className="text-[14px] font-semibold text-slate-900 dark:text-slate-200 mb-3">Email preferences</h3>
              <div className="flex items-start gap-3">
                <input 
                  type="checkbox" 
                  id="marketing-emails"
                  checked={formData.marketing_accepted}
                  onChange={(e) => setFormData({ ...formData, marketing_accepted: e.target.checked })}
                  className="mt-1 h-4 w-4 rounded border-[#d0d7de] text-[#00BA88] focus:ring-[#00BA88] cursor-pointer"
                />
                <div className="space-y-1">
                  <label htmlFor="marketing-emails" className="text-[13px] text-slate-700 dark:text-slate-300 font-medium cursor-pointer">
                    Receive occasional card updates and announcements
                  </label>
                </div>
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={loading}
              className="w-full h-12 bg-[#00BA88] dark:bg-slate-100 dark:text-slate-900 hover:bg-[#048f6a] dark:hover:bg-white text-white font-bold rounded-md shadow-md mt-6 active:scale-[0.98] transition-all group text-[14px] cursor-pointer"
            >
              {loading ? 'Creating...' : 'Create account'} 
              <span className="ml-2 group-hover:translate-x-1 transition-transform inline-block">›</span>
            </Button>
          </form>

          <div className="mt-8">
            <p className="text-[12px] text-slate-500 leading-relaxed">
              By creating an account, you agree to the <Link href="#" className="text-[#00BA88] hover:underline font-bold">Terms of Service</Link>. 
              For more information about CardMarketCap&apos;s privacy practices, see the <Link href="#" className="text-[#00BA88] hover:underline font-bold">CardMarketCap Privacy Statement</Link>. 
              We&apos;ll occasionally send you account-related emails.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignupPageFunc />
    </Suspense>
  );
}