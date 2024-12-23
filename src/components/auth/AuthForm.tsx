import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { LogIn, UserPlus, ArrowLeft } from 'lucide-react';

export function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });
      
      if (error) throw error;
      
      setSuccess('Password reset instructions have been sent to your email.');
      setEmail('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send reset instructions');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (isLogin) {
        await signIn(email, password);
        navigate('/app'); 
      } else {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });
        
        if (signUpError) throw signUpError;
        
        if (data.user) {
          // Create initial profile
          const { error: profileError } = await supabase
            .from('profiles')
            .insert([{ id: data.user.id }])
            .select()
            .single();
            
          if (profileError) throw profileError;
        }
        
        setSuccess('Account created successfully! Please check your email for verification.');
        setEmail('');
        setPassword('');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <form onSubmit={handleSubmit} className="space-y-6">
        {isForgotPassword ? (
          <div>
            <button
              type="button"
              onClick={() => setIsForgotPassword(false)}
              className="mb-4 flex items-center text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to login
            </button>
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Reset Password</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              Enter your email address and we'll send you instructions to reset your password.
            </p>
          </div>
        ) : null}

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
        </div>

        {!isForgotPassword && <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
        </div>}

        {success && (
          <div className="rounded-md bg-green-50 p-4 dark:bg-green-900/50">
            <p className="text-sm text-green-700 dark:text-green-200">{success}</p>
          </div>
        )}

        {error && (
          <div className="rounded-md bg-red-50 p-4 dark:bg-red-900/50">
            <p className="text-sm text-red-700 dark:text-red-200">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          onClick={isForgotPassword ? handleForgotPassword : undefined}
          className="flex w-full items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 dark:hover:bg-blue-800 transition-colors"
        >
          {loading ? (
            'Processing...'
          ) : isForgotPassword ? (
            'Send Reset Instructions'
          ) : isLogin ? (
            <>
              <LogIn className="mr-2 h-4 w-4" />
              Sign In
            </>
          ) : (
            <>
              <UserPlus className="mr-2 h-4 w-4" />
              Sign Up
            </>
          )}
        </button>

        <div className="space-y-2">
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="w-full text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
          </button>

          {isLogin && !isForgotPassword && (
            <button
              type="button"
              onClick={() => setIsForgotPassword(true)}
              className="w-full text-sm text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              Forgot your password?
            </button>
          )}
        </div>
      </form>
    </div>
  );
}