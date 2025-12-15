import type { Producto } from "../types";

// ⚠️ Ajustamos la base a /api para poder llamar a /productos y /categorias
const API_URL = "http://localhost:8080/api"; 

// Helper para obtener las cabeceras con el Token
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}` 
  };
};

// --- PRODUCTOS ---

export const getProductos = async (): Promise<Producto[]> => {
  const res = await fetch(`${API_URL}/productos`);
  if (!res.ok) throw new Error("Error al cargar productos");
  return res.json();
};

export const getProductoById = async (id: number): Promise<Producto> => {
  const res = await fetch(`${API_URL}/productos/${id}`);
  if (!res.ok) throw new Error("Producto no encontrado");
  return res.json();
};

// --- MÉTODOS PRIVADOS (ADMIN) ---

// Eliminar Producto
export const deleteProducto = async (id: number): Promise<void> => {
  const res = await fetch(`${API_URL}/productos/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(), 
  });

  if (!res.ok) throw new Error("Error al eliminar producto");
};

// Crear Producto
export const createProducto = async (producto: Partial<Producto>): Promise<Producto> => {
  const res = await fetch(`${API_URL}/productos`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(producto),
  });

  if (!res.ok) throw new Error("Error al crear producto");
  return res.json();
};

// Editar Producto
export const updateProducto = async (id: number, producto: Partial<Producto>): Promise<Producto> => {
  const res = await fetch(`${API_URL}/productos/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(producto),
  });

  if (!res.ok) throw new Error("Error al actualizar producto");
  return res.json();
};

export const getCategorias = async (): Promise<any[]> => {
    const res = await fetch(`${API_URL}/categorias`);
    if (!res.ok) throw new Error("Error al cargar categorías");
    return res.json();
};