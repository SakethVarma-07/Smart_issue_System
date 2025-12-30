// import React, { useRef, useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { createUserWithEmailAndPassword } from 'firebase/auth';
// import { auth } from '../../firebase';

// const Signup: React.FC = () => {
//   const emailRef = useRef<HTMLInputElement>(null);
//   const passwordRef = useRef<HTMLInputElement>(null);
//   const passwordConfirmRef = useRef<HTMLInputElement>(null);
//   const [error, setError] = useState<string>('');
//   const [loading, setLoading] = useState<boolean>(false);
//   const navigate = useNavigate();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (passwordRef.current?.value !== passwordConfirmRef.current?.value) {
//       return setError('Passwords do not match');
//     }

//     try {
//       setError('');
//       setLoading(true);
//       await createUserWithEmailAndPassword(auth, emailRef.current!.value, passwordRef.current!.value);
//       navigate('/');
//     } catch (err: any) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div>
//       <h2>Sign Up</h2>
//       {error && <p style={{ color: 'red' }}>{error}</p>}
//       <form onSubmit={handleSubmit}>
//         <div>
//           <label htmlFor="email">Email</label>
//           <input type="email" id="email" ref={emailRef} required />
//         </div>
//         <div>
//           <label htmlFor="password">Password</label>
//           <input type="password" id="password" ref={passwordRef} required />
//         </div>
//         <div>
//           <label htmlFor="password-confirm">Password Confirmation</label>
//           <input type="password" id="password-confirm" ref={passwordConfirmRef} required />
//         </div>
//         <button disabled={loading} type="submit">Sign Up</button>
//       </form>
//       <div>
//         Already have an account? <Link to="/login">Log In</Link>
//       </div>
//     </div>
//   );
// };

// export default Signup;

import React, { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase';
import { Form, Button, Card, Alert, Container } from 'react-bootstrap';
import './Signup.css';

const Signup: React.FC = () => {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const passwordConfirmRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordRef.current?.value !== passwordConfirmRef.current?.value) {
      return setError('Passwords do not match');
    }

    try {
      setError('');
      setLoading(true);
      await createUserWithEmailAndPassword(auth, emailRef.current!.value, passwordRef.current!.value);
      navigate('/');
    } catch (err: any) {
      setError('Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <div className="animated-background"></div>
      
      <Container className="d-flex align-items-center justify-content-center min-vh-100 position-relative">
        <div className="w-100" style={{ maxWidth: "450px" }}>
          
          {/* Logo and Main Header */}
          <div className="text-center mb-4 header-section">
            <div className="logo-circle mb-3">
              <i className="bi bi-person-plus-fill"></i>
            </div>
            <h1 className="main-title">Smart Issue System</h1>
            <p className="subtitle">Create Your Account & Start Managing Issues</p>
          </div>

          {/* Signup Card */}
          <Card className="signup-card shadow-lg">
            <Card.Body className="p-4">
              <div className="card-header-custom mb-4">
                <h2 className="text-center signup-title">
                  <i className="bi bi-clipboard-check me-2"></i>
                  Create Account
                </h2>
                <p className="text-center text-muted">Sign up to get started</p>
              </div>

              {error && (
                <Alert variant="danger" className="custom-alert" dismissible onClose={() => setError('')}>
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  {error}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Form.Group id="email" className="mb-3">
                  <Form.Label className="custom-label">
                    <i className="bi bi-envelope-fill me-2"></i>
                    Email Address
                  </Form.Label>
                  <Form.Control 
                    type="email" 
                    ref={emailRef} 
                    required 
                    className="custom-input"
                    placeholder="Enter your email"
                  />
                  <Form.Text className="input-hint">
                    We'll never share your email with anyone else.
                  </Form.Text>
                </Form.Group>

                <Form.Group id="password" className="mb-3">
                  <Form.Label className="custom-label">
                    <i className="bi bi-lock-fill me-2"></i>
                    Password
                  </Form.Label>
                  <Form.Control 
                    type="password" 
                    ref={passwordRef} 
                    required 
                    className="custom-input"
                    placeholder="Create a strong password"
                  />
                  <Form.Text className="input-hint">
                    Must be at least 6 characters long.
                  </Form.Text>
                </Form.Group>

                <Form.Group id="password-confirm" className="mb-4">
                  <Form.Label className="custom-label">
                    <i className="bi bi-shield-lock-fill me-2"></i>
                    Confirm Password
                  </Form.Label>
                  <Form.Control 
                    type="password" 
                    ref={passwordConfirmRef} 
                    required 
                    className="custom-input"
                    placeholder="Re-enter your password"
                  />
                </Form.Group>

                <Button 
                  disabled={loading} 
                  className="w-100 custom-btn" 
                  type="submit"
                  size="lg"
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-person-plus-fill me-2"></i>
                      Sign Up
                    </>
                  )}
                </Button>
              </Form>

              <div className="divider-container my-4">
                <div className="divider-line"></div>
                <span className="divider-text">OR</span>
                <div className="divider-line"></div>
              </div>

              <div className="text-center">
                <p className="text-muted mb-0">
                  <i className="bi bi-shield-check-fill me-1"></i>
                  By signing up, you agree to our Terms & Privacy Policy
                </p>
              </div>
            </Card.Body>
          </Card>

          {/* Login Link */}
          <div className="w-100 text-center mt-4">
            <Card className="login-card-link p-3">
              <p className="mb-0 text-light">
                Already have an account? 
                <Link to="/login" className="login-link ms-2">
                  Log In <i className="bi bi-arrow-right"></i>
                </Link>
              </p>
            </Card>
          </div>

          {/* Footer */}
          <div className="text-center mt-4">
            <p className="footer-text">
              © 2024 Smart Issue System. All rights reserved.
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Signup;