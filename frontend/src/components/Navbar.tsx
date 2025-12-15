import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useState } from "react"; 

export const Navbar = () => {
  const { totalItems } = useCart();
  // 🔄 CAMBIO: Ahora usamos isAuthenticated y username del nuevo contexto
  const { isAuthenticated, username, logout } = useAuth();
  const navigate = useNavigate();
  
  const [isMenuOpen, setIsMenuOpen] = useState(false); 

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logout();
    navigate("/login"); // Redirigir al login al salir
  };

  return (
    <header
      className="navbar-container" 
      style={{
        backgroundColor: "#2f9d55", 
        padding: "0.6rem 1.5rem",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "white",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        position: "relative",
        zIndex: 1000,
      }}
    >
      <div className="navbar-content" style={{ display: "flex", width: "100%", maxWidth: "1200px", alignItems: "center", justifyContent: "space-between" }}>
        
        {/* Logo */}
        <div className="navbar-logo">
          <Link
            to="/"
            className="brand"
            style={{ color: "white", textDecoration: "none", fontWeight: "bold", fontSize: "1.4rem" }}
          >
            🍎 HuertoHogar
          </Link>
        </div>

        <div className="navbar-toggle" onClick={toggleMenu}>
          <span></span>
          <span></span>
          <span></span>
        </div>

        <nav
          className={`navbar-links ${isMenuOpen ? 'active' : ''}`} 
        >
          <Link to="/" onClick={toggleMenu}>HOME</Link>
          <Link to="/productos" onClick={toggleMenu}>PRODUCTOS</Link>
          <Link to="/categorias" onClick={toggleMenu}>CATEGORIAS</Link>
          <Link to="/nosotros" onClick={toggleMenu}>NOSOTROS</Link>
          <Link to="/blogs" onClick={toggleMenu}>BLOGS</Link>
          <Link to="/contacto" onClick={toggleMenu}>CONTACTO</Link>
        </nav>

        <div className="navbar-actions">
          {/* Carrito */}
          <Link
            to="/carrito"
            className="cart-link"
          >
            🛒 Carrito ({totalItems})
          </Link>

          {/* 🔄 LÓGICA ACTUALIZADA: Si está autenticado... */}
          {isAuthenticated ? (
            <div className="user-info" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span className="user-name" style={{ fontWeight: 'bold' }}>
                {/* Mostramos la parte del correo antes del @ */}
                Hola, {username?.split("@")[0]}
              </span>
              <button
                onClick={handleLogout}
                className="logout-btn"
                style={{ 
                    background: 'rgba(255,255,255,0.2)', 
                    border: 'none', 
                    color: 'white', 
                    padding: '5px 10px', 
                    borderRadius: '4px', 
                    cursor: 'pointer',
                    fontSize: '0.9rem'
                }}
              >
                Salir
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="auth-link">
                Iniciar sesión
              </Link>
              <Link to="/registro" className="auth-link">
                Registrarse
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};