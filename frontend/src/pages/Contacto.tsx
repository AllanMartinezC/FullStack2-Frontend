import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';



const EMAIL_DOMAIN_RE = /^[A-Za-z0-9._%+-]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/;

export const Contacto = () => {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [comentario, setComentario] = useState('');
  const [chars, setChars] = useState(0);
  const formRef = useRef<HTMLFormElement | null>(null);
  const correoRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    document.title = 'HuertoHogar — Contacto';

    
    if (typeof window !== 'undefined' && typeof (window as any).renderAuthArea === 'function') {
      (window as any).renderAuthArea();
    }
    if (typeof window !== 'undefined' && typeof (window as any).updateCartBadge === 'function') {
      (window as any).updateCartBadge();
    }
  }, []);

  useEffect(() => {
    setChars(comentario.length);
  }, [comentario]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const formEl = formRef.current;
    const emailEl = correoRef.current;
    if (!formEl) return;

    // Utilizamos una notificación en lugar de 'alert()'
    const showNotification = (message: string) => {
      const notification = document.createElement('div');
      notification.textContent = message;
      notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: #4aa056;
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        z-index: 1000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      `;
      document.body.appendChild(notification);
      setTimeout(() => notification.remove(), 3000);
    };

    if (emailEl) emailEl.setCustomValidity('');

    const emailOK = EMAIL_DOMAIN_RE.test(correo);

    if (!formEl.checkValidity() || !emailOK) {
      e.preventDefault();
      if (emailEl && !emailOK) {
        emailEl.setCustomValidity(
          'El correo debe pertenecer a duoc.cl, profesor.duoc.cl o gmail.com'
        );
      }
      formEl.reportValidity();
      return;
    }

    e.preventDefault();
    showNotification('Mensaje enviado ✅');
    setNombre('');
    setCorreo('');
    setComentario('');
  };

  return (
    <div>
      {}
      
      <main>
        
        {/* Formulario principal */}
        <section 
          className="formulario-contacto-wrapper" 
          style={{ 
            maxWidth: 900, 
            margin: '40px auto', 
            padding: '0 20px' 
          }}
        >
          <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#4aa056' }}>
            FORMULARIO DE CONTACTO
          </h2>
          
          <form id="contact-form" ref={formRef} noValidate onSubmit={handleSubmit} className="contacto-form">
            
            {/* Nombre */}
            <div className="form-group">
              <label htmlFor="nombre">
                Nombre completo <span className="req">*</span>
              </label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                required
                maxLength={100}
                placeholder="Ej: Ana Pérez"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
              <small>Requerido — Máx. 100 caracteres.</small>
            </div>

            {/* Correo */}
            <div className="form-group">
              <label htmlFor="correo">
                Correo <span className="req">*</span>
              </label>
              <input
                ref={correoRef}
                type="email"
                id="correo"
                name="correo"
                required
                maxLength={100}
                pattern="^[A-Za-z0-9._%+-]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$"
                placeholder="usuario@duoc.cl / @profesor.duoc.cl / @gmail.com"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
              />
              <small>
                Acepta únicamente @duoc.cl, @profesor.duoc.cl o @gmail.com — Máx. 100 caracteres.
              </small>
            </div>

            {/* Comentario */}
            <div className="form-group">
              <label htmlFor="comentario">
                Comentario <span className="req">*</span>
              </label>
              <textarea
                id="comentario"
                name="comentario"
                required
                maxLength={500}
                placeholder="Escribe tu mensaje…"
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
              />
              <div className="hint-row">
                <small>Requerido — Máx. 500 caracteres.</small>
                <small id="contador-comentario">{chars} / 500</small>
              </div>
            </div>

            {/* Botón */}
            <button type="submit" className="btn-contacto">ENVIAR MENSAJE</button>
          </form>
        </section>

        {}
      </main>

    </div>
  );
};

export default Contacto;
