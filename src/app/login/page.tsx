'use client';

import { Suspense, useState } from 'react';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { CardAtom } from '@/components/atoms/Card.atom';
import { TextAtom } from '@/components/atoms/Text.atom';
import { DynamicIconAtom } from '@/components/atoms/DynamicIcon.atom';
import { toast } from '@/lib/toast';
import { DEMO_CONFIG } from '@/lib/demo-config';

function LoginForm() {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingRole, setLoadingRole] = useState<'admin' | 'cna' | null>(null);

  const handleDemoLogin = async (email: string, role: 'admin' | 'cna') => {
    setIsLoading(true);
    setLoadingRole(role);

    try {
      const result = await signIn('credentials', {
        email,
        password: 'demo',
        redirect: false,
      });

      if (result?.error || !result?.ok) {
        toast({
          title: 'Login Failed',
          description: 'Unable to sign in. Please try again.',
          type: 'error',
        });
        setIsLoading(false);
        setLoadingRole(null);
        return;
      }

      toast({
        title: 'Welcome!',
        description: `Signed in as ${role === 'admin' ? 'Administrator' : 'CNA'}`,
        type: 'success',
      });

      // Redirect based on role
      const redirectUrl = role === 'admin' ? '/admin' : '/charting/start';
      window.location.href = searchParams.get('callbackUrl') || redirectUrl;
    } catch (err) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred.',
        type: 'error',
      });
      setIsLoading(false);
      setLoadingRole(null);
    }
  };

  return (
    <>
      <CardAtom>
        <div className="space-y-6">
          {DEMO_CONFIG.enabled && (
            <div className="text-center pb-4 border-b border-gray-200">
              <div className="inline-flex items-center space-x-2 px-3 py-1.5 bg-blue-50 rounded-full mb-3">
                <DynamicIconAtom name="Info" size="sm" className="text-blue-600" />
                <TextAtom variant="small" className="text-blue-700 font-medium">
                  Demo Mode
                </TextAtom>
              </div>
              <TextAtom variant="small" className="text-gray-600">
                Click below to start charting
              </TextAtom>
            </div>
          )}

          {/* CNA Login Button */}
          <button
            onClick={() => handleDemoLogin('cna@demo.com', 'cna')}
            disabled={isLoading}
            className="w-full group p-4 border-2 border-gray-200 rounded-lg hover:border-primary hover:bg-primary/5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                  <DynamicIconAtom name="User" size="md" className="text-primary" />
                </div>
                <div className="text-left">
                  <TextAtom className="font-semibold text-gray-900">Start Charting</TextAtom>
                  <TextAtom variant="small" className="text-gray-600">
                    Care documentation & charting
                  </TextAtom>
                </div>
              </div>
              {loadingRole === 'cna' ? (
                <DynamicIconAtom name="Loader" size="sm" className="text-primary animate-spin" />
              ) : (
                <DynamicIconAtom
                  name="ArrowRight"
                  size="sm"
                  className="text-gray-400 group-hover:text-primary transition-colors"
                />
              )}
            </div>
          </button>

          {DEMO_CONFIG.enabled && (
            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-start space-x-2 text-gray-500">
                <DynamicIconAtom name="Lightbulb" size="sm" className="mt-0.5 flex-shrink-0" />
                <TextAtom variant="small" className="text-gray-600">
                  This is a portfolio demonstration. All data is simulated and changes are not
                  persisted.
                </TextAtom>
              </div>
            </div>
          )}
        </div>
      </CardAtom>
    </>
  );
}

export default function LoginPage() {
  return (
    <div className="h-full bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-4">
            <DynamicIconAtom name="Hospital" size="lg" className="text-white" />
          </div>
          <TextAtom variant="h1" className="text-gray-900 mb-2">
            SmartChart Pro
          </TextAtom>
          <TextAtom className="text-gray-600">Healthcare Documentation System</TextAtom>
        </div>

        {/* Login Form */}
        <Suspense
          fallback={
            <CardAtom>
              <div className="flex items-center justify-center py-8">
                <DynamicIconAtom name="Loader" size="md" className="animate-spin text-primary" />
              </div>
            </CardAtom>
          }
        >
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
