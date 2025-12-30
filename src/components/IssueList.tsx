// import React, { useEffect, useState } from 'react';
// import { db } from '../firebase';
// import { collection, query, orderBy, onSnapshot, DocumentData, doc, updateDoc } from 'firebase/firestore';

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

// const IssueList: React.FC = () => {
//   const [issues, setIssues] = useState<Issue[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string>('');
//   const [filterStatus, setFilterStatus] = useState<string>('All');
//   const [filterPriority, setFilterPriority] = useState<string>('All');

//   useEffect(() => {
//     setLoading(true);
//     const issuesCollectionRef = collection(db, 'issues');
//     const q = query(issuesCollectionRef, orderBy('createdAt', 'desc'));

//     const unsubscribe = onSnapshot(q, (snapshot) => {
//       const issuesData: Issue[] = [];
//       snapshot.forEach((doc) => {
//         issuesData.push({ id: doc.id, ...doc.data() } as Issue);
//       });
//       setIssues(issuesData);
//       setLoading(false);
//     }, (err) => {
//       setError('Failed to fetch issues: ' + err.message);
//       setLoading(false);
//     });

//     return () => unsubscribe();
//   }, []);

//   const handleStatusChange = async (issueId: string, currentStatus: Issue['status'], newStatus: Issue['status']) => {
//     if (currentStatus === 'Open' && newStatus === 'Done') {
//       alert('An issue cannot move directly from Open to Done. Please set it to "In Progress" first.');
//       return;
//     }

//     try {
//       const issueRef = doc(db, 'issues', issueId);
//       await updateDoc(issueRef, {
//         status: newStatus,
//       });
//     } catch (err: any) {
//       console.error("Error updating status: ", err);
//       alert('Failed to update issue status: ' + err.message);
//     }
//   };

//   const filteredIssues = issues.filter((issue) => {
//     const statusMatch = filterStatus === 'All' || issue.status === filterStatus;
//     const priorityMatch = filterPriority === 'All' || issue.priority === filterPriority;
//     return statusMatch && priorityMatch;
//   });

//   if (loading) {
//     return <div>Loading Issues...</div>;
//   }

//   if (error) {
//     return <div style={{ color: 'red' }}>Error: {error}</div>;
//   }

//   return (
//     <div>
//       <h3>Issue List</h3>

//       <div>
//         <label htmlFor="status-filter">Filter by Status:</label>
//         <select id="status-filter" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
//           <option value="All">All</option>
//           <option value="Open">Open</option>
//           <option value="In Progress">In Progress</option>
//           <option value="Done">Done</option>
//         </select>

//         <label htmlFor="priority-filter" style={{ marginLeft: '10px' }}>Filter by Priority:</label>
//         <select id="priority-filter" value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}>
//           <option value="All">All</option>
//           <option value="Low">Low</option>
//           <option value="Medium">Medium</option>
//           <option value="High">High</option>
//         </select>
//       </div>

//       {filteredIssues.length === 0 ? (
//         <p>No issues found.</p>
//       ) : (
//         <ul>
//           {filteredIssues.map((issue) => (
//             <li key={issue.id} style={{ border: '1px solid #ccc', margin: '10px 0', padding: '10px' }}>
//               <h4>{issue.title}</h4>
//               <p>Description: {issue.description}</p>
//               <p>Priority: {issue.priority}</p>
//               <p>
//                 Status:
//                 <select
//                   value={issue.status}
//                   onChange={(e) => handleStatusChange(issue.id, issue.status, e.target.value as Issue['status'])}
//                   style={{ marginLeft: '5px' }}
//                 >
//                   <option value="Open">Open</option>
//                   <option value="In Progress">In Progress</option>
//                   <option value="Done">Done</option>
//                 </select>
//               </p>
//               <p>Assigned To: {issue.assignedTo}</p>
//               <p>Created By: {issue.createdBy}</p>
//               <p>Created At: {new Date(issue.createdAt?.toDate()).toLocaleString()}</p>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };

// export default IssueList;
import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { Card, Badge, Form, Row, Col, Spinner, Alert, Button, Modal } from 'react-bootstrap';
import './IssueList.css';

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

const IssueList: React.FC = () => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [filterPriority, setFilterPriority] = useState<string>('All');
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    const issuesCollectionRef = collection(db, 'issues');
    const q = query(issuesCollectionRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const issuesData: Issue[] = [];
      snapshot.forEach((doc) => {
        issuesData.push({ id: doc.id, ...doc.data() } as Issue);
      });
      setIssues(issuesData);
      setLoading(false);
    }, (err) => {
      setError('Failed to fetch issues: ' + err.message);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleStatusChange = async (issueId: string, currentStatus: Issue['status'], newStatus: Issue['status']) => {
    if (currentStatus === 'Open' && newStatus === 'Done') {
      alert('An issue cannot move directly from Open to Done. Please set it to "In Progress" first.');
      return;
    }

    try {
      const issueRef = doc(db, 'issues', issueId);
      await updateDoc(issueRef, {
        status: newStatus,
      });
    } catch (err: any) {
      console.error("Error updating status: ", err);
      alert('Failed to update issue status: ' + err.message);
    }
  };

  const filteredIssues = issues.filter((issue) => {
    const statusMatch = filterStatus === 'All' || issue.status === filterStatus;
    const priorityMatch = filterPriority === 'All' || issue.priority === filterPriority;
    return statusMatch && priorityMatch;
  });

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

  const getPriorityIcon = (priority: string) => {
    const icons: any = {
      'Low': '🟢',
      'Medium': '🟡',
      'High': '🔴'
    };
    return icons[priority] || '⚪';
  };

  const getStatusIcon = (status: string) => {
    const icons: any = {
      'Open': '📋',
      'In Progress': '⚙️',
      'Done': '✅'
    };
    return icons[status] || '📄';
  };

  const handleViewDetails = (issue: Issue) => {
    setSelectedIssue(issue);
    setShowModal(true);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-card">
          <Spinner animation="border" variant="primary" className="loading-spinner" />
          <h4 className="loading-text">Loading Issues...</h4>
          <p className="loading-subtext">Please wait while we fetch your data</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="custom-alert-error">
        <i className="bi bi-exclamation-triangle-fill me-2"></i>
        <strong>Error:</strong> {error}
      </Alert>
    );
  }

  return (
    <div className="issue-list-container">
      {/* Header Section */}
      <div className="list-header mb-4">
        <div className="header-content">
          <div className="header-icon-wrapper">
            <i className="bi bi-list-check"></i>
          </div>
          <div>
            <h3 className="list-title">Issue Tracker</h3>
            <p className="list-subtitle">
              Showing {filteredIssues.length} of {issues.length} issues
            </p>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <Card className="filter-card mb-4">
        <Card.Body className="p-4">
          <div className="filter-header mb-3">
            <h5 className="filter-title">
              <i className="bi bi-funnel-fill me-2"></i>
              Filters
            </h5>
          </div>
          <Row>
            <Col md={6} className="mb-3 mb-md-0">
              <Form.Group>
                <Form.Label className="filter-label">
                  <i className="bi bi-hourglass-split me-2"></i>
                  Status
                </Form.Label>
                <Form.Select 
                  className="custom-filter-select"
                  value={filterStatus} 
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="All">All Statuses</option>
                  <option value="Open">📋 Open</option>
                  <option value="In Progress">⚙️ In Progress</option>
                  <option value="Done">✅ Done</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label className="filter-label">
                  <i className="bi bi-flag-fill me-2"></i>
                  Priority
                </Form.Label>
                <Form.Select 
                  className="custom-filter-select"
                  value={filterPriority} 
                  onChange={(e) => setFilterPriority(e.target.value)}
                >
                  <option value="All">All Priorities</option>
                  <option value="Low">🟢 Low</option>
                  <option value="Medium">🟡 Medium</option>
                  <option value="High">🔴 High</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Issues List */}
      {filteredIssues.length === 0 ? (
        <Card className="empty-state-card">
          <Card.Body className="text-center p-5">
            <div className="empty-icon mb-3">
              <i className="bi bi-inbox"></i>
            </div>
            <h4 className="empty-title">No Issues Found</h4>
            <p className="empty-text">
              {filterStatus !== 'All' || filterPriority !== 'All' 
                ? 'Try adjusting your filters to see more issues.'
                : 'Create your first issue to get started!'}
            </p>
          </Card.Body>
        </Card>
      ) : (
        <div className="issues-grid">
          {filteredIssues.map((issue) => (
            <Card key={issue.id} className="issue-card">
              <Card.Body className="p-4">
                {/* Issue Header */}
                <div className="issue-header mb-3">
                  <div className="d-flex justify-content-between align-items-start">
                    <h5 className="issue-title">
                      <i className="bi bi-bookmark-fill me-2"></i>
                      {issue.title}
                    </h5>
                    <div className="d-flex gap-2">
                      <Badge bg={getPriorityBadge(issue.priority)} className="custom-badge">
                        {getPriorityIcon(issue.priority)} {issue.priority}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Issue Description */}
                <p className="issue-description">{issue.description}</p>

                {/* Issue Details */}
                <div className="issue-details mb-3">
                  <div className="detail-item">
                    <i className="bi bi-person-circle me-2"></i>
                    <span className="detail-label">Assigned:</span>
                    <span className="detail-value">{issue.assignedTo || 'Unassigned'}</span>
                  </div>
                  <div className="detail-item">
                    <i className="bi bi-person-fill me-2"></i>
                    <span className="detail-label">Created by:</span>
                    <span className="detail-value">{issue.createdBy}</span>
                  </div>
                  <div className="detail-item">
                    <i className="bi bi-calendar-event me-2"></i>
                    <span className="detail-label">Created:</span>
                    <span className="detail-value">
                      {issue.createdAt ? new Date(issue.createdAt.toDate()).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                </div>

                {/* Status Selector */}
                <div className="status-section">
                  <Form.Group>
                    <Form.Label className="status-label">
                      <i className="bi bi-toggle-on me-2"></i>
                      Update Status
                    </Form.Label>
                    <div className="d-flex gap-2 align-items-center">
                      <Form.Select
                        className="custom-status-select"
                        value={issue.status}
                        onChange={(e) => handleStatusChange(issue.id, issue.status, e.target.value as Issue['status'])}
                      >
                        <option value="Open">📋 Open</option>
                        <option value="In Progress">⚙️ In Progress</option>
                        <option value="Done">✅ Done</option>
                      </Form.Select>
                      <Badge bg={getStatusBadge(issue.status)} className="status-badge-display">
                        {getStatusIcon(issue.status)}
                      </Badge>
                    </div>
                  </Form.Group>
                </div>

                {/* Action Button */}
                <div className="mt-3">
                  <Button 
                    className="view-details-btn w-100"
                    onClick={() => handleViewDetails(issue)}
                  >
                    <i className="bi bi-eye-fill me-2"></i>
                    View Full Details
                  </Button>
                </div>
              </Card.Body>
            </Card>
          ))}
        </div>
      )}

      {/* Issue Details Modal */}
      <Modal 
        show={showModal} 
        onHide={() => setShowModal(false)}
        size="lg"
        centered
        className="issue-modal"
      >
        <Modal.Header closeButton className="modal-header-custom">
          <Modal.Title className="modal-title-custom">
            <i className="bi bi-file-text-fill me-2"></i>
            Issue Details
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-body-custom">
          {selectedIssue && (
            <div>
              <div className="modal-section mb-4">
                <h5 className="modal-section-title">
                  <i className="bi bi-bookmark-fill me-2"></i>
                  {selectedIssue.title}
                </h5>
                <div className="d-flex gap-2 mt-2">
                  <Badge bg={getPriorityBadge(selectedIssue.priority)} className="custom-badge">
                    {getPriorityIcon(selectedIssue.priority)} {selectedIssue.priority}
                  </Badge>
                  <Badge bg={getStatusBadge(selectedIssue.status)} className="custom-badge">
                    {getStatusIcon(selectedIssue.status)} {selectedIssue.status}
                  </Badge>
                </div>
              </div>

              <div className="modal-section mb-4">
                <h6 className="modal-label">
                  <i className="bi bi-text-paragraph me-2"></i>
                  Description
                </h6>
                <p className="modal-text">{selectedIssue.description}</p>
              </div>

              <div className="modal-section mb-4">
                <h6 className="modal-label">
                  <i className="bi bi-info-circle-fill me-2"></i>
                  Additional Information
                </h6>
                <div className="modal-info-grid">
                  <div className="modal-info-item">
                    <span className="info-label">Assigned To:</span>
                    <span className="info-value">{selectedIssue.assignedTo || 'Unassigned'}</span>
                  </div>
                  <div className="modal-info-item">
                    <span className="info-label">Created By:</span>
                    <span className="info-value">{selectedIssue.createdBy}</span>
                  </div>
                  <div className="modal-info-item">
                    <span className="info-label">Created At:</span>
                    <span className="info-value">
                      {selectedIssue.createdAt ? new Date(selectedIssue.createdAt.toDate()).toLocaleString() : 'N/A'}
                    </span>
                  </div>
                  <div className="modal-info-item">
                    <span className="info-label">Issue ID:</span>
                    <span className="info-value">{selectedIssue.id}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer className="modal-footer-custom">
          <Button 
            variant="secondary" 
            onClick={() => setShowModal(false)}
            className="modal-close-btn"
          >
            <i className="bi bi-x-circle me-2"></i>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default IssueList;