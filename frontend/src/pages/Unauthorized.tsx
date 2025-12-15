import { Link } from "react-router-dom";

export const Unauthorized = () => (
  <div style={{textAlign: 'center', marginTop: '50px'}}>
    <h1 style={{color: 'red'}}>403 - Acceso Denegado</h1>
    <p>No tienes permisos para ver esta página.</p>
    <Link to="/">Volver al inicio</Link>
  </div>
);