import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProductos } from "../services/productoService";
import type { Producto } from "../types";

export const Products = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  
  // URL base para las imágenes
  const IMAGE_BASE_URL = "http://localhost:8080";

  useEffect(() => {
    getProductos().then(setProductos);
  }, []);

  return (
    <main>
      <section className="productos-lista">
        <h2>Todos los productos</h2>

        <div className="galeria">
          {productos.map((p) => (
            // Usamos 'article' como en Categorias
            <article key={p.id} className="producto">
              
              {/* 🔹 ENLACE PRINCIPAL: Envuelve Imagen + Textos */}
              <Link to={`/detalle/${p.id}`} style={{ textDecoration: "none", color: "inherit", display: "block" }}>
                <img 
                  src={`${IMAGE_BASE_URL}${p.imageUrl}`} 
                  alt={p.nombre}
                  // Estilos para que la imagen se vea bien dentro de la tarjeta
                  style={{ width: "100%", height: "200px", objectFit: "contain", marginBottom: "10px" }} 
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = "https://via.placeholder.com/200?text=Sin+Imagen";
                  }}
                />
                
                <h3>{p.nombre}</h3>
                <p className="precio" style={{ fontWeight: "bold", color: "#4aa056" }}>
                    ${p.precio}
                </p>
                <p style={{ color: "#666", fontSize: "0.9rem" }}>
                    {p.categoria?.nombre || "Sin Categoría"}
                </p>
              </Link>

              {/* 🔹 BOTÓN: En un div separado y centrado */}
              <div style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}>
                <Link 
                  to={`/detalle/${p.id}`} 
                  className="btn-outline" 
                  // 🟢 CAMBIO AQUÍ: Fondo verde y letra blanca por defecto
                  style={{
                      padding: "8px 16px",
                      border: "1px solid #4aa056",
                      borderRadius: "5px",
                      backgroundColor: "#4aa056", // Fondo Verde
                      color: "white",             // Letra Blanca (Tu pedido)
                      textDecoration: "none",
                      fontWeight: "600",
                      transition: "all 0.3s ease"
                  }}
                  // Efecto Hover: Invierte los colores (Fondo blanco, letra verde)
                  onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = "white";
                      e.currentTarget.style.color = "#4aa056";
                  }}
                  onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = "#4aa056";
                      e.currentTarget.style.color = "white";
                  }}
                >
                  Ver Producto
                </Link>
              </div>

            </article>
          ))}
        </div>
      </section>
    </main>
  );
};