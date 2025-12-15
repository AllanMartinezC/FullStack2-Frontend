import { createContext, useContext, useEffect, useMemo, useReducer } from "react";
import type { ReactNode } from "react";
import { useAuth } from "./AuthContext"; // Importamos AuthContext para saber si hay usuario

export type CartItem = {
  productId: number;
  title: string;
  price: number;
  unit?: string;
  imageSrc: string;
  qty: number;
};

type CartState = { items: CartItem[] };

type Action =
  | { type: "SET_CART"; payload: CartItem[] } // Nueva acción para cargar desde backend
  | { type: "ADD"; payload: Omit<CartItem, "qty"> & { qty?: number } }
  | { type: "REMOVE"; payload: { productId: number } }
  | { type: "UPDATE_QTY"; payload: { productId: number; qty: number } }
  | { type: "CLEAR" };

const CartContext = createContext<{
  items: CartItem[];
  add: (p: Omit<CartItem, "qty">, qty?: number) => void;
  remove: (productId: number) => void;
  updateQty: (productId: number, qty: number) => void;
  clear: () => void;
  totalItems: number;
  totalPrice: number;
} | null>(null);

function reducer(state: CartState, action: Action): CartState {
  switch (action.type) {
    case "SET_CART":
      return { items: action.payload };

    case "ADD": {
      const { productId, title, price, unit, imageSrc } = action.payload;
      const qty = Math.max(1, action.payload.qty ?? 1);
      const idx = state.items.findIndex(i => i.productId === productId);
      if (idx >= 0) {
        const items = [...state.items];
        items[idx] = { ...items[idx], qty: items[idx].qty + qty };
        return { items };
      }
      return {
        items: [...state.items, { productId, title, price, unit, imageSrc, qty }]
      };
    }
    case "REMOVE": {
      return { items: state.items.filter(i => i.productId !== action.payload.productId) };
    }
    case "UPDATE_QTY": {
      const { productId, qty } = action.payload;
      if (qty <= 0) {
        return { items: state.items.filter(i => i.productId !== productId) };
      }
      return {
        items: state.items.map(i => (i.productId === productId ? { ...i, qty } : i)),
      };
    }
    case "CLEAR":
      return { items: [] };
    default:
      return state;
  }
}

const STORAGE_KEY = "huertohogar_cart_v1";
const API_URL = "http://localhost:8080/api/carrito";

export function CartProvider({ children }: { children: ReactNode }) {
  const { token, isAuthenticated } = useAuth(); // Obtenemos el estado de autenticación

  const [state, dispatch] = useReducer(reducer, undefined, () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as CartState) : { items: [] };
    } catch {
      return { items: [] };
    }
  });

  // 1. Efecto para guardar en localStorage (siempre)
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  // 2. Efecto para cargar carrito del backend al iniciar sesión
  useEffect(() => {
    if (isAuthenticated && token) {
      fetch(API_URL, {
        headers: { "Authorization": `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        // Convertimos la respuesta del backend al formato del frontend
        // Backend devuelve: { items: [{ producto: {...}, cantidad: 2 }] }
        const itemsBackend: CartItem[] = data.items.map((item: any) => ({
            productId: item.producto.id,
            title: item.producto.nombre,
            price: item.producto.precio,
            unit: item.producto.unit || "Unidad",
            imageSrc: `http://localhost:8080${item.producto.imageUrl}`,
            qty: item.cantidad
        }));
        dispatch({ type: "SET_CART", payload: itemsBackend });
      })
      .catch(err => console.error("Error cargando carrito remoto", err));
    }
  }, [isAuthenticated, token]);

  const value = useMemo(() => {
    const totalItems = state.items.reduce((s, i) => s + i.qty, 0);
    const totalPrice = state.items.reduce((s, i) => s + i.qty * i.price, 0);

    // Helper para headers
    const authHeaders = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
    };

    return {
      items: state.items,
      
      add: (p: Omit<CartItem, "qty">, qty = 1) => {
        // Actualizamos localmente primero (Optimistic UI)
        dispatch({ type: "ADD", payload: { ...p, qty } });

        // Si está logueado, enviamos al backend
        if (isAuthenticated && token) {
            fetch(`${API_URL}/add`, {
                method: "POST",
                headers: authHeaders,
                body: JSON.stringify({ productoId: p.productId, cantidad: qty })
            }).catch(console.error);
        }
      },

      remove: (productId: number) => {
        dispatch({ type: "REMOVE", payload: { productId } });
        
        if (isAuthenticated && token) {
            fetch(`${API_URL}/remove/${productId}`, {
                method: "DELETE",
                headers: authHeaders
            }).catch(console.error);
        }
      },

      updateQty: (productId: number, qty: number) => {
        // Nota: Para updateQty exacto, tu backend necesitaría un endpoint específico "update"
        // O podrías usar lógica de agregar/quitar diferencia.
        // Por simplicidad, aquí solo actualizamos localmente, o podrías implementar un endpoint PUT en backend.
        dispatch({ type: "UPDATE_QTY", payload: { productId, qty } });
      },

      clear: () => {
        dispatch({ type: "CLEAR" });
        if (isAuthenticated && token) {
            fetch(`${API_URL}/clear`, {
                method: "DELETE",
                headers: authHeaders
            }).catch(console.error);
        }
      },
      
      totalItems,
      totalPrice,
    };
  }, [state, isAuthenticated, token]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}