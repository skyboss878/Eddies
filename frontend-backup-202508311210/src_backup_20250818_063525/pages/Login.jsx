// src/pages/Login.jsx - Fixed version with better error handling and debugging
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const { login, isAuthenticated, loading, error: authError } = useAuth();
const [email, setEmail] = useState('admin@eddiesautomotive.com');
const [password, setPassword] = useState('adminpassword123');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  
  // Redirect destination
  const from = location.state?.from?.pathname || '/dashboard';
  
  console.log('Login: Component state:', {
    isAuthenticated,
    loading,
    authError,
    from,
    email
  });

  // Handle redirect after successful authentication
  useEffect(() => {
    console.log('Login: useEffect - checking auth state:', { isAuthenticated, loading });
    
    if (isAuthenticated && !loading) {
      console.log('Login: Authenticated! Redirecting to:', from);
      // Small delay to ensure auth state is fully settled
      setTimeout(() => {
        navigate(from, { replace: true });
      }, 100);
    }
  }, [isAuthenticated, loading, navigate, from]);

  // Clear errors when auth error changes
  useEffect(() => {
    if (authError) {
      setError(authError);
    }
  }, [authError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Login: Form submitted');
    
    // Reset errors
    setError('');
    setSubmitting(true);

    // Basic validation
    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password');
      setSubmitting(false);
      return;
    }

    try {
      console.log('Login: Attempting login for:', email);
      
      const result = await login(email.trim(), password);
      console.log('Login: Login result:', result);
      
      if (!result.success) {
        console.error('Login: Login failed:', result.error);
        setError(result.error || 'Login failed. Please try again.');
        setSubmitting(false);
      } else {
        console.log('Login: Login successful, waiting for redirect...');
        // Success - the useEffect will handle the redirect
        // Don't set submitting to false here, let the redirect happen
      }
    } catch (err) {
      console.error('Login: Exception during login:', err);
      setError(err.message || 'An unexpected error occurred. Please try again.');
      setSubmitting(false);
    }
  };

  // Show loading state if auth is still initializing
  if (loading && !submitting) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Arial, sans-serif'
      }}>
        <div style={{
          background: 'white',
          padding: '40px',
          borderRadius: '10px',
          boxShadow: '0 15px 35px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #667eea',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          <p>Checking authentication...</p>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        background: 'white',
        padding: '40px',
        borderRadius: '10px',
        boxShadow: '0 15px 35px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '400px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{
            color: '#333',
            marginBottom: '10px',
            fontSize: '28px'
          }}>
            🔧 Eddie's Automotive
          </h1>
          <p style={{ color: '#666', margin: 0 }}>Management System</p>
        </div>

        {/* Debug Info - Remove in production */}
        <div style={{
          background: '#f0f8ff',
          border: '1px solid #b0d4f1',
          borderRadius: '5px',
          padding: '10px',
          marginBottom: '20px',
          fontSize: '12px',
          color: '#333'
        }}>
          <strong>Debug Info:</strong><br />
          Auth: {isAuthenticated ? '✅' : '❌'} | 
          Loading: {loading ? '⏳' : '✅'} | 
          Redirect: {from}
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '5px',
              color: '#333',
              fontWeight: 'bold'
            }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #ddd',
                borderRadius: '5px',
                fontSize: '16px',
                boxSizing: 'border-box'
              }}
              required
              disabled={submitting}
              placeholder="Enter your email"
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '5px',
              color: '#333',
              fontWeight: 'bold'
            }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #ddd',
                borderRadius: '5px',
                fontSize: '16px',
                boxSizing: 'border-box'
              }}
              required
              disabled={submitting}
              placeholder="Enter your password"
            />
          </div>

          {error && (
            <div style={{
              background: '#fee',
              color: '#c33',
              padding: '12px',
              borderRadius: '5px',
              marginBottom: '20px',
              border: '1px solid #fcc',
              fontSize: '14px'
            }}>
              ⚠️ {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            style={{
              width: '100%',
              padding: '12px',
              background: submitting ? '#ccc' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: submitting ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              position: 'relative'
            }}
          >
            {submitting ? (
              <span>
                <span style={{
                  display: 'inline-block',
                  width: '16px',
                  height: '16px',
                  border: '2px solid #ffffff',
                  borderRadius: '50%',
                  borderTopColor: 'transparent',
                  animation: 'spin 1s linear infinite',
                  marginRight: '8px'
                }}></span>
                Logging in...
              </span>
            ) : (
              '🔐 Login'
            )}
          </button>
        </form>

        <div style={{
          marginTop: '25px',
          textAlign: 'center',
          borderTop: '1px solid #eee',
          paddingTop: '20px'
        }}>
          <p style={{
            color: '#666',
            fontSize: '14px',
            margin: '0 0 15px 0'
          }}>
            Don't have an account?
          </p>
          <Link
            to="/register"
            style={{
              color: '#667eea',
              textDecoration: 'none',
              fontWeight: 'bold',
              fontSize: '16px',
              padding: '10px 20px',
              border: '2px solid #667eea',
              borderRadius: '5px',
              display: 'inline-block',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.target.style.background = '#667eea';
              e.target.style.color = 'white';
            }}
            onMouseOut={(e) => {
              e.target.style.background = 'transparent';
              e.target.style.color = '#667eea';
            }}
          >
            ✨ Create Account
          </Link>
        </div>

        <div style={{
          marginTop: '20px',
          textAlign: 'center',
          color: '#666',
          fontSize: '14px'
        }}>
          Demo credentials pre-filled ✨
        </div>

        {/* Test Buttons for debugging */}
        <div style={{
          marginTop: '20px',
          textAlign: 'center',
          borderTop: '1px solid #eee',
          paddingTop: '15px'
        }}>
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            style={{
              background: 'transparent',
              border: '1px solid #ddd',
              color: '#666',
              padding: '8px 12px',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '12px',
              marginRight: '10px'
            }}
          >
            🧪 Test Dashboard
          </button>
          <button
            type="button"
            onClick={() => {
              console.log('Current auth state:', { isAuthenticated, loading, error: authError });
              alert(`Auth: ${isAuthenticated}, Loading: ${loading}`);
            }}
            style={{
              background: 'transparent',
              border: '1px solid #ddd',
              color: '#666',
              padding: '8px 12px',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            🔍 Check Auth
          </button>
        </div>

        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
};

export default Login;
