import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
// ❌ BORRAMOS: import { productsData } from "../data/ProductsData";
import { toSlug } from "../components/slug"; 

// 1. Definimos la interfaz que viene de Spring Boot
interface Producto {
  id: number;
  nombre: string;
  imageUrl: string;
  categoria: {
    nombre: string;
  };
}

export const Categorias = () => {
    // 2. Estado para guardar los productos del backend
    const [productos, setProductos] = useState<Producto[]>([]);
    
    // Constantes
    const API_URL = "http://localhost:8080/api/productos";
    const IMAGE_BASE_URL = "http://localhost:8080";

    // 3. Cargar datos al iniciar
    useEffect(() => {
        document.title = "HuertoHogar — Categorías";
        
        // Fetch al backend
        fetch(API_URL)
            .then(res => res.json())
            .then(data => setProductos(data))
            .catch(err => console.error("Error cargando productos:", err));

        if (typeof window !== "undefined" && typeof (window as any).updateCartBadge === "function") {
            (window as any).updateCartBadge();
        }
    }, []);

    const categorias = useMemo(() => {
        const map = new Map<string, { name: string; image: string | null; count: number }>();
        
        for (const p of productos) {
            const key = p.categoria.nombre; 
            
            const fullImageUrl = p.imageUrl ? `${IMAGE_BASE_URL}${p.imageUrl}` : null;

            if (!map.has(key)) {
                map.set(key, { name: key, image: fullImageUrl, count: 1 });
            } else {
                const ref = map.get(key)!;
                ref.count += 1;
                
               
                if (!ref.image && fullImageUrl) ref.image = fullImageUrl;
            }
        }
        return Array.from(map.values());
    }, [productos]); 

    return (

        <div className="page-container"> 
            <main>
                <section className="categorias-section">
                    <h2 className="categorias-heading">
                        Categorías de HuertoHogar
                    </h2>

                    <div className="categorias-galeria">
                      {categorias.map(cat => (
                        <article key={cat.name} className="categoria-card">
                          {/* 🔹 El enlace principal */}
                          <Link to={`/productos/${toSlug(cat.name)}`} className="categoria-link">
                            <img
                              src={cat.image ?? "/imagenes/placeholder.png"} 
                              alt={cat.name}
                              onError={(e) => {
                                (e.currentTarget as HTMLImageElement).src = "/imagenes/placeholder.png";
                              }}
                            />
                            <h3>{cat.name}</h3>
                            <p>{cat.count} producto{cat.count !== 1 ? "s" : ""}</p>
                          </Link>

                          {/* 🔹 Botón */}
                          <div style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}>
                            <Link to={`/productos/${toSlug(cat.name)}`} className="btn-outline">
                              Ver productos
                            </Link>
                          </div>
                        </article>
                      ))}
                    </div>

                </section>
            </main>
        </div>
    );
};

export default Categorias;