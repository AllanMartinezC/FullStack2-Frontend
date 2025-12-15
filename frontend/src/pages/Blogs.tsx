import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Footer } from '../components/Footer';

export const Blogs = () => {
  // 1. Definimos la URL base del backend
  const IMAGE_BASE_URL = "http://localhost:8080";

  useEffect(() => {
    document.title = 'HuertoHogar — Blog';

    if (typeof window !== 'undefined' && typeof (window as any).renderAuthArea === 'function') {
      (window as any).renderAuthArea();
    }

    if (typeof window !== 'undefined' && typeof (window as any).updateCartBadge === 'function') {
      (window as any).updateCartBadge();
    }
  }, []);

  return (
    <div>
      <main>
        <section className="blog-section">
          <h2 className="blog-heading">NOTICIAS IMPORTANTES</h2>

          {/* Tarjeta 1 */}
          <article className="blog-card">
            <figure className="blog-media">
              <img
                src={`${IMAGE_BASE_URL}/images/temporada_SEPTIEMBRE-F.jpg`}
                alt="Guía visual: frutas de temporada"
                onError={(e) => { (e.currentTarget as HTMLImageElement).src = "https://via.placeholder.com/400x200?text=Blog+1"; }}
              />
            </figure>
            <div className="blog-content">
              <h3 className="blog-title">CASO CURIOSO #1</h3>
              <Link className="btn-outline" to="/posts/caso-1">
                VER CASO
              </Link>
              <p className="blog-excerpt">
                Guía rápida para identificar frutas de temporada y reconocer signos de frescura
                en el punto de venta. Consejos prácticos aplicados a manzanas, naranjas y plátanos.
              </p>
            </div>
          </article>

          {/* Tarjeta 2 */}
          <article className="blog-card">
            <figure className="blog-media">
              <img
                src={`${IMAGE_BASE_URL}/images/proveedores-gastronomicos-1.png`}
                alt="Visita a proveedor local del huerto"
                onError={(e) => { (e.currentTarget as HTMLImageElement).src = "https://via.placeholder.com/400x200?text=Blog+2"; }}
              />
            </figure>
            <div className="blog-content">
              <h3 className="blog-title">CASO CURIOSO #2</h3>
              <Link className="btn-outline" to="/posts/caso-2">
                VER CASO
              </Link>
              <p className="blog-excerpt">
                Cómo elegimos proveedores locales: criterios de trazabilidad, prácticas sustentables
                y controles de calidad antes de que tus productos lleguen a casa.
              </p>
            </div>
          </article>

          {/* Tarjeta 3 */}
          <article className="blog-card">
            <figure className="blog-media">
              <img
                src={`${IMAGE_BASE_URL}/images/frutas-y-verduras.jpg`}
                alt="Recetas de aprovechamiento del huerto"
                onError={(e) => { (e.currentTarget as HTMLImageElement).src = "https://via.placeholder.com/400x200?text=Blog+3"; }}
              />
            </figure>
            <div className="blog-content">
              <h3 className="blog-title">CASO CURIOSO #3</h3>
              <Link className="btn-outline" to="/posts/caso-3">
                VER CASO
              </Link>
              <p className="blog-excerpt">
                Recetas de aprovechamiento con verduras de temporada: ideas simples para reducir
                desperdicios y optimizar tu presupuesto semanal.
              </p>
            </div>
          </article>
        </section>
      </main>

    </div>
  );
};

export default Blogs;