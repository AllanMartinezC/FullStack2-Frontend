import axios from "axios";
import type { Categoria } from "../types";

const API_URL = "http://localhost:8080/api/categorias";

// Listar todas las categorías
export const getCategorias = async (): Promise<Categoria[]> => {
    const res = await axios.get<Categoria[]>(API_URL);
    return res.data;
};

// Crear una nueva categoría
export const crearCategoria = async (categoria: Categoria): Promise<Categoria> => {
    const res = await axios.post<Categoria>(API_URL, categoria);
    return res.data;
};

// Obtener categoría por ID
export const getCategoriaPorId = async (id: number): Promise<Categoria> => {
    const res = await axios.get<Categoria>(`${API_URL}/${id}`);
    return res.data;
};

// Eliminar categoría
export const eliminarCategoria = async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/${id}`);
};
