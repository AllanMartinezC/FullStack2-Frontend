import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

// 1. Definimos la interfaz incluyendo 'role'
interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
  username: string | null;
  role: string | null; // ✅ Propiedad role
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 🛠️ Helper fuera del componente para usarlo en la inicialización
const decodeToken = (token: string) => {
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload));
    
    // 🕵️‍♂️ LOGS DE DEPURACIÓN
    console.log("🔍 Token Init:", decoded);
    
    return {
      username: decoded.sub, 
      role: decoded.role     
    };
  } catch (e) {
    return null;
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // --- INICIALIZACIÓN "LAZY" (PEREZOSA) ---
  // Esto se ejecuta ANTES de que se renderice la página por primera vez
  
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"));
  
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => !!localStorage.getItem("token"));
  
  // ✅ CORRECCIÓN: Leemos el rol y usuario AL INICIO, no esperamos al useEffect
  const [username, setUsername] = useState<string | null>(() => {
    const savedToken = localStorage.getItem("token");
    return savedToken ? decodeToken(savedToken)?.username || null : null;
  });

  const [role, setRole] = useState<string | null>(() => {
    const savedToken = localStorage.getItem("token");
    return savedToken ? decodeToken(savedToken)?.role || null : null;
  });

  // Efecto solo para sincronizar cambios futuros (login/logout)
  useEffect(() => {
    if (token) {
      const decoded = decodeToken(token);
      if (decoded) {
        setUsername(decoded.username);
        setRole(decoded.role);
        setIsAuthenticated(true);
      }
    }
  }, [token]);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Credenciales inválidas");
      }

      const data = await response.json();
      
      if (data.token) {
        // 1. Guardar en localStorage
        localStorage.setItem("token", data.token);
        
        // 2. Decodificar para obtener datos
        const decoded = decodeToken(data.token);
        
        // 3. Actualizar TODOS los estados al mismo tiempo
        setToken(data.token);
        setIsAuthenticated(true);
        if (decoded) {
            setUsername(decoded.username);
            setRole(decoded.role);
        }
      }
    } catch (error) {
      console.error("Error en login:", error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setIsAuthenticated(false);
    setUsername(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ token, isAuthenticated, username, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
};