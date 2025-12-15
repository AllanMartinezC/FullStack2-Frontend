import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react"; // 1. Agregamos useEffect
// ❌ BORRADO: import { productsData } from "../data/ProductsData";
import { Footer } from "../components/Footer";
import { useCart } from "../context/CartContext"; 

// 2. Interfaz para lo que recibimos del Backend
interface ProductoBackend {
    id: number;
    nombre: string;
    precio: number;
    imageUrl: string;
    categoria: { nombre: string };
    // Estos campos quizás no estén en tu backend aún, los marco opcionales
    description?: string;
    stock?: number;
    unit?: string;
}

export const ProductDetail = () => {
    const { id } = useParams();
    const { add } = useCart(); 
    
    // 3. Estado para guardar el producto que viene de internet
    const [product, setProduct] = useState<ProductoBackend | null>(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1); 

    const API_URL = `http://localhost:8080/api/productos/${id}`;
    const IMAGE_BASE_URL = "http://localhost:8080";

    // 4. Fetch al montar el componente
    useEffect(() => {
        fetch(API_URL)
            .then(res => {
                if (!res.ok) throw new Error("Producto no encontrado");
                return res.json();
            })
            .then(data => {
                setProduct(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [id]);

    const handleAddToCart = () => {
        if (product) {
            // 5. IMPORTANTE: Adaptamos los datos del backend al formato de tu carrito
            const itemToAdd = {
                productId: product.id,
                title: product.nombre,   // Mapeamos 'nombre' a 'title'
                price: product.precio,
                unit: product.unit || "Unidad",
                imageSrc: `${IMAGE_BASE_URL}${product.imageUrl}`, // URL completa
            };

            // Nota: itemToAdd debe coincidir con lo que espera tu 'add' function
            add(itemToAdd as any, quantity); // 'as any' por si tu interfaz de carrito es estricta
            console.log(`¡${quantity} unidad(es) de ${product.nombre} añadidas al carrito!`); 
        }
    };

    const increment = () => setQuantity(prev => prev + 1);
    const decrement = () => setQuantity(prev => Math.max(1, prev - 1));

    // Pantalla de Carga
    if (loading) return <div style={{textAlign:'center', marginTop: '50px'}}>Cargando...</div>;

    // Si no se encontró el producto
    if (!product) {
        return (
            <div className="detalle-wrap" style={{ textAlign: 'center' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Producto no encontrado</h2>
                <Link to="/productos" style={{ color: '#5dbb63', textDecoration: 'underline' }}>Volver a Productos</Link>
                <Footer />
            </div>
        );
    }

    // URL completa de la imagen para mostrar en el render
    const fullImageUrl = `${IMAGE_BASE_URL}${product.imageUrl}`;

    // --- Componente Principal ---
    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f9f9f9' }}>
            
            <nav className="breadcrumb p-4 text-sm font-medium bg-white" style={{ 
                color: '#344e41',
                borderBottom: '1px solid #e5e7eb',
                boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
            }}>
                <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                    <Link to="/" style={{ textDecoration: 'none', color: '#4aa056', transition: 'color 0.2s' }}>Home</Link> 
                    <span className="mx-2 text-gray-400">/</span>
                    <Link to="/productos" style={{ textDecoration: 'none', color: '#4aa056', transition: 'color 0.2s' }}>Productos</Link> 
                    <span className="mx-2 text-gray-400">/</span>
                    <span className="font-bold text-gray-700">{product.nombre}</span> {/* Usamos .nombre */}
                </div>
            </nav>

            <main className="flex-grow">
                <section className="detalle-wrap">
                    
                    <div className="detalle-content">
                        
                        {/* 1. Columna de Imagen */}
                        <div className="detalle-img-wrapper">
                            <img
                                className="detalle-img"
                                src={fullImageUrl} // Usamos la URL completa
                                alt={product.nombre} // Usamos .nombre
                            />
                        </div>

                        {/* 2. Columna de Información */}
                        <div className="detalle-info">
                            
                            {/* Título y Categoría */}
                            <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.5rem', color: '#2c7a38' }}>
                                {product.nombre}
                            </h1>
                            <p className="detalle-cat" style={{ color: '#4aa056', fontSize: '1.1rem', marginBottom: '1.5rem' }}>
                                {product.categoria.nombre} {/* Accedemos al objeto categoria */}
                            </p>
                            
                            {/* Precio */}
                            <div className="price-stock-box">
                                <p className="detalle-precio" style={{ fontSize: '2rem', fontWeight: '900', marginBottom: '0.25rem', color: '#4aa056' }}>
                                    ${product.precio} 
                                    <span style={{ fontSize: '1rem', fontWeight: 'normal', color: '#6b7280', marginLeft: '0.5rem' }}> / {product.unit ?? "unidad"}</span>
                                </p>
                                {/* Oculté el stock temporalmente si no viene del backend, o mostramos un default */}
                                {product.stock !== undefined && (
                                    <p style={{ fontSize: '1rem', fontWeight: '600', color: Number(product.stock) > 0 ? '#10b981' : '#ef4444' }}>
                                        Stock: {product.stock} disponibles
                                    </p>
                                )}
                            </div>

                            {/* Descripción */}
                            <div style={{ marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid #e5e7eb' }}>
                                <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.75rem', color: '#374151', borderBottom: '2px solid #ccc', paddingBottom: '5px' }}>Detalles del Producto</h3>
                                <p className="detalle-desc" style={{ color: '#4b5563', lineHeight: '1.6', fontSize: '1.1rem' }}>
                                    {product.description || "Descripción no disponible por el momento."}
                                </p>
                            </div>

                            {/* CONTADOR Y BOTÓN DE CARRITO */}
                            <div className="detalle-cta" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <span style={{ fontSize: '1.1rem', fontWeight: '600', color: '#374151', marginRight: '0.5rem' }}>Cantidad:</span>
                                    
                                    <div className="qty-controls" style={{ gap: '0' }}> 
                                        <button onClick={decrement} disabled={quantity <= 1}>−</button>
                                        <input type="number" min={1} value={quantity} readOnly 
                                            style={{ width: '50px', height: '36px', padding: '0', border: '1px solid #cfd4dc', textAlign: 'center' }} 
                                        />
                                        <button onClick={increment}>+</button>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '1rem' }}>
                                    <button
                                        className="btn-add-to-cart"
                                        style={{ flex: 2 }}
                                        onClick={handleAddToCart}
                                    >
                                        🛒 Añadir {quantity} {product.unit ? "a(s)" : ""} al carrito
                                    </button>
                                    
                                    <Link to="/productos" 
                                        className="btn-outline"
                                        style={{ flex: 1, padding: '15px 20px', textAlign: 'center' }}
                                    >
                                        Volver a Productos
                                    </Link>
                                </div>
                            </div>
                            
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default ProductDetail;