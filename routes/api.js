const express = require('express');
const AuthController = require('../controllers/AuthController');
const UserController = require('../controllers/UserController');
const AdminController = require('../controllers/AdminController');
const PaymentController = require('../controllers/PaymentController');
const ProductController = require('../controllers/ProductController');

const router = express.Router();

// Auth Routes
router.post("/auth/register", AuthController.register);
router.post("/auth/login", AuthController.login);

// User Routes
router.get("/user/profile", UserController.userProfile);
router.put("/user/updateProfile", UserController.updateUserProfile);

// Product Routes
router.get("/productList", ProductController.productList);
router.get("/product/:id", ProductController.productDetails);
router.post("/products/cart-items", ProductController.cartItems);

// Admin Routes

// Admin Auth
router.post("/admin/login", AdminController.login);
// router.delete("/admin/removeAdmin", AdminController.removeAdmin);

// Admin Category
router.get("/admin/categoryList", AdminController.categoryList);
router.post("/admin/addCategory", AdminController.addCategory);
router.put("/admin/updateCategory/:id", AdminController.updateCategory);
router.delete("/admin/removeCategory", AdminController.removeCategory);

// Admin Products
router.get("/admin/productList", AdminController.productList);
router.post("/admin/addProduct", AdminController.addProduct);
router.put("/admin/productUpdate/:id", AdminController.productUpdate);
router.delete("/admin/removeProduct/:id", AdminController.removeProduct);


// Super Admin
router.get("/superadmin/adminLists", AdminController.adminLists);
router.post("/superadmin/addAdmin", AdminController.addAdmin);
router.delete("/superadmin/removeAdmin", AdminController.removeAdmin);

router.post("/payment", PaymentController.payment);

module.exports = router;
