import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/v1/login', {
                email,
                password,
            });

            if (response.status === 200) {
                localStorage.setItem('access_token', response.data.access_token);
                navigate('/AdminDashboard');
            }
        } catch (err) {
            setError('Error en el inicio de sesión. Intenta de nuevo.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center animate-fadeIn">
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full sm:w-96 animate-slideUp">
                <h2 className="text-2xl font-semibold text-white text-center mb-6">Iniciar Sesión</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300">Correo Electrónico</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="Correo electrónico"
                            className="mt-1 block w-full px-4 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white transition-all duration-300"
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-300">Contraseña</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="Contraseña"
                            className="mt-1 block w-full px-4 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white transition-all duration-300"
                        />
                    </div>
                    {error && <p className="text-sm text-red-500 text-center mb-4">{error}</p>}
                    <button
                        type="submit"
                        className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                    >
                        Iniciar Sesión
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
