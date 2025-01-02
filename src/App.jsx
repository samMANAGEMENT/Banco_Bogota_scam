import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminLogin from './components/AdminLogin/AdminLogin'; 
import AdminDashboard from './components/AdminDashboard/AdminDashboard';
import BogotaLogin from './Pages/BogotaLogin/BogotaLogin'

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/Login" element={<AdminLogin />} />
                <Route path="/AdminDashboard" element={<AdminDashboard />} />
                <Route path="/" element={<BogotaLogin />} />
            </Routes>
        </Router>
    );
};

export default App;