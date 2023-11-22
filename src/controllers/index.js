import ProductController from "./ProductController.js";
import CartController from "./CartController.js";
import UserController from "./UserController.js";

export const productService = new ProductController();
export const cartService = new CartController();
export const userService = new UserController();