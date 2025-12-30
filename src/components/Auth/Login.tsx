// import React, { useRef, useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { signInWithEmailAndPassword } from 'firebase/auth';
// import { auth } from '../../firebase';
// import { Form, Button, Card, Alert, Container } from 'react-bootstrap';

// const Login: React.FC = () => {
//   const emailRef = useRef<HTMLInputElement>(null);
//   const passwordRef = useRef<HTMLInputElement>(null);
//   const [error, setError] = useState<string>('');
//   const [loading, setLoading] = useState<boolean>(false);
//   const navigate = useNavigate();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     try {
//       setError('');
//       setLoading(true);
//       await signInWithEmailAndPassword(auth, emailRef.current!.value, passwordRef.current!.value);
//       navigate('/');
//     } catch (err: any) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
//       <div className="w-100" style={{ maxWidth: "400px" }}>
//         <Card>
//           <Card.Body>
//             <h3 className="text-center mb-4">Smart_issue_System</h3>
//             <h2 className="text-center mb-4">Log In</h2>
//             {error && <Alert variant="danger">{error}</Alert>}
//             <Form onSubmit={handleSubmit}>
//               <Form.Group id="email" className="mb-3">
//                 <Form.Label>Email</Form.Label>
//                 <Form.Control type="email" ref={emailRef} required />
//               </Form.Group>
//               <Form.Group id="password" className="mb-3">
//                 <Form.Label>Password</Form.Label>
//                 <Form.Control type="password" ref={passwordRef} required />
//               </Form.Group>
//               <Button disabled={loading} className="w-100" type="submit">
//                 Log In
//               </Button>
//             </Form>
//           </Card.Body>
//         </Card>
//         <div className="w-100 text-center mt-3">
//           Need an account? <Link to="/signup">Sign Up</Link>
//         </div>
//       </div>
//     </Container>
//   );
// };

// export default Login;
import React, { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase';
import { Form, Button, Card, Alert, Container } from 'react-bootstrap';
import './Login.css';

const Login: React.FC = () => {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setError('');
      setLoading(true);
      await signInWithEmailAndPassword(auth, emailRef.current!.value, passwordRef.current!.value);
      navigate('/');
    } catch (err: any) {
      setError('Failed to log in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="animated-background"></div>
      
      <Container className="d-flex align-items-center justify-content-center min-vh-100 position-relative">
        <div className="w-100" style={{ maxWidth: "450px" }}>
          
          {/* Logo and Main Header */}
          <div className="text-center mb-4 header-section">
            <div className="logo-circle mb-3">
              <i className="bi bi-bug-fill"></i>
            </div>
            <h1 className="main-title">Smart Issue System</h1>
            <p className="subtitle">Track, Manage & Resolve Issues Efficiently</p>
          </div>

          {/* Login Card */}
          <Card className="login-card shadow-lg">
            <Card.Body className="p-4">
              <div className="card-header-custom mb-4">
                <h2 className="text-center login-title">
                  <i className="bi bi-box-arrow-in-right me-2"></i>
                  Welcome Back
                </h2>
                <p className="text-center text-muted">Please login to continue</p>
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
                </Form.Group>

                <Form.Group id="password" className="mb-4">
                  <Form.Label className="custom-label">
                    <i className="bi bi-lock-fill me-2"></i>
                    Password
                  </Form.Label>
                  <Form.Control 
                    type="password" 
                    ref={passwordRef} 
                    required 
                    className="custom-input"
                    placeholder="Enter your password"
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
                      Logging In...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-box-arrow-in-right me-2"></i>
                      Log In
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
                  <i className="bi bi-shield-lock-fill me-1"></i>
                  Your data is secure and encrypted
                </p>
              </div>
            </Card.Body>
          </Card>

          {/* Sign Up Link */}
          <div className="w-100 text-center mt-4">
            <Card className="signup-card p-3">
              <p className="mb-0 text-light">
                Need an account? 
                <Link to="/signup" className="signup-link ms-2">
                  Sign Up Now <i className="bi bi-arrow-right"></i>
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

export default Login;