// src/types.ts

// Categoría
export interface Categoria {
  id: number;       
  nombre: string;
}

// Producto
export interface Producto {
  id?: number;       
  nombre: string;
  precio: number;
  unidad?: string; 
  imageUrl: string; 
  categoria?: Categoria; 
}

// Usuario (Actualizado para el Dashboard)
export interface Usuario {
  id?: number;       
  nombre: string;
  apellido?: string; 
  email: string;
  password?: string; 
  role?: "ADMIN" | "USER"; 
  fechaNacimiento?: string; 
}