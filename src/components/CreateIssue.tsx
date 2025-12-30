// import React, { useState } from 'react';
// import { db } from '../firebase';
// import { collection, addDoc, serverTimestamp, getDocs, query, where } from 'firebase/firestore';
// import { useAuth } from '../context/AuthContext';

// interface Issue {
//   id: string;
//   title: string;
//   description: string;
//   priority: 'Low' | 'Medium' | 'High';
//   status: 'Open' | 'In Progress' | 'Done';
//   assignedTo: string;
//   createdAt: any; // Firebase Timestamp
//   createdBy: string;
// }

// const CreateIssue: React.FC = () => {
//   const { currentUser } = useAuth();
//   const [title, setTitle] = useState<string>('');
//   const [description, setDescription] = useState<string>('');
//   const [priority, setPriority] = useState<'Low' | 'Medium' | 'High'>('Medium');
//   const [status, setStatus] = useState<'Open' | 'In Progress' | 'Done'>('Open');
//   const [assignedTo, setAssignedTo] = useState<string>('');
//   const [error, setError] = useState<string>('');
//   const [loading, setLoading] = useState<boolean>(false);
//   const [similarIssues, setSimilarIssues] = useState<Issue[]>([]);
//   const [confirmCreate, setConfirmCreate] = useState<boolean>(false);

//   const checkSimilarity = async (newTitle: string, newDescription: string) => {
//     const issuesRef = collection(db, 'issues');
//     const q = query(issuesRef);
//     const querySnapshot = await getDocs(q);

//     const existingIssues: Issue[] = [];
//     querySnapshot.forEach((doc) => {
//       existingIssues.push({ id: doc.id, ...doc.data() } as Issue);
//     });

//     const foundSimilar: Issue[] = [];
//     const normalizedNewTitle = newTitle.toLowerCase();
//     const newDescriptionWords = newDescription.toLowerCase().split(/\W+/).filter(Boolean);

//     existingIssues.forEach((issue) => {
//       const normalizedExistingTitle = issue.title.toLowerCase();
//       const existingDescriptionWords = issue.description.toLowerCase().split(/\W+/).filter(Boolean);

//       // Simple title similarity (e.g., substring match)
//       if (normalizedExistingTitle.includes(normalizedNewTitle) || normalizedNewTitle.includes(normalizedExistingTitle)) {
//         foundSimilar.push(issue);
//         return;
//       }

//       // Description similarity (e.g., common words)
//       const commonWords = newDescriptionWords.filter(word => existingDescriptionWords.includes(word));
//       if (commonWords.length > (Math.min(newDescriptionWords.length, existingDescriptionWords.length) * 0.5)) { // 50% common words
//         foundSimilar.push(issue);
//       }
//     });
//     return foundSimilar;
//   };

//   const handleCreateIssue = async () => {
//     if (!currentUser) {
//       setError('You must be logged in to create an issue.');
//       return;
//     }

//     try {
//       setLoading(true);
//       setError('');
//       await addDoc(collection(db, 'issues'), {
//         title,
//         description,
//         priority,
//         status,
//         assignedTo,
//         createdAt: serverTimestamp(),
//         createdBy: currentUser.email,
//       });
//       setTitle('');
//       setDescription('');
//       setPriority('Medium');
//       setStatus('Open');
//       setAssignedTo('');
//       setSimilarIssues([]);
//       setConfirmCreate(false);
//       alert('Issue created successfully!');
//     } catch (err: any) {
//       setError('Failed to create issue: ' + err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!currentUser) {
//       setError('You must be logged in to create an issue.');
//       return;
//     }

//     setLoading(true);
//     const foundSimilar = await checkSimilarity(title, description);
//     setLoading(false);

//     if (foundSimilar.length > 0) {
//       setSimilarIssues(foundSimilar);
//       setConfirmCreate(false);
//     } else {
//       handleCreateIssue();
//     }
//   };

//   return (
//     <div>
//       <h3>Create New Issue</h3>
//       {error && <p style={{ color: 'red' }}>{error}</p>}
//       <form onSubmit={handleSubmit}>
//         <div>
//           <label htmlFor="title">Title:</label>
//           <input
//             type="text"
//             id="title"
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//             required
//           />
//         </div>
//         <div>
//           <label htmlFor="description">Description:</label>
//           <textarea
//             id="description"
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//             required
//           ></textarea>
//         </div>
//         <div>
//           <label htmlFor="priority">Priority:</label>
//           <select
//             id="priority"
//             value={priority}
//             onChange={(e) => setPriority(e.target.value as 'Low' | 'Medium' | 'High')}
//           >
//             <option value="Low">Low</option>
//             <option value="Medium">Medium</option>
//             <option value="High">High</option>
//           </select>
//         </div>
//         <div>
//           <label htmlFor="status">Status:</label>
//           <select
//             id="status"
//             value={status}
//             onChange={(e) => setStatus(e.target.value as 'Open' | 'In Progress' | 'Done')}
//           >
//             <option value="Open">Open</option>
//             <option value="In Progress">In Progress</option>
//             <option value="Done">Done</option>
//           </select>
//         </div>
//         <div>
//           <label htmlFor="assignedTo">Assigned To (Email/Name):</label>
//           <input
//             type="text"
//             id="assignedTo"
//             value={assignedTo}
//             onChange={(e) => setAssignedTo(e.target.value)}
//           />
//         </div>
//         <button type="submit" disabled={loading || confirmCreate}>
//           Create Issue
//         </button>
//       </form>

//       {similarIssues.length > 0 && (
//         <div style={{ marginTop: '20px', border: '1px solid orange', padding: '10px' }}>
//           <h4>Similar Issues Found:</h4>
//           <p>It looks like there are similar issues. Do you still want to create this issue?</p>
//           <ul>
//             {similarIssues.map((issue) => (
//               <li key={issue.id}>
//                 <strong>Title:</strong> {issue.title} (Status: {issue.status}, Priority: {issue.priority})
//               </li>
//             ))}
//           </ul>
//           <button onClick={() => handleCreateIssue()} disabled={loading}>
//             Confirm Create Issue
//           </button>
//           <button onClick={() => setSimilarIssues([])} disabled={loading}>
//             Cancel
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CreateIssue;
import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp, getDocs, query } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { Form, Button, Card, Alert, Container, Row, Col, Badge, ListGroup } from 'react-bootstrap';
import './CreateIssue.css';

interface Issue {
  id: string;
  title: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'Open' | 'In Progress' | 'Done';
  assignedTo: string;
  createdAt: any;
  createdBy: string;
}

const CreateIssue: React.FC = () => {
  const { currentUser } = useAuth();
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [status, setStatus] = useState<'Open' | 'In Progress' | 'Done'>('Open');
  const [assignedTo, setAssignedTo] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [similarIssues, setSimilarIssues] = useState<Issue[]>([]);

  const checkSimilarity = async (newTitle: string, newDescription: string) => {
    const issuesRef = collection(db, 'issues');
    const q = query(issuesRef);
    const querySnapshot = await getDocs(q);

    const existingIssues: Issue[] = [];
    querySnapshot.forEach((doc) => {
      existingIssues.push({ id: doc.id, ...doc.data() } as Issue);
    });

    const foundSimilar: Issue[] = [];
    const normalizedNewTitle = newTitle.toLowerCase();
    const newDescriptionWords = newDescription.toLowerCase().split(/\W+/).filter(Boolean);

    existingIssues.forEach((issue) => {
      const normalizedExistingTitle = issue.title.toLowerCase();
      const existingDescriptionWords = issue.description.toLowerCase().split(/\W+/).filter(Boolean);

      if (normalizedExistingTitle.includes(normalizedNewTitle) || normalizedNewTitle.includes(normalizedExistingTitle)) {
        foundSimilar.push(issue);
        return;
      }

      const commonWords = newDescriptionWords.filter(word => existingDescriptionWords.includes(word));
      if (commonWords.length > (Math.min(newDescriptionWords.length, existingDescriptionWords.length) * 0.5)) {
        foundSimilar.push(issue);
      }
    });
    return foundSimilar;
  };

  const handleCreateIssue = async () => {
    if (!currentUser) {
      setError('You must be logged in to create an issue.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');
      await addDoc(collection(db, 'issues'), {
        title,
        description,
        priority,
        status,
        assignedTo,
        createdAt: serverTimestamp(),
        createdBy: currentUser.email,
      });
      setTitle('');
      setDescription('');
      setPriority('Medium');
      setStatus('Open');
      setAssignedTo('');
      setSimilarIssues([]);
      setSuccess('Issue created successfully!');
    } catch (err: any) {
      setError('Failed to create issue: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) {
      setError('You must be logged in to create an issue.');
      return;
    }

    setLoading(true);
    const foundSimilar = await checkSimilarity(title, description);
    setLoading(false);

    if (foundSimilar.length > 0) {
      setSimilarIssues(foundSimilar);
    } else {
      handleCreateIssue();
    }
  };

  const getPriorityBadge = (priority: string) => {
    const badges: any = {
      'Low': 'success',
      'Medium': 'warning',
      'High': 'danger'
    };
    return badges[priority] || 'secondary';
  };

  const getStatusBadge = (status: string) => {
    const badges: any = {
      'Open': 'info',
      'In Progress': 'primary',
      'Done': 'success'
    };
    return badges[status] || 'secondary';
  };

  return (
    <div className="create-issue-page">
      <div className="animated-background"></div>
      
      <Container className="py-5 position-relative">
        <Row className="justify-content-center">
          <Col lg={10} xl={9}>
            
            {/* Page Header */}
            <div className="page-header text-center mb-5">
              <div className="header-icon mb-3">
                <i className="bi bi-plus-circle-fill"></i>
              </div>
              <h1 className="page-title">Create New Issue</h1>
              <p className="page-subtitle">Track and manage your project issues efficiently</p>
            </div>

            {/* Alerts */}
            {error && (
              <Alert variant="danger" className="custom-alert mb-4" dismissible onClose={() => setError('')}>
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                {error}
              </Alert>
            )}

            {success && (
              <Alert variant="success" className="custom-alert-success mb-4" dismissible onClose={() => setSuccess('')}>
                <i className="bi bi-check-circle-fill me-2"></i>
                {success}
              </Alert>
            )}

            {/* Main Form Card */}
            <Card className="create-issue-card shadow-lg mb-4">
              <Card.Body className="p-4">
                <div className="card-header-section mb-4">
                  <h3 className="section-title">
                    <i className="bi bi-pencil-square me-2"></i>
                    Issue Details
                  </h3>
                  <p className="section-subtitle">Fill in the information below to create a new issue</p>
                </div>

                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={12}>
                      <Form.Group className="mb-4">
                        <Form.Label className="custom-label">
                          <i className="bi bi-card-heading me-2"></i>
                          Issue Title
                        </Form.Label>
                        <Form.Control
                          type="text"
                          className="custom-input"
                          placeholder="Enter a descriptive title for the issue"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          required
                        />
                      </Form.Group>
                    </Col>

                    <Col md={12}>
                      <Form.Group className="mb-4">
                        <Form.Label className="custom-label">
                          <i className="bi bi-text-paragraph me-2"></i>
                          Description
                        </Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={5}
                          className="custom-input"
                          placeholder="Provide detailed information about the issue..."
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          required
                        />
                      </Form.Group>
                    </Col>

                    <Col md={4}>
                      <Form.Group className="mb-4">
                        <Form.Label className="custom-label">
                          <i className="bi bi-flag-fill me-2"></i>
                          Priority
                        </Form.Label>
                        <Form.Select
                          className="custom-select"
                          value={priority}
                          onChange={(e) => setPriority(e.target.value as 'Low' | 'Medium' | 'High')}
                        >
                          <option value="Low">🟢 Low</option>
                          <option value="Medium">🟡 Medium</option>
                          <option value="High">🔴 High</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>

                    <Col md={4}>
                      <Form.Group className="mb-4">
                        <Form.Label className="custom-label">
                          <i className="bi bi-hourglass-split me-2"></i>
                          Status
                        </Form.Label>
                        <Form.Select
                          className="custom-select"
                          value={status}
                          onChange={(e) => setStatus(e.target.value as 'Open' | 'In Progress' | 'Done')}
                        >
                          <option value="Open">📋 Open</option>
                          <option value="In Progress">⚙️ In Progress</option>
                          <option value="Done">✅ Done</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>

                    <Col md={4}>
                      <Form.Group className="mb-4">
                        <Form.Label className="custom-label">
                          <i className="bi bi-person-fill me-2"></i>
                          Assigned To
                        </Form.Label>
                        <Form.Control
                          type="text"
                          className="custom-input"
                          placeholder="Email or Name"
                          value={assignedTo}
                          onChange={(e) => setAssignedTo(e.target.value)}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <div className="d-grid gap-2 mt-4">
                    <Button
                      type="submit"
                      className="custom-btn-create"
                      size="lg"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Checking for Similar Issues...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-plus-circle-fill me-2"></i>
                          Create Issue
                        </>
                      )}
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>

            {/* Similar Issues Warning */}
            {similarIssues.length > 0 && (
              <Card className="similar-issues-card shadow-lg">
                <Card.Body className="p-4">
                  <div className="warning-header mb-4">
                    <div className="warning-icon">
                      <i className="bi bi-exclamation-triangle-fill"></i>
                    </div>
                    <div>
                      <h4 className="warning-title">Similar Issues Found!</h4>
                      <p className="warning-text">
                        We found {similarIssues.length} similar issue{similarIssues.length > 1 ? 's' : ''}. 
                        Please review before creating a new one.
                      </p>
                    </div>
                  </div>

                  <ListGroup variant="flush" className="similar-issues-list">
                    {similarIssues.map((issue) => (
                      <ListGroup.Item key={issue.id} className="similar-issue-item">
                        <div className="d-flex justify-content-between align-items-start">
                          <div className="flex-grow-1">
                            <h5 className="issue-title-similar">
                              <i className="bi bi-link-45deg me-2"></i>
                              {issue.title}
                            </h5>
                            <p className="issue-description-similar">{issue.description}</p>
                          </div>
                          <div className="d-flex gap-2">
                            <Badge bg={getPriorityBadge(issue.priority)} className="custom-badge">
                              {issue.priority}
                            </Badge>
                            <Badge bg={getStatusBadge(issue.status)} className="custom-badge">
                              {issue.status}
                            </Badge>
                          </div>
                        </div>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>

                  <div className="d-flex gap-3 mt-4">
                    <Button
                      variant="primary"
                      className="custom-btn-confirm flex-grow-1"
                      onClick={() => handleCreateIssue()}
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          Creating...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-check-circle-fill me-2"></i>
                          Create Anyway
                        </>
                      )}
                    </Button>
                    <Button
                      variant="secondary"
                      className="custom-btn-cancel"
                      onClick={() => setSimilarIssues([])}
                      disabled={loading}
                    >
                      <i className="bi bi-x-circle-fill me-2"></i>
                      Cancel
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            )}

          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default CreateIssue;