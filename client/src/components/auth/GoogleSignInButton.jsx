import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../ui/Toast';

export const GoogleSignInButton = ({ label = 'Continue with Google' }) => {
  const navigate = useNavigate();
  const { loginWithGoogle } = useAuth();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const tokenClientRef = useRef(null);

  const googleClientId =
    import.meta.env.VITE_GOOGLE_CLIENT_ID ||
    '894400675739-05jcldhnve82v8nejgvsq52n4uqvaoq5.apps.googleusercontent.com';

  // Initialize Google Identity Services OAuth2 Token Client
  useEffect(() => {
    const scriptId = 'google-identity-script';
    let script = document.getElementById(scriptId);

    const initGIS = () => {
      if (window.google?.accounts?.oauth2) {
        tokenClientRef.current = window.google.accounts.oauth2.initTokenClient({
          client_id: googleClientId,
          scope: 'email profile openid',
          callback: async (tokenResponse) => {
            if (tokenResponse?.error) {
              console.error('Google OAuth token error:', tokenResponse);
              setLoading(false);
              return;
            }

            try {
              setLoading(true);
              // Fetch user profile from Google's official userinfo endpoint
              const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: {
                  Authorization: `Bearer ${tokenResponse.access_token}`,
                },
              });

              if (!res.ok) {
                throw new Error('Failed to retrieve user profile from Google');
              }

              const profile = await res.json();

              // Authenticate with our AfterBuy backend (stored in MongoDB Atlas)
              const user = await loginWithGoogle({
                name: profile.name || profile.given_name || 'Google User',
                email: profile.email,
                googleId: profile.sub,
                avatar: profile.picture || '',
              });

              addToast({
                title: 'Google Sign In Successful',
                message: `Welcome, ${user.name}!`,
                type: 'success',
              });

              navigate('/app/dashboard');
            } catch (err) {
              console.error('Google Sign In Error:', err);
              addToast({
                title: 'Google Sign In Failed',
                message: err.message || 'Could not verify Google account.',
                type: 'error',
              });
            } finally {
              setLoading(false);
            }
          },
        });
      }
    };

    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = initGIS;
      document.body.appendChild(script);
    } else {
      initGIS();
    }
  }, [googleClientId]);

  // Handle button click: opens Google's native account chooser popup
  const handleGoogleClick = () => {
    if (!tokenClientRef.current) {
      if (window.google?.accounts?.oauth2) {
        tokenClientRef.current = window.google.accounts.oauth2.initTokenClient({
          client_id: googleClientId,
          scope: 'email profile openid',
          callback: () => {},
        });
      } else {
        addToast({
          title: 'Google Services Loading',
          message: 'Connecting to Google services. Please try again in a few seconds.',
          type: 'info',
        });
        return;
      }
    }

    try {
      setLoading(true);
      // Trigger Google's popup; Google automatically closes the popup upon selection
      tokenClientRef.current.requestAccessToken({ prompt: 'select_account' });
    } catch (err) {
      console.error('Google OAuth trigger error:', err);
      setLoading(false);
      addToast({
        title: 'Google Sign In Error',
        message: 'Could not open Google authentication popup.',
        type: 'error',
      });
    }
  };

  return (
    <div className="w-full">
      {/* Sleek, tactile Google Button */}
      <button
        type="button"
        id="google-signin-btn"
        onClick={handleGoogleClick}
        disabled={loading}
        className="w-full h-12 px-4 rounded-xl border border-slate-200/90 dark:border-[#2D333F] bg-white dark:bg-[#13161C] hover:bg-slate-50 dark:hover:bg-[#1A1E27] text-slate-700 dark:text-[#E6EAF2] hover:text-slate-900 dark:hover:text-white font-medium text-sm shadow-xs hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-200 flex items-center justify-center gap-3 cursor-pointer select-none active:scale-[0.99] disabled:opacity-60"
      >
        {/* Crisp Multicolor Google G Logo SVG */}
        <svg className="w-[18px] h-[18px] shrink-0" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
          />
        </svg>
        <span>{loading ? 'Connecting to Google...' : label}</span>
      </button>
    </div>
  );
};
