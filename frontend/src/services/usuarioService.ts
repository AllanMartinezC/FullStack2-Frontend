import type{ Usuario } from "../types";

const API_URL = "http://localhost:8080/api/usuarios";

// Helper para obtener el token 
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  };
};

// Obtener lista de usuarios
export const getUsuarios = async (): Promise<Usuario[]> => {
  const res = await fetch(API_URL, {
    headers: getAuthHeaders() // Importante: Enviar token
  });
  if (!res.ok) throw new Error("Error al cargar usuarios");
  return res.json();
};

// Crear usuario 
export const createUsuario = async (usuario: Partial<Usuario>): Promise<Usuario> => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(usuario),
  });
  if (!res.ok) throw new Error("Error al crear usuario");
  return res.json();
};

// Eliminar usuario 
export const deleteUsuario = async (id: number): Promise<void> => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Error al eliminar usuario");

};

