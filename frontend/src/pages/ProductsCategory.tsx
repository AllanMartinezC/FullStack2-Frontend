// src/pages/CategoryProducts.tsx
import { useParams, Link } from "react-router-dom";
// ❌ BORRADO: import { productsData } from "../data/ProductsData";
import { sameCategory } from "../components/slug"; 
import { useEffect, useState } from "react"; 

// 1. Definimos la interfaz (Modelo del Backend)
interface Producto {
    id: number;
    nombre: string;
    precio: number;
    imageUrl: string;
    categoria: { nombre: string };
    unit?: string;
    stock?: number;
}

export const CategoryProducts = () => {
    const { category = "" } = useParams();
    const decoded = decodeURIComponent(category);

    // 2. Estado para los productos filtrados
    const [items, setItems] = useState<Producto[]>([]);
    const [loading, setLoading] = useState(true);

    const API_URL = "http://localhost:8080/api/productos";
    const IMAGE_BASE_URL = "http://localhost:8080";

    // 3. Efecto para cargar y filtrar datos
    useEffect(() => {
        // Cambiar título
        document.title = `HuertoHogar — Productos en ${decoded}`;

        setLoading(true);

        // Fetch al backend
        fetch(API_URL)
            .then(res => res.json())
            .then((data: Producto[]) => {
                // 🔹 FILTRADO EN EL FRONTEND:
                // Usamos tu función 'sameCategory' comparando con 'p.categoria.nombre' que viene de Java
                const filtrados = data.filter(p => sameCategory(p.categoria.nombre, decoded));
                setItems(filtrados);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error al cargar productos", err);
                setLoading(false);
            });

    }, [decoded]); // Se ejecuta cada vez que cambia la categoría en la URL


    if (loading) return <div style={{textAlign:'center', marginTop: 50}}>Cargando productos...</div>;

    return (
      
        <div className="page-container">
            
            <nav className="breadcrumb" style={{maxWidth: 1000, margin: "16px auto 0", padding: "0 20px"}}>
                <Link to="/">Home</Link> / <Link to="/productos">Productos</Link> / <span style={{fontWeight: 'bold'}}>{decoded}</span>
            </nav>

            <main>
                <section className="productos-lista" style={{maxWidth: 1000, margin: "20px auto 40px", padding: "0 20px"}}>
                    <h2 style={{textTransform: "capitalize", fontSize: "2rem", marginBottom: "20px", color: "#4aa056"}}>
                        Productos — {decoded}
                    </h2>

                    {items.length === 0 ? (
                        <div style={{marginTop: 20}}>
                            <p>No encontramos productos en “{decoded}”.</p>
                            <p>
                                <Link to="/categorias" style={{color: "#5dbb63"}}>Volver a Categorías</Link> ·{" "}
                                <Link to="/productos" style={{color: "#5dbb63"}}>Ver todos los productos</Link>
                            </p>
                        </div>
                    ) : (
                        
                        <div className="galeria" style={{marginTop: 20}}>
                            {items.map(p => (
                             
                                <div key={p.id} className="producto">
                                    <Link to={`/detalle/${p.id}`}>
                                        {/* 🔹 IMAGEN: Concatenamos la URL base */}
                                        <img 
                                            src={`${IMAGE_BASE_URL}${p.imageUrl}`} 
                                            alt={p.nombre} // Usamos 'nombre'
                                        /> 
                                        
                                        {/* 🔹 TÍTULO: Usamos 'nombre' */}
                                        <h3>{p.nombre}</h3> 
                                    </Link>
                                    
                                    {/* 🔹 PRECIO: Usamos 'precio' */}
                                    <p className="precio">${p.precio} / {p.unit || "Unidad"}</p> 
                                    
                                    {/* STOCK (Validamos si existe) */}
                                    {p.stock !== undefined && (
                                        <p className="Stock" style={{color: Number(p.stock) > 0 ? '#10b981' : '#618d69ff'}}>
                                            Stock {p.stock} disponibles
                                        </p>
                                    )}
                                    <Link to={`/detalle/${p.id}`} className="btn">Ver Producto</Link>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </main>
                      
        </div>
    );
};

export default CategoryProducts;