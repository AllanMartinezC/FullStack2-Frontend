// src/pages/Home.tsx
import React from "react";
import { Link } from "react-router-dom";
import { ProductSlider } from "../components/ProductosSlider";

export const Home = () => {
  // 1. Definimos la URL base del backend
  const IMAGE_BASE_URL = "http://localhost:8080";

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero d-flex align-items-center justify-content-between p-4 bg-light rounded shadow-sm">
        <div className="hero-text" style={{ maxWidth: "50%" }}>
          <h1 className="fw-bold text-success">HuertoHogar</h1>
          <p>
            HuertoHogar es una tienda online dedicada a llevar la frescura y
            calidad de los productos del campo directamente a la puerta de
            nuestros clientes en Chile.
          </p>
          <Link to="/productos" className="btn btn-success mt-2">
            Ver Productos
          </Link>
        </div>
        
        <div className="hero-img">
          {/* 2. CORREGIDO: Usamos la URL del backend */}
          <img
            src={`${IMAGE_BASE_URL}/images/Huerto.jpeg`} 
            alt="Foto del Huerto"
            style={{
              width: "400px",
              height: "auto",
              borderRadius: "12px",
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            }}
            // Opcional: Si la imagen falla, muestra un placeholder
            onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = "https://via.placeholder.com/400?text=Foto+Huerto";
            }}
          />
        </div>
      </section>

      {/* Productos Destacados con slider horizontal */}
      <section className="productos-destacados mt-5">
        <h2 className="text-center mb-4">Nuestros Productos</h2>
        <ProductSlider />
      </section>
    </div>
  );
};