// import React from 'react';
// import { useAuth } from '../context/AuthContext';
// import { useNavigate } from 'react-router-dom';
// import { auth } from '../firebase';
// import { signOut } from 'firebase/auth';
// import CreateIssue from './CreateIssue'; // Import the CreateIssue component
// import IssueList from './IssueList'; // Import the IssueList component

// const Dashboard: React.FC = () => {
//   const { currentUser } = useAuth();
//   const navigate = useNavigate();

//   const handleLogout = async () => {
//     try {
//       await signOut(auth);
//       navigate('/login');
//     } catch (error) {
//       console.error("Failed to log out", error);
//       // Optionally, display an error message to the user
//     }
//   };

//   return (
//     <div>
//       <h2>Dashboard</h2>
//       {currentUser && <p>Welcome, {currentUser.email}!</p>}
//       <button onClick={handleLogout}>Log Out</button>
//       <CreateIssue /> {/* Render the CreateIssue component */}
//       <IssueList /> {/* Render the IssueList component */}
//     </div>
//   );
// };

// export default Dashboard;
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { Container, Row, Col, Card, Button, Nav, Navbar, Dropdown } from 'react-bootstrap';
import CreateIssue from './CreateIssue';
import IssueList from './IssueList';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'list' | 'create'>('list');

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  return (
    <div className="dashboard-page">
      <div className="animated-background"></div>

      {/* Top Navigation Bar */}
      <Navbar className="dashboard-navbar" expand="lg">
        <Container fluid>
          <Navbar.Brand className="navbar-brand-custom">
            <div className="brand-logo">
              <i className="bi bi-bug-fill"></i>
            </div>
            <span className="brand-text">Smart Issue System</span>
          </Navbar.Brand>
          
          <Navbar.Toggle aria-controls="navbar-nav" className="custom-toggler" />
          
          <Navbar.Collapse id="navbar-nav" className="justify-content-end">
            <Nav className="align-items-center">
              <div className="user-info-section d-flex align-items-center">
                <div className="user-avatar">
                  <i className="bi bi-person-circle"></i>
                </div>
                <div className="user-details d-none d-md-block">
                  <p className="user-email mb-0">{currentUser?.email}</p>
                  <p className="user-status mb-0">Active</p>
                </div>
                <Dropdown align="end">
                  <Dropdown.Toggle variant="link" className="user-dropdown-toggle">
                    <i className="bi bi-chevron-down"></i>
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="custom-dropdown-menu">
                    <Dropdown.Item className="custom-dropdown-item">
                      <i className="bi bi-person-fill me-2"></i>
                      Profile
                    </Dropdown.Item>
                    <Dropdown.Item className="custom-dropdown-item">
                      <i className="bi bi-gear-fill me-2"></i>
                      Settings
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item className="custom-dropdown-item logout-item" onClick={handleLogout}>
                      <i className="bi bi-box-arrow-right me-2"></i>
                      Log Out
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Main Content */}
      <Container fluid className="dashboard-content">
        <Row>
          {/* Sidebar */}
          <Col lg={2} md={3} className="sidebar-col">
            <div className="sidebar">
              <div className="sidebar-header">
                <h4 className="sidebar-title">
                  <i className="bi bi-grid-fill me-2"></i>
                  Menu
                </h4>
              </div>
              
              <Nav className="flex-column sidebar-nav">
                <Nav.Link 
                  className={`sidebar-link ${activeTab === 'list' ? 'active' : ''}`}
                  onClick={() => setActiveTab('list')}
                >
                  <i className="bi bi-list-ul me-2"></i>
                  View Issues
                  <i className="bi bi-chevron-right ms-auto"></i>
                </Nav.Link>
                
                <Nav.Link 
                  className={`sidebar-link ${activeTab === 'create' ? 'active' : ''}`}
                  onClick={() => setActiveTab('create')}
                >
                  <i className="bi bi-plus-circle-fill me-2"></i>
                  Create Issue
                  <i className="bi bi-chevron-right ms-auto"></i>
                </Nav.Link>

                <div className="sidebar-divider"></div>

                <div className="sidebar-section-title">Quick Stats</div>
                
                <div className="stats-card">
                  <div className="stat-item">
                    <i className="bi bi-exclamation-circle-fill text-danger"></i>
                    <div>
                      <p className="stat-label">High Priority</p>
                      <p className="stat-value">5</p>
                    </div>
                  </div>
                  <div className="stat-item">
                    <i className="bi bi-clock-fill text-warning"></i>
                    <div>
                      <p className="stat-label">In Progress</p>
                      <p className="stat-value">12</p>
                    </div>
                  </div>
                  <div className="stat-item">
                    <i className="bi bi-check-circle-fill text-success"></i>
                    <div>
                      <p className="stat-label">Completed</p>
                      <p className="stat-value">28</p>
                    </div>
                  </div>
                </div>
              </Nav>
            </div>
          </Col>

          {/* Main Content Area */}
          <Col lg={10} md={9} className="main-content-col">
            <div className="main-content">
              {/* Welcome Header */}
              <div className="welcome-section mb-4">
                <div className="welcome-card">
                  <Row className="align-items-center">
                    <Col md={8}>
                      <div className="welcome-content">
                        <h2 className="welcome-title">
                          Welcome back, <span className="highlight">{currentUser?.email?.split('@')[0]}</span>! 👋
                        </h2>
                        <p className="welcome-subtitle">
                          Manage your issues efficiently and keep your projects on track
                        </p>
                      </div>
                    </Col>
                    <Col md={4} className="text-end">
                      <div className="welcome-icon">
                        <i className="bi bi-speedometer2"></i>
                      </div>
                    </Col>
                  </Row>
                </div>
              </div>

              {/* Tab Navigation */}
              <div className="tab-navigation mb-4">
                <Button
                  className={`tab-btn ${activeTab === 'list' ? 'active' : ''}`}
                  onClick={() => setActiveTab('list')}
                >
                  <i className="bi bi-list-ul me-2"></i>
                  All Issues
                </Button>
                <Button
                  className={`tab-btn ${activeTab === 'create' ? 'active' : ''}`}
                  onClick={() => setActiveTab('create')}
                >
                  <i className="bi bi-plus-circle-fill me-2"></i>
                  Create New
                </Button>
              </div>

              {/* Content Area */}
              <div className="content-area">
                {activeTab === 'list' && (
                  <div className="tab-content-wrapper">
                    <IssueList />
                  </div>
                )}
                
                {activeTab === 'create' && (
                  <div className="tab-content-wrapper">
                    <CreateIssue />
                  </div>
                )}
              </div>
            </div>
          </Col>
        </Row>
      </Container>

      {/* Footer */}
      <footer className="dashboard-footer">
        <Container>
          <Row>
            <Col className="text-center">
              <p className="footer-text mb-0">
                © 2024 Smart Issue System. Made with <i className="bi bi-heart-fill text-danger"></i> for efficient project management
              </p>
            </Col>
          </Row>
        </Container>
      </footer>
    </div>
  );
};

export default Dashboard;