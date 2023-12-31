# Ecommerce BACKEND

Una aplicación simple con objetivo de recrear el uso completo de una aplicación ecommerce

## Requisitos Previos

Antes de comenzar con la instalación, asegúrate de tener instalados los siguientes requisitos:

- **Node.js y npm:** Asegúrate de tener Node.js instalado en tu máquina

- **Base de Datos MONGODB:** El proyecto utiliza una base de datos MONGODB para almacenar las tareas.

- **Git:** Se recomienda tener Git instalado para clonar el repositorio.

## Instalación

Sigue estos pasos para instalar y configurar el proyecto en tu entorno local:

1. **Clona el repositorio:**
   ```bash
   git clone https://github.com/tu-usuario/tu-proyecto.git
   cd tu-proyecto
2. **Inicia el repositorio:**
    npm install

## Endpoints API

A continuación se presentan los endpoints disponibles en la API:

### PRODUCTOS

--GET api/products  obtiene todos los productos

--GET api/products/:pID obtiene un producto especifico (pID parámetro de ID del producto)

--GET api/products/mock/mockingproducts obtiene un mock de productos

--POST api/products crea un producto recibido por body (se necesitan permisos de usuario premium o admin para crearlo)

--POST api/products/many crea una serie de productos recibidos por body en forma de array (necesita permisos de premium o admin)

--PUT api/products/:pID modifica un producto ya existente (pID parámetro de ID del producto), se puede modificar desde una propiedad hasta el objeto completo, (necesita permisos de usuario premium o admin para modificar)

--DELETE api/products/:pID elimina un producto ya existente (pID parámetro de ID del producto), un usuario premium solo puede eliminar sus productos, en cambio el admin puede eliminar cualquier elemento deseado

#### CARTS

--GET api/carts obtiene todos los carritos, (se necesitan permisos de admin)

--GET api/carts/:cID obtiene un carrito en especifico por ID (cID parámetro de ID del carrito)

--POST api/carts crea un nuevo carrito

--POST api/carts/:cID/purchase finaliza la compra de los productos contenidos dentro del carrito, (cID parámetro de ID del carrito), se necesita permisos de user o premium

--PUT api/carts/:cID/product/:pID agrega un producto al carrito, (cID parámetro de ID de carrito) (pID parámetro de ID de producto) se necesitan permisos de user o premium

--DELETE api/carts/:cID elimina un carrito (cID parámetro de ID del carrito) se necesita permiso de admin

--DELETE api/carts/:cID/product/:pID elimina un producto del carrito (cID parámetro de ID de carrito) (pID parámetro de ID de producto), se necesitan permisos de usuario o premium

### USERS

--GET api/users obtiene todos los usuarios, se necesitan permisos de admin

--GET api/users/:uID obtiene un usuario (uID parámetro de ID del usuario) se necesitan permisos de admin

--POST api/users/premium/:uID cambia el rol de un usuario de user a premium (uID parámetro de ID del usuario), el usario a convertir necesita estar verificado, se necesitan permisos de admin

--POST api/users/user/:uID cambia el rol de premium a user (uID parámetro de ID del usuario),se necesitan permisos de admin

--POST api/users/:uID/documents sube archivos de usuario por ID, (uID parámetro de ID del usuario), los documentos se reciben en forma de body y son guardados dentro del usuario en la BD, también se recibe por query params el tipo de archivo que subirá el usuario, se necesitan permisos de user o premium

--DELETE api/users/:uID elimina a un usuario por ID, (uID parámetro de ID del usuario), se necesitan permisos de admin

--DELETE api/users elimina los usuarios inactivos hace 48 o mas horas, se necesitan permisos de admin




