'use client';

import { Suspense, useState } from 'react';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { CardAtom } from '@/components/atoms/Card.atom';
import { TextAtom } from '@/components/atoms/Text.atom';
import { ButtonAtom } from '@/components/atoms/Button.atom';
import { InputAtom } from '@/components/atoms/Input.atom';
import { LabelAtom } from '@/components/atoms/Label.atom';
import { DynamicIconAtom } from '@/components/atoms/DynamicIcon.atom';
import { toast } from '@/lib/toast';

function LoginForm() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // Sign in with NextAuth
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error || !result?.ok) {
        const errorMsg = 'Invalid email or password';
        setError(errorMsg);
        toast({
          title: 'Login Failed',
          description: errorMsg,
          type: 'error',
        });
        setIsLoading(false);
        return;
      }

      // Check for active session to determine redirect
      const sessionResponse = await fetch('/api/sessions');
      const sessionData = await sessionResponse.json();

      // Success - redirect based on active session
      toast({
        title: 'Login Successful',
        description: 'Redirecting...',
        type: 'success',
      });

      let redirectUrl = searchParams.get('callbackUrl') || '/charting/start';

      // If there's an active session, redirect to where they left off
      if (sessionData.session?.isActive) {
        const step = sessionData.session.currentStep;
        if (step === 'adls') {
          redirectUrl = '/charting/adls';
        } else if (step === 'review') {
          redirectUrl = '/charting/review';
        }
      }

      window.location.href = redirectUrl;
    } catch (err) {
      const errorMsg = 'An unexpected error occurred. Please try again.';
      setError(errorMsg);
      toast({
        title: 'Error',
        description: errorMsg,
        type: 'error',
      });
      setIsLoading(false);
    }
  };

  return (
    <CardAtom>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Error Message */}
        {error && (
          <div className="flex items-start space-x-3 p-4 bg-red-50 border border-red-200 rounded-lg">
            <DynamicIconAtom name="TriangleAlert" size="sm" className="text-red-500 mt-0.5" />
            <div className="flex-1">
              <TextAtom className="text-red-800 text-sm font-medium">Login Failed</TextAtom>
              <TextAtom className="text-red-700 text-sm mt-1">{error}</TextAtom>
            </div>
          </div>
        )}

        {/* Email Field */}
        <div className="space-y-2">
          <LabelAtom htmlFor="email">Email Address</LabelAtom>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <DynamicIconAtom name="Mail" size="sm" className="text-gray-400" />
            </div>
            <InputAtom
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              disabled={isLoading}
              className="pl-10"
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <LabelAtom htmlFor="password">Password</LabelAtom>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <DynamicIconAtom name="Lock" size="sm" className="text-gray-400" />
            </div>
            <InputAtom
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              disabled={isLoading}
              className="pl-10"
            />
          </div>
        </div>

        {/* Submit Button */}
        <ButtonAtom
          type="submit"
          className="w-full"
          disabled={isLoading || !email || !password}
          isLoading={isLoading}
          loadingText="Signing in..."
        >
          <DynamicIconAtom name="LogIn" size="sm" className="mr-2" />
          Sign In
        </ButtonAtom>
      </form>
    </CardAtom>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-4">
            <DynamicIconAtom name="Hospital" size="lg" className="text-white" />
          </div>
          <TextAtom variant="h1" className="text-gray-900 mb-2">
            SmartChart Pro
          </TextAtom>
          <TextAtom className="text-gray-600">Sign in to your account</TextAtom>
        </div>

        {/* Login Form */}
        <Suspense fallback={<CardAtom>Loading...</CardAtom>}>
          <LoginForm />
        </Suspense>

        {/* Footer Info */}
        <div className="mt-6 text-center">
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
            <DynamicIconAtom name="Info" size="sm" />
            <TextAtom variant="small" className="text-gray-500">
              Contact your administrator if you need help accessing your account
            </TextAtom>
          </div>
        </div>
      </div>
    </div>
  );
}
