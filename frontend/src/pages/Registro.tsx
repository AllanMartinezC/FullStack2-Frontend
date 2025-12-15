import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const EMAIL_RE =
  /^[A-Za-z0-9._%+-]+@((profesor\.)?duocuc\.cl|(profesor\.)?duoc\.cl|gmail\.com)$/;

export default function Registro() {
  const navigate = useNavigate();
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const formRef = useRef<HTMLFormElement | null>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);

  // Estados del formulario
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState(""); 
  const [fechaNacimiento, setFechaNacimiento] = useState(""); // ✅ NUEVO: Estado para la fecha
  const [email, setEmail] = useState("");
  const [emailConfirm, setEmailConfirm] = useState("");
  const [password, setPassword] = useState("");
  const [confirmar, setConfirmar] = useState("");

  useEffect(() => {
    document.title = "Registro — HuertoHogar";
  }, []);

  // ✅ NUEVO: Función para calcular si es mayor de 18
  const esMayorDeEdad = (fecha: string): boolean => {
    if (!fecha) return false;
    const hoy = new Date();
    const nacimiento = new Date(fecha);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    
    // Ajustar si aún no cumple años en el mes actual
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return edad >= 18;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formEl = formRef.current;
    if (!formEl) return;

    setErrorMsg("");
    setSuccessMsg("");
    if (emailRef.current) emailRef.current.setCustomValidity("");

    // Validaciones locales
    const emailOK = EMAIL_RE.test(email);
    const emailsIguales = email.trim() === emailConfirm.trim();
    const passOK = password.length >= 3; 
    const passIguales = password === confirmar;
    const edadOK = esMayorDeEdad(fechaNacimiento); // ✅ Validación de edad

    let mensaje = "";

    if (!emailOK) {
      mensaje = "El correo debe pertenecer a duoc.cl, duocuc.cl, profesor.duoc.cl o gmail.com.";
      if (emailRef.current) emailRef.current.setCustomValidity(mensaje);
    } else if (!emailsIguales) {
      mensaje = "Los correos no coinciden.";
    } else if (!passOK) {
      mensaje = "La contraseña debe tener al menos 3 caracteres.";
    } else if (!passIguales) {
      mensaje = "Las contraseñas no coinciden.";
    } else if (!edadOK) {
      mensaje = "Debes ser mayor de 18 años para registrarte."; // ✅ Mensaje de error
    }

    // Agregamos !edadOK a la condición
    if (!formEl.checkValidity() || !emailOK || !emailsIguales || !passOK || !passIguales || !edadOK) {
      setErrorMsg(mensaje || "Revisa los campos resaltados.");
      formEl.reportValidity();
      return;
    }

    try {
      setIsLoading(true);

      const response = await fetch("http://localhost:8080/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre,
          apellido,
          fechaNacimiento, // ✅ Enviamos la fecha al backend
          email,
          password
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMsg("✅ Registro exitoso. Redirigiendo al login...");
        setNombre("");
        setApellido("");
        setFechaNacimiento("");
        setEmail("");
        setEmailConfirm("");
        setPassword("");
        setConfirmar("");
        
        setTimeout(() => {
            navigate("/login");
        }, 1500);

      } else {
        setErrorMsg(data.error || "Error al registrar usuario.");
      }

    } catch (error) {
      console.error("Error de red:", error);
      setErrorMsg("No se pudo conectar con el servidor.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-container">
      <main className="auth-main-content">
        <div className="auth-card">
          <h2>Registro de usuario</h2>

          {successMsg && (
            <p className="success-message" style={{color: '#4aa056', fontWeight: 'bold'}}>{successMsg}</p>
          )}

          <form id="formRegistro" ref={formRef} noValidate onSubmit={handleSubmit}>
            
            <label htmlFor="nombre">Nombre*</label>
            <input
              id="nombre"
              type="text"
              required
              maxLength={50}
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: Ana"
              disabled={isLoading}
            />

            <label htmlFor="apellido">Apellido*</label>
            <input
              id="apellido"
              type="text"
              required
              maxLength={50}
              value={apellido}
              onChange={(e) => setApellido(e.target.value)}
              placeholder="Ej: Pérez"
              disabled={isLoading}
            />

            {/* ✅ NUEVO INPUT: Fecha de Nacimiento */}
            <label htmlFor="fechaNacimiento">Fecha de Nacimiento*</label>
            <input
              id="fechaNacimiento"
              type="date"
              required
              value={fechaNacimiento}
              onChange={(e) => setFechaNacimiento(e.target.value)}
              max={new Date().toISOString().split("T")[0]} // No permitir fechas futuras
              disabled={isLoading}
              style={{
                width: "100%",
                padding: "0.8rem",
                marginBottom: "1rem",
                border: "1px solid #ddd",
                borderRadius: "4px",
                fontSize: "1rem"
              }}
            />

            <label htmlFor="email">Correo*</label>
            <input
              id="email"
              ref={emailRef}
              type="email"
              required
              maxLength={100}
              placeholder="nombre@duocuc.cl"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (emailRef.current) emailRef.current.setCustomValidity("");
              }}
              disabled={isLoading}
            />

            <label htmlFor="emailConfirm">Confirmar correo*</label>
            <input
              id="emailConfirm"
              type="email"
              required
              maxLength={100}
              placeholder="Repite tu correo"
              value={emailConfirm}
              onChange={(e) => setEmailConfirm(e.target.value)}
              disabled={isLoading}
            />

            <label htmlFor="password">Contraseña*</label>
            <input
              id="password"
              type="password"
              required
              minLength={3}
              maxLength={20}
              placeholder="Mínimo 3 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />

            <label htmlFor="confirmar">Confirmar contraseña*</label>
            <input
              id="confirmar"
              type="password"
              required
              minLength={3}
              maxLength={20}
              placeholder="Repite la contraseña"
              value={confirmar}
              onChange={(e) => setConfirmar(e.target.value)}
              disabled={isLoading}
            />

            <button type="submit" className="btn-primary" disabled={isLoading} style={{ opacity: isLoading ? 0.7 : 1 }}>
              {isLoading ? "Registrando..." : "Registrar"}
            </button>
          </form>

          {errorMsg && <p className="errores" style={{color: 'red', marginTop: '10px'}}>{errorMsg}</p>}

          <p className="link-registro">
            ¿Ya tienes cuenta? <Link to="/login">Inicia sesión aquí</Link>
          </p>
        </div>
      </main>
    </div>
  );
}