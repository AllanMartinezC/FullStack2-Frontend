import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./ProductSlider.css";

// 1. Definimos la interfaz que coincida con tu Backend Java
interface Producto {
  id: number;
  nombre: string;   
  precio: number;   
  imageUrl: string; 
}

export const ProductSlider: React.FC = () => {
  const [products, setProducts] = useState<Producto[]>([]);

  const API_URL = "http://localhost:8080/api/productos";
  const IMAGE_BASE_URL = "http://localhost:8080";

  // 3. useEffect para cargar los datos al iniciar el componente
  useEffect(() => {
    fetch(API_URL)
      .then((response) => {
        if (!response.ok) throw new Error("Error al cargar productos");
        return response.json();
      })
      .then((data) => {
        setProducts(data);
      })
      .catch((error) => console.error(error));
  }, []);

  
  if (products.length === 0) return null;

  
  const items = products.slice(0, 12);

  return (
    <div className="hh-loop-slider">
      <div className="hh-fade hh-fade-left" />
      <div className="hh-fade hh-fade-right" />

      <div className="hh-loop-track" aria-hidden="false">
        {/* Duplicamos items para el efecto de loop infinito */}
        {[...items, ...items].map((p, i) => (
          <div key={`${p.id}-${i}`} className="hh-loop-item">
            <Link to={`/detalle/${p.id}`}>
              {/* 4. CAMBIO IMPORTANTE: 
              */}
              <img 
                src={`${IMAGE_BASE_URL}${p.imageUrl}`} 
                alt={p.nombre} 
              />
              <h5>{p.nombre}</h5>
            </Link>
            { }
            <p className="precio">${p.precio}</p>
          </div>
        ))}
      </div>
    </div>
  );
};