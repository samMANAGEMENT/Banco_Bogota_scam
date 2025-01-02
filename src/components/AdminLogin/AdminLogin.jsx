import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Cambiado a useNavigate
import axios from 'axios';
import './AdminLogin.css'; // Asegúrate de crear un archivo CSS para estilos

const AdminLogin = () => {
    const [email, setEmail] = useState('admin@admin.com');
    const [password, setPassword] = useState('12345678');
    const [error, setError] = useState('');
    const navigate = useNavigate(); // Cambiado a useNavigate

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/v1/login', {
                email,
                password,
            });

            if (response.status === 200) {
                // Guardar el token en el localStorage
                localStorage.setItem('access_token', response.data.access_token);

                // Redirigir a AdminDashboard
                navigate('/AdminDashboard'); // Cambiado a navigate
            }
        } catch (err) {
            setError('Error en el inicio de sesión. Intenta de nuevo.');
        }
    };

    return (
        <div className="admin-login-container">
            <h2>Iniciar Sesión como Administrador</h2>
            <form onSubmit={handleSubmit} className="admin-login-form">
                <div className="form-group">
                    <label htmlFor="email">Correo Electrónico</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Contraseña</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                {error && <p className="error-message">{error}</p>}
                <button type="submit" className="login-button">Iniciar Sesión</button>
            </form>
        </div>
    );
};

export default AdminLogin;