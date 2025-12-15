import { useEffect } from 'react';
import { Link } from 'react-router-dom';

import { useCart } from '../context/CartContext';


const formatPrice = (price:number) => {
    
    return `$${price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
};

export const Carrito = () => {
  const { items, totalItems, totalPrice, updateQty, remove, clear } = useCart();

  useEffect(() => {
    document.title = 'Carrito — HuertoHogar';
  }, []);

  return (
    <main className="cart-page-container">
      <h2 className="mb-4">🛒 Carrito de compras</h2>
      
      {}
      <div className="cart-wrapper">
        
        {}
        <section className="cart-list-wrapper"> 
          {items.length === 0 ? (
            
            <div className="empty-cart-message">
              <p className="lead mb-3">Tu carrito está vacío.</p>
              {}
              <Link to="/productos" className="btn-success">Ir a productos</Link> 
            </div>
          ) : (
            <div className="cart-list">
              {items.map((it) => (
                <article key={it.productId} className="cart-item">
                  
                  {}
                  <img src={it.imageSrc} alt={it.title} />
                  
                  {}
                  <div className="item-info">
                    <h4 className="mb-1">{it.title}</h4>
                    <div className="price">
                      {formatPrice(it.price)} / {it.unit ?? 'und'}
                    </div>
                  </div>

                  {}
                  <div className="cart-item-controls">
                    
                    {}
                    <div className="qty-controls">
                      <button type="button" onClick={() => updateQty(it.productId, it.qty - 1)}>
                        –
                      </button>
                      <input
                        type="number"
                        min={1}
                        value={it.qty}
                        onChange={(e) => {
                          const v = Math.max(1, Number(e.target.value) || 1);
                          updateQty(it.productId, v);
                        }}
                      />
                      <button type="button" onClick={() => updateQty(it.productId, it.qty + 1)}>
                        +
                      </button>
                    </div>

                    {}
                    <div className="line-total">
                      {formatPrice(it.qty * it.price)}
                    </div>

                    {}
                    <button
                      className="remove-btn"
                      onClick={() => remove(it.productId)}
                      title="Quitar producto"
                    >
                      ✕
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* Columna del Resumen  */}
        <aside className="cart-summary">
          <h3>Resumen</h3>
          
          <dl>
            <div>
              <dt>Subtotal</dt>
              <dd>{formatPrice(totalPrice)}</dd>
            </div>
            <div>
              <dt>Envío</dt>
              <dd>$0</dd>
            </div>
            <div className="total">
              <dt>Total</dt>
              <dd>{formatPrice(totalPrice)}</dd>
            </div>
          </dl>

          <button
            type="button"
            className="btn-checkout"
            disabled={!items.length}
            onClick={() => alert("Flujo de pago pendiente")}
          >
            Proceder al pago
          </button>

          <button
            type="button"
            className="btn-clear"
            disabled={!items.length}
            onClick={clear}
          >
            Vaciar carrito
          </button>

          <Link
            to="/productos"
            className="continue-shopping-link"
          >
            ← Seguir comprando
          </Link>
        </aside>
      </div>
    </main>
  );
};

export default Carrito;