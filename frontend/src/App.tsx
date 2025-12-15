import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Páginas
import { Home } from "./pages/Home";
import { Products } from "./pages/Products";
import { Blogs } from "./pages/Blogs";
import { Categorias } from "./pages/Categorias";
import { Nosotros } from "./pages/Nosotros";
import { Contacto } from "./pages/Contacto";
import { Carrito } from "./pages/Carrito";
import Login from "./pages/Login";
import Registro from "./pages/Registro";
import { ProductDetail } from "./pages/ProductDetails";
import { CategoryProducts } from "./pages/ProductsCategory";
import { Unauthorized } from "./pages/Unauthorized";
import { AdminDashboard } from "./pages/AdminDashboard";

// Componentes
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { ProtectedRoute } from "./components/ProtectedRoute";

// Hooks
import { useAuth } from "./context/AuthContext";

function App() {
  // Como AuthProvider ya está en main.tsx, podemos usar el hook aquí directamente
  const { isAuthenticated, role } = useAuth();

  return (
    <Router>
      <Navbar />
      
      <Routes>
        {/* === RUTAS PÚBLICAS === */}
        <Route path="/" element={<Home />} />
        <Route path="/productos" element={<Products />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/categorias" element={<Categorias />} />
        <Route path="/nosotros" element={<Nosotros />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/carrito" element={<Carrito />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/productos/:category" element={<CategoryProducts />} />
        <Route path="/detalle/:id" element={<ProductDetail />} />
        
        {/* Ruta de Acceso Denegado */}
        <Route path="/403" element={<Unauthorized />} />

        {/* === RUTAS PROTEGIDAS (ADMIN) === */}
        <Route element={
          <ProtectedRoute 
            isAllowed={isAuthenticated && role === 'ADMIN'} 
            redirectTo="/403" 
          />
        }>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Route>

        {/* Ruta 404 */}
        <Route path="*" element={<div style={{textAlign:'center', marginTop: 50}}><h2>404 - Página no encontrada</h2></div>} />
      </Routes>

      <Footer />
    </Router>
  );
}

export default App;