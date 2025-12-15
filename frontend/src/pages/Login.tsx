import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Expresión regular para validar correos permitidos
const EMAIL_RE = /^[A-Za-z0-9._%+-]+@((profesor\.)?duocuc\.cl|(profesor\.)?duoc\.cl|gmail\.com|huertohogar\.cl)$/;

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth(); // Usamos el login del contexto

  useEffect(() => {
    document.title = "Iniciar sesión - HuertoHogar";
  }, []);

  const formRef = useRef<HTMLFormElement | null>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);
  const passRef = useRef<HTMLInputElement | null>(null);

  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  
  // Estado para mensajes de error o éxito
  const [errorMsg, setErrorMsg] = useState(""); 
  const [successMsg, setSuccessMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formEl = formRef.current;
    if (!formEl) return;

    setErrorMsg("");
    setSuccessMsg("");

    const emailOK = EMAIL_RE.test(email);
    const passOK = pass.length >= 3; 

    if (!formEl.checkValidity() || !emailOK || !passOK) {
      if (!emailOK && emailRef.current) {
        emailRef.current.setCustomValidity(
          "El correo debe pertenecer a duoc.cl, duocuc.cl, profesor.duoc.cl, profesor.duocuc.cl o gmail.com"
        );
      }
      if (!passOK) {
        setErrorMsg("La contraseña es muy corta (mínimo 3 caracteres).");
      }
      formEl.reportValidity();
      return;
    }

    try {
      setIsLoading(true);
      
      // 🔥 Llamada al backend a través del Contexto
      await login(email, pass); 
      
      setSuccessMsg("Inicio de sesión exitoso. Redirigiendo...");
      
      setTimeout(() => {
        navigate("/"); // Redirigir al Home
      }, 1000);

    } catch (err) {
      console.error(err);
      // Si el backend devuelve error (401), cae aquí
      setErrorMsg("Error al iniciar sesión. Verifica tus credenciales.");
      setIsLoading(false);
    }
  };

  return (
    <div className="page-container">
      <main className="auth-main-content">
        
        <div className="auth-card">
          <h2>Iniciar sesión</h2>

          {successMsg && (
            <p className="success-message" style={{ textAlign: "center", color: "#4aa056", marginTop: 6, fontWeight: 600 }}>
              {successMsg}
            </p>
          )}

          <form id="formLogin" ref={formRef} noValidate onSubmit={handleSubmit}>
            
            {/* Campo Correo */}
            <label htmlFor="login-email">Correo*</label>
            <input
              id="login-email"
              ref={emailRef}
              type="email"
              required
              maxLength={100}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (emailRef.current) emailRef.current.setCustomValidity("");
              }}
              placeholder="nombre@duocuc.cl"
              disabled={isLoading}
            />

            {/* Campo Contraseña */}
            <label htmlFor="login-pass">Contraseña*</label>
            <input
              id="login-pass"
              ref={passRef}
              type="password"
              required
              minLength={3}
              maxLength={50}
              placeholder="Contraseña"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              disabled={isLoading}
            />

            <button type="submit" disabled={isLoading} style={{ opacity: isLoading ? 0.7 : 1 }}>
                {isLoading ? "Cargando..." : "Entrar"}
            </button>
          </form>

          {errorMsg && (
            <p className="errores" style={{ color: 'red', marginTop: '15px', textAlign: 'center' }}>
              {errorMsg}
            </p>
          )}

          <p className="link-registro">
            ¿No tienes cuenta? <Link to="/registro">Crea una aquí</Link>
          </p>
        </div>
      </main>
    </div>
  );
}