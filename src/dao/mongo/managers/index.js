import ProductManager from "./ProductManager.js";
import CartManager from "./CartManager.js";
import UserManager from "./UserManager.js";

export const ManejadorDeProductos = new ProductManager();
export const ManejadorDeCarritos = new CartManager();
export const ManejadorDeUsuarios = new UserManager();