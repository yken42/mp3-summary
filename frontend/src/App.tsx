import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Upload } from './assets/components/Upload';
import { NavBar } from './assets/components/NavBar';
import { Home } from './assets/components/Home';
import { LoginForm } from './assets/components/LoginForm';
import { RegisterForm } from './assets/components/RegisterForm';
import { useAuthStore } from './assets/store/authStore';
import './App.css';
import { useEffect } from 'react';
function App() {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <Router>
      <div className="min-h-screen bg-gray-900">
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
