import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { StoreProvider, useStore } from './context/StoreContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import AgentDashboard from './pages/AgentDashboard';
import CreateJob from './pages/CreateJob';
import JobDetails from './pages/JobDetails';
import ContractorDashboard from './pages/ContractorDashboard';
import ContractorHistory from './pages/ContractorHistory';
import './index.css';

// Protected Route Wrapper
const ProtectedRoute = ({ children, role }) => {
  const { user } = useStore();
  if (!user) return <Navigate to="/" />;
  if (role && user.role !== role) return <Navigate to="/" />;
  return children;
};

function AppRoutes() {
  return (
    <div className="min-h-screen bg-gray-50/50">
      <Navbar />
      <main className="max-w-6xl mx-auto px-6 pb-12">
        <Routes>
          <Route path="/" element={<Login />} />
          
          <Route path="/agent" element={
            <ProtectedRoute role="agent">
              <AgentDashboard />
            </ProtectedRoute>
          } />
          <Route path="/agent/create-job" element={
            <ProtectedRoute role="agent">
              <CreateJob />
            </ProtectedRoute>
          } />
          <Route path="/jobs/:id" element={
            <ProtectedRoute>
              <JobDetails />
            </ProtectedRoute>
          } />
          <Route path="/contractor-history/:email" element={
            <ProtectedRoute role="agent">
              <ContractorHistory />
            </ProtectedRoute>
          } />

          <Route path="/contractor" element={
            <ProtectedRoute role="contractor">
              <ContractorDashboard />
            </ProtectedRoute>
          } />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <StoreProvider>
        <AppRoutes />
      </StoreProvider>
    </Router>
  );
}

export default App;
