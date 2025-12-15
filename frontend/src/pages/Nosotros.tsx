import React, { useEffect } from 'react';
// import { Link } from 'react-router-dom'; // No se usa en este componente, se puede quitar o dejar

export const Nosotros = () => {
    // 1. Definimos la URL base del backend
    const IMAGE_BASE_URL = "http://localhost:8080";

    useEffect(() => {
        document.title = 'HuertoHogar — Nosotros';
        
        if (typeof window !== 'undefined' && typeof (window as any).renderAuthArea === 'function') {
            (window as any).renderAuthArea();
        }
        if (typeof window !== 'undefined' && typeof (window as any).updateCartBadge === 'function') {
            (window as any).updateCartBadge();
        }
    }, []);

    return (
        <div className="page-container">
            <main>
                <section
                    className="nosotros"
                    style={{ maxWidth: 1000, margin: '40px auto', padding: 20 }}
                >
                    <h2
                        className="nosotros-heading"
                        style={{ textAlign: 'center', marginBottom: 20, color: '#2E8B57' }}
                    >
                        Sobre HuertoHogar
                    </h2>

                    <p style={{ lineHeight: 1.6, textAlign: 'justify', marginBottom: 30 }}>
                        <strong>HuertoHogar</strong> es una tienda online dedicada a llevar la frescura y calidad de los productos
                        del campo directamente a la puerta de nuestros clientes en Chile. Con más de 6 años de experiencia,
                        operamos en más de 9 puntos a lo largo del país, incluyendo ciudades clave como Santiago, Puerto Montt,
                        Villarica, Nacimiento, Viña del Mar, Valparaíso y Concepción. Nuestra misión es conectar a las familias
                        chilenas con el campo, promoviendo un estilo de vida saludable y sostenible.
                    </p>

                    {/* 2. Insertamos la imagen aquí, donde tenías el espacio vacío */}
                    <div style={{ textAlign: 'center', margin: '30px 0' }}> 
                        <img 
                            src={`${IMAGE_BASE_URL}/images/Huerto.jpeg`} 
                            alt="Nuestro Huerto"
                            style={{ 
                                maxWidth: '100%', 
                                height: 'auto', 
                                borderRadius: '12px', 
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)' 
                            }}
                            onError={(e) => {
                                (e.currentTarget as HTMLImageElement).src = "https://via.placeholder.com/800x400?text=Foto+Huerto";
                            }}
                        />
                    </div>

                    <section
                        className="nosotros-mision"
                        style={{ maxWidth: 1000, margin: '0 auto', padding: 20 }}
                    >
                        <h3 style={{ marginBottom: 12 }}>Misión</h3>
                        <p style={{ lineHeight: 1.6, textAlign: 'justify' }}>
                            Nuestra misión es proporcionar productos frescos y de calidad directamente desde el campo hasta la puerta
                            de nuestros clientes, garantizando la frescura y el sabor en cada entrega. Nos comprometemos a fomentar
                            una conexión más cercana entre los consumidores y los agricultores locales, apoyando prácticas agrícolas
                            sostenibles y promoviendo una alimentación saludable en todos los hogares chilenos.
                        </p>
                    </section>
                    
                </section>
            </main>
        </div>
    );
};

export default Nosotros;