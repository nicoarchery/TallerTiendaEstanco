# Proyecto Tienda Online de Licores
## Integrantes

- **Nicolas Jimenez**  
- **Juan Rosero**  
- **Manuel Rojas**  
- **Juan David**  

---

## Departamento CSI: Computación en Internet  

### Tarea: Desarrollo de Tienda Online  

#### **Descripción del Problema**  
Tu equipo ha sido contratado para desarrollar una tienda en línea para una empresa local. La tienda debe tener la funcionalidad básica de:  
- Permitir a los administradores agregar productos.  
- Permitir a los clientes comprar productos.  
- Generar una factura para cada compra realizada por un cliente.  

La gestión de datos debe incluir algún tipo de persistencia, como el manejo de archivos JSON o el uso de un motor de base de datos. Además, es necesario integrar funcionalidades de autenticación (por ejemplo, mediante JWT).  

---

### **Requisitos Funcionales**  

#### **Roles de Usuario**  
1. **Administrador**  
    - Permiso para agregar nuevos productos al inventario de la tienda.  
2. **Cliente**  
    - Navegar por los productos disponibles.  
    - Agregar productos al carrito.  
    - Realizar compras.  

#### **Servicios Prestados**  

- **Administrador**  
  - Iniciar sesión en su cuenta de administrador.  
  - Agregar nuevos productos al inventario especificando:  
     - Nombre del producto.  
     - Descripción.  
     - Precio.  
     - Cantidad disponible.  

- **Cliente**  
  - Registrarse o iniciar sesión en su cuenta de cliente.  
  - Ver la lista de productos disponibles.  
  - Agregar productos al carrito de compras.  
  - Realizar una compra, generando una factura con:  
     - Detalles de los productos comprados.  
     - Cantidad.  
     - Precio total.  
  - Ver el historial de compras anteriores.  

---

### **Arquitectura de la Solución**  
La solución debe usar una arquitectura cliente-servidor:  
- **Servidor**: Exponer servicios REST (usando Express) para satisfacer los requerimientos funcionales.  
- **Cliente**: Consumir el API (usando `fetch`) para presentar los datos de forma agradable al usuario.  

---

### **Tecnologías Utilizadas**  
- **Frontend**: HTML, CSS y JavaScript.  
- **Backend**: Servicios REST con Express.  

---

### **Entrega**  
- Código fuente completo de la aplicación, incluyendo:  
  - Archivos HTML, CSS y JavaScript.  
  - Archivos de configuración necesarios.  
- Instrucciones claras sobre cómo configurar y ejecutar la aplicación en un entorno de desarrollo local.  
