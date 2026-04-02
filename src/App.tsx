import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { AdminProvider } from './context/AdminContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Candidates from './pages/Candidates';
import CandidateDetail from './pages/CandidateDetail';
import Wishlist from './pages/Wishlist';
import Timeline from './pages/Timeline';
import Polls from './pages/Polls';
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminWishlist from './pages/admin/AdminWishlist';
import AdminCandidates from './pages/admin/AdminCandidates';
import AdminTimeline from './pages/admin/AdminTimeline';
import AdminPolls from './pages/admin/AdminPolls';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function PublicLayout() {
  return (
    <div className="min-h-screen bg-slate-950 text-white" style={{ fontFamily: 'Inter, sans-serif' }}>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/candidates" element={<Candidates />} />
          <Route path="/candidates/:id" element={<CandidateDetail />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/timeline" element={<Timeline />} />
          <Route path="/polls" element={<Polls />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <AdminProvider>
      <Router>
        <ScrollToTop />
        <div style={{ fontFamily: 'Inter, sans-serif' }}>
          <Routes>
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="wishlist" element={<AdminWishlist />} />
              <Route path="candidates" element={<AdminCandidates />} />
              <Route path="timeline" element={<AdminTimeline />} />
              <Route path="polls" element={<AdminPolls />} />
            </Route>

            {/* Public Routes */}
            <Route path="/*" element={<PublicLayout />} />
          </Routes>
        </div>
      </Router>
    </AdminProvider>
  );
}

export default App;
