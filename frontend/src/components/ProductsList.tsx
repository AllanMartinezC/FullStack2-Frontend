// 🧩 Ejemplo de componente de React

import React, { useState, useEffect } from 'react';

// Define la interfaz de producto que coincida con tu modelo de Spring Boot
interface ProductoBackend {
    id: number;
    nombre: string;
    precio: number;
    imageUrl: string; // <-- Esta es la clave
    categoria: { nombre: string }; // Solo necesitamos el nombre de la categoría
}

const ProductosList = () => {
    const [productos, setProductos] = useState<ProductoBackend[]>([]);
    const [loading, setLoading] = useState(true);

    // URL de tu backend de Spring Boot (ajusta el puerto si es necesario)
    const API_URL = "http://localhost:8080/api/productos"; 
    const IMAGE_BASE_URL = "http://localhost:8080"; // Base para las imágenes

    useEffect(() => {
        // Función para cargar los datos desde Spring Boot
        fetch(API_URL)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data: ProductoBackend[]) => {
                setProductos(data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching data:", error);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div>Cargando productos...</div>;
    }

    return (
        <div className="productos-container">
            <h2>Todos los productos (Cargados desde Spring Boot)</h2>
            {productos.map(producto => (
                <div key={producto.id} className="producto-card">
                    
                    {/* 💡 CONSTRUIMOS LA RUTA COMPLETA DE LA IMAGEN */}
                    <img 
                        // imageUrl viene de la BD: "/images/manzanasFuji.jpg"
                        src={IMAGE_BASE_URL + producto.imageUrl} 
                        alt={producto.nombre} 
                        style={{ width: '200px', height: 'auto' }}
                    />
                    
                    <h3>{producto.nombre}</h3>
                    <p>Categoría: {producto.categoria.nombre}</p>
                    <p>Precio: ${producto.precio}</p>
                    {/* Otros detalles */}
                </div>
            ))}
        </div>
    );
};

export default ProductosList;