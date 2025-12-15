import { useEffect, useState } from "react";
import { getProductos, deleteProducto, createProducto, updateProducto, getCategorias } from "../services/productoService";
import { getUsuarios, deleteUsuario, createUsuario } from "../services/usuarioService";
import type { Producto, Usuario } from "../types";

export const AdminDashboard = () => {
  // --- ESTADOS GLOBALES ---
  const [activeTab, setActiveTab] = useState<"productos" | "usuarios">("productos");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const IMAGE_BASE_URL = "http://localhost:8080";

  // --- ESTADOS PRODUCTOS ---
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<any[]>([]);
  const [editingProdId, setEditingProdId] = useState<number | null>(null);
  
  const [formProd, setFormProd] = useState({
    nombre: "", 
    precio: 0, 
    imageUrl: "/images/placeholder.png", 
    categoriaId: ""
  });

  // --- ESTADOS USUARIOS ---
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [formUser, setFormUser] = useState({
    nombre: "", 
    apellido: "", 
    email: "", 
    password: "", 
    role: "USER", 
    fechaNacimiento: ""
  });

  // --- CARGA INICIAL DE DATOS ---
  const cargarDatos = async () => {
    setLoading(true);
    try {
      // Cargamos todo en paralelo para que sea más rápido
      const [prods, cats, users] = await Promise.all([
        getProductos(), 
        getCategorias(),
        getUsuarios()
      ]);
      setProductos(prods);
      setCategorias(cats);
      setUsuarios(users);
    } catch (err) {
      console.error(err);
      // alert("Error conectando con el servidor");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = "Panel Admin — HuertoHogar";
    cargarDatos();
  }, []);

  // ==============================
  // LÓGICA DE PRODUCTOS
  // ==============================
  const handleDeleteProd = async (id: number) => {
    if (!window.confirm("¿Eliminar producto?")) return;
    try {
      await deleteProducto(id);
      setProductos(productos.filter(p => p.id !== id));
      alert("✅ Producto eliminado");
    } catch (e) { alert("Error al eliminar"); }
  };

  const handleEditProd = (p: Producto) => {
    if (!p.id) return;
    setEditingProdId(p.id);
    setFormProd({
      nombre: p.nombre, 
      precio: p.precio, 
      imageUrl: p.imageUrl,
      categoriaId: p.categoria?.id?.toString() || ""
    });
    setShowModal(true);
  };

  const handleSaveProd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        nombre: formProd.nombre,
        precio: Number(formProd.precio),
        imageUrl: formProd.imageUrl,
        categoria: { id: Number(formProd.categoriaId) }
      };
      
      // Buscamos el objeto categoría completo para actualizar la UI sin recargar
      const categoriaCompleta = categorias.find(c => c.id === Number(formProd.categoriaId));

      if (editingProdId) {
        // EDITAR
        const updated = await updateProducto(editingProdId, payload as any);
        const final = { ...updated, categoria: categoriaCompleta || updated.categoria };
        setProductos(productos.map(p => p.id === editingProdId ? final : p));
        alert("✅ Producto actualizado");
      } else {
        // CREAR
        const created = await createProducto(payload as any);
        const final = { ...created, categoria: categoriaCompleta || created.categoria };
        setProductos([...productos, final]);
        alert("✅ Producto creado");
      }
      setShowModal(false);
    } catch (e) { alert("Error al guardar producto"); }
  };

  // ==============================
  // LÓGICA DE USUARIOS
  // ==============================
  const handleDeleteUser = async (id: number) => {
    if (!window.confirm("¿Estás seguro de eliminar este usuario? Esta acción es irreversible.")) return;
    try {
      await deleteUsuario(id);
      setUsuarios(usuarios.filter(u => u.id !== id));
      alert("✅ Usuario eliminado");
    } catch (e) { alert("Error al eliminar usuario"); }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Validación simple de edad en frontend
      if (formUser.fechaNacimiento) {
         const year = new Date(formUser.fechaNacimiento).getFullYear();
         if (new Date().getFullYear() - year < 18) {
             alert("El usuario debe ser mayor de edad");
             return;
         }
      }

      const created = await createUsuario(formUser as any);
      setUsuarios([...usuarios, created]);
      setShowModal(false);
      // Limpiar formulario
      setFormUser({ nombre: "", apellido: "", email: "", password: "", role: "USER", fechaNacimiento: "" });
      alert("✅ Usuario creado exitosamente");
    } catch (e) { alert("Error al crear usuario (Revisa si el correo ya existe)"); }
  };

  // Abrir Modal Limpio (Resetea según la pestaña activa)
  const openModal = () => {
    if (activeTab === "productos") {
        setEditingProdId(null);
        setFormProd({ nombre: "", precio: 0, imageUrl: "/images/placeholder.png", categoriaId: "" });
    } else {
        setFormUser({ nombre: "", apellido: "", email: "", password: "", role: "USER", fechaNacimiento: "" });
    }
    setShowModal(true);
  };

  if (loading) return <div style={{ padding: "4rem", textAlign:"center", color: "#666" }}>Cargando panel...</div>;

  return (
    <div className="page-container" style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      
      {/* HEADER PRINCIPAL */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h1 style={{ color: "#2f9d55", margin: 0 }}>Panel de Administración</h1>
        
        {/* Botón de acción principal que cambia según la pestaña */}
        <button 
            className="btn-primary" 
            onClick={openModal} 
            style={{ 
                padding: "10px 20px", 
                cursor: "pointer", 
                backgroundColor: "#2f9d55", 
                color: "white", 
                border: "none", 
                borderRadius: "5px",
                fontWeight: "bold",
                boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
            }}
        >
          {activeTab === "productos" ? "+ Nuevo Producto" : "+ Nuevo Usuario"}
        </button>
      </div>

      {/* PESTAÑAS (TABS) */}
      <div style={{ display: "flex", borderBottom: "2px solid #eee", marginBottom: "20px" }}>
        <button 
            onClick={() => setActiveTab("productos")}
            style={{ 
                padding: "10px 20px", cursor: "pointer", background: "none", border: "none", fontSize: "1rem",
                fontWeight: "bold", borderBottom: activeTab === "productos" ? "3px solid #2f9d55" : "3px solid transparent",
                color: activeTab === "productos" ? "#2f9d55" : "#666", transition: "all 0.3s"
            }}
        >
            📦 Productos
        </button>
        <button 
            onClick={() => setActiveTab("usuarios")}
            style={{ 
                padding: "10px 20px", cursor: "pointer", background: "none", border: "none", fontSize: "1rem",
                fontWeight: "bold", borderBottom: activeTab === "usuarios" ? "3px solid #2f9d55" : "3px solid transparent",
                color: activeTab === "usuarios" ? "#2f9d55" : "#666", transition: "all 0.3s"
            }}
        >
            👥 Usuarios
        </button>
      </div>

      {/* CONTENIDO DE LA TABLA */}
      <div style={{ overflowX: "auto", boxShadow: "0 4px 10px rgba(0,0,0,0.05)", borderRadius: "8px", backgroundColor: "white", border: "1px solid #eee" }}>
        
        {activeTab === "productos" ? (
          // === TABLA DE PRODUCTOS ===
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#f9fafb", textAlign: "left", color: "#4b5563" }}>
                <th style={{ padding: "12px" }}>ID</th>
                <th style={{ padding: "12px" }}>Imagen</th>
                <th style={{ padding: "12px" }}>Nombre</th>
                <th style={{ padding: "12px" }}>Precio</th>
                <th style={{ padding: "12px" }}>Categoría</th>
                <th style={{ padding: "12px", textAlign: "center" }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.map(p => (
                <tr key={p.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                  <td style={{ padding: "12px", color: "#666" }}>#{p.id}</td>
                  <td style={{ padding: "12px" }}>
                    <img 
                        src={p.imageUrl.startsWith("http") ? p.imageUrl : `${IMAGE_BASE_URL}${p.imageUrl}`} 
                        alt="" 
                        style={{width: 40, height: 40, objectFit: "cover", borderRadius: 4, border: "1px solid #eee"}} 
                        onError={(e) => (e.currentTarget as HTMLImageElement).src = "https://via.placeholder.com/40"} 
                    />
                  </td>
                  <td style={{ padding: "12px", fontWeight: "bold" }}>{p.nombre}</td>
                  <td style={{ padding: "12px", color: "#2f9d55" }}>${p.precio}</td>
                  <td style={{ padding: "12px" }}>
                    <span style={{background:"#ecfdf5", color:"#065f46", padding:"2px 8px", borderRadius:10, fontSize:"0.8rem"}}>
                        {p.categoria?.nombre || "N/A"}
                    </span>
                  </td>
                  <td style={{ padding: "12px", textAlign: "center" }}>
                    <button onClick={() => handleEditProd(p)} style={{ marginRight: 8, cursor: "pointer", border: "none", background: "#fef3c7", color: "#d97706", borderRadius: 4, padding: "4px 8px" }} title="Editar">✏️</button>
                    <button onClick={() => p.id && handleDeleteProd(p.id)} style={{ cursor: "pointer", border: "none", background: "#fee2e2", color: "#dc2626", borderRadius: 4, padding: "4px 8px" }} title="Eliminar">🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          // === TABLA DE USUARIOS ===
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#f9fafb", textAlign: "left", color: "#4b5563" }}>
                <th style={{ padding: "12px" }}>ID</th>
                <th style={{ padding: "12px" }}>Nombre</th>
                <th style={{ padding: "12px" }}>Apellido</th>
                <th style={{ padding: "12px" }}>Email</th>
                <th style={{ padding: "12px" }}>Rol</th>
                <th style={{ padding: "12px", textAlign: "center" }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map(u => (
                <tr key={u.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                  <td style={{ padding: "12px", color: "#666" }}>#{u.id}</td>
                  <td style={{ padding: "12px", fontWeight: "500" }}>{u.nombre}</td>
                  <td style={{ padding: "12px" }}>{u.apellido || "-"}</td>
                  <td style={{ padding: "12px" }}>{u.email}</td>
                  <td style={{ padding: "12px" }}>
                    <span style={{ 
                        background: u.role === "ADMIN" ? "#fee2e2" : "#eff6ff", 
                        color: u.role === "ADMIN" ? "#991b1b" : "#1e40af", 
                        padding:"2px 10px", borderRadius:12, fontSize:"0.75rem", fontWeight:"bold", textTransform: "uppercase"
                    }}>
                        {u.role}
                    </span>
                  </td>
                  <td style={{ padding: "12px", textAlign: "center" }}>
                    <button 
                        onClick={() => u.id && handleDeleteUser(u.id)} 
                        style={{ cursor: "pointer", border: "none", background: "#fee2e2", color: "#dc2626", borderRadius: 4, padding: "4px 8px" }} 
                        title="Eliminar Usuario"
                    >
                        🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* --- MODAL UNIFICADO (Contiene los 2 formularios) --- */}
      {showModal && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 9999 }}>
            <div style={{ backgroundColor: "white", padding: "30px", borderRadius: "12px", width: "400px", maxHeight:"90vh", overflowY:"auto", boxShadow: "0 10px 25px rgba(0,0,0,0.2)" }}>
                
                <h2 style={{ marginTop: 0, color: "#2f9d55", marginBottom: 20, borderBottom: "1px solid #eee", paddingBottom: 10 }}>
                    {activeTab === "productos" ? (editingProdId ? "✏️ Editar Producto" : "🌱 Nuevo Producto") : "👤 Nuevo Usuario"}
                </h2>
                
                {activeTab === "productos" ? (
                    // === FORMULARIO PRODUCTO ===
                    <form onSubmit={handleSaveProd} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                        <div>
                            <label style={{fontSize: "0.9rem", fontWeight: "bold", color: "#444"}}>Nombre:</label>
                            <input type="text" required style={{width: "100%", padding: 8, border: "1px solid #ccc", borderRadius: 4}} value={formProd.nombre} onChange={e => setFormProd({...formProd, nombre: e.target.value})} />
                        </div>
                        <div>
                            <label style={{fontSize: "0.9rem", fontWeight: "bold", color: "#444"}}>Precio:</label>
                            <input type="number" required min="1" style={{width: "100%", padding: 8, border: "1px solid #ccc", borderRadius: 4}} value={formProd.precio} onChange={e => setFormProd({...formProd, precio: Number(e.target.value)})} />
                        </div>
                        <div>
                            <label style={{fontSize: "0.9rem", fontWeight: "bold", color: "#444"}}>Categoría:</label>
                            <select required style={{width: "100%", padding: 8, border: "1px solid #ccc", borderRadius: 4, backgroundColor: "white"}} value={formProd.categoriaId} onChange={e => setFormProd({...formProd, categoriaId: e.target.value})}>
                                <option value="">Seleccionar...</option>
                                {categorias.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                            </select>
                        </div>
                        <div>
                            <label style={{fontSize: "0.9rem", fontWeight: "bold", color: "#444"}}>URL Imagen:</label>
                            <input type="text" style={{width: "100%", padding: 8, border: "1px solid #ccc", borderRadius: 4}} value={formProd.imageUrl} onChange={e => setFormProd({...formProd, imageUrl: e.target.value})} />
                        </div>
                        
                        <div style={{display:"flex", gap: 10, marginTop: 10}}>
                            <button type="button" onClick={() => setShowModal(false)} style={{flex:1, padding: 10, borderRadius: 6, border: "1px solid #ccc", background: "white", cursor: "pointer"}}>Cancelar</button>
                            <button type="submit" style={{flex:1, padding: 10, borderRadius: 6, border: "none", background: "#2f9d55", color: "white", fontWeight: "bold", cursor: "pointer"}}>Guardar</button>
                        </div>
                    </form>
                ) : (
                    // === FORMULARIO USUARIO ===
                    <form onSubmit={handleCreateUser} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                        <div>
                            <label style={{fontSize: "0.9rem", fontWeight: "bold", color: "#444"}}>Nombre:</label>
                            <input type="text" required style={{width: "100%", padding: 8, border: "1px solid #ccc", borderRadius: 4}} value={formUser.nombre} onChange={e => setFormUser({...formUser, nombre: e.target.value})} />
                        </div>
                        <div>
                            <label style={{fontSize: "0.9rem", fontWeight: "bold", color: "#444"}}>Apellido:</label>
                            <input type="text" required style={{width: "100%", padding: 8, border: "1px solid #ccc", borderRadius: 4}} value={formUser.apellido} onChange={e => setFormUser({...formUser, apellido: e.target.value})} />
                        </div>
                        <div>
                            <label style={{fontSize: "0.9rem", fontWeight: "bold", color: "#444"}}>Email:</label>
                            <input type="email" required style={{width: "100%", padding: 8, border: "1px solid #ccc", borderRadius: 4}} value={formUser.email} onChange={e => setFormUser({...formUser, email: e.target.value})} />
                        </div>
                        <div>
                            <label style={{fontSize: "0.9rem", fontWeight: "bold", color: "#444"}}>Contraseña:</label>
                            <input type="password" required style={{width: "100%", padding: 8, border: "1px solid #ccc", borderRadius: 4}} value={formUser.password} onChange={e => setFormUser({...formUser, password: e.target.value})} />
                        </div>
                        <div>
                            <label style={{fontSize: "0.9rem", fontWeight: "bold", color: "#444"}}>Fecha Nacimiento:</label>
                            <input type="date" required style={{width: "100%", padding: 8, border: "1px solid #ccc", borderRadius: 4}} value={formUser.fechaNacimiento} onChange={e => setFormUser({...formUser, fechaNacimiento: e.target.value})} />
                        </div>
                        <div>
                            <label style={{fontSize: "0.9rem", fontWeight: "bold", color: "#444"}}>Rol:</label>
                            <select style={{width: "100%", padding: 8, border: "1px solid #ccc", borderRadius: 4, backgroundColor: "white"}} value={formUser.role} onChange={e => setFormUser({...formUser, role: e.target.value})}>
                                <option value="USER">Usuario Normal</option>
                                <option value="ADMIN">Administrador</option>
                            </select>
                        </div>

                        <div style={{display:"flex", gap: 10, marginTop: 10}}>
                            <button type="button" onClick={() => setShowModal(false)} style={{flex:1, padding: 10, borderRadius: 6, border: "1px solid #ccc", background: "white", cursor: "pointer"}}>Cancelar</button>
                            <button type="submit" style={{flex:1, padding: 10, borderRadius: 6, border: "none", background: "#2f9d55", color: "white", fontWeight: "bold", cursor: "pointer"}}>Crear Usuario</button>
                        </div>
                    </form>
                )}
            </div>
        </div>
      )}
    </div>
  );
};