const AdminUserModel = require("../models/AdminUserModel");
const CategoryModel = require("../models/CategoryModel");
const ProductModel = require("../models/ProductModel");
const apiResponse = require("../helpers/apiResponse");
const authenticateJWT = require("../middlewares/jwt");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const md5 = require("md5");


/**
 * Add Admin.
 *
 * @param {string}      full_name
 * @param {string}      email
 * @param {string}      password
 * @param {string}      role
 *
 * @returns {Object}
 */
exports.addAdmin = [
    (req, res) => {
        try {
            const { full_name, email, password, role } = req.body;
            AdminUserModel.findOne({ email }).then(user_found => {
                console.log("user_found: ", user_found);
                if(user_found) {
                    return apiResponse.validationErrorResponse(res, "email already exists.");
                }
                let newUser = {
                    full_name,
                    email,
                    password: md5(password),
                    role
                }
                console.log("new user : ", newUser);
                AdminUserModel.create(newUser).then((err, addedUser) => {
                    if(!err) {
                        console.log("added success");
                        // let newAdmin = new AdminUserModel(addedUser);
                        return apiResponse.successResponseWithData(res, "New Admin has been Added Successfully.", { list: addedUser });
                    }
                }).catch(error => {
                    console.log("error: ", error);
                    return apiResponse.ErrorResponse(res, error);
                });
            }).catch(err => {
                console.log("error: ", err);
                return apiResponse.ErrorResponseWithData(res, "Insert Error.", err);
            });
        } catch (error) {
            console.log("error: ", error);
            return apiResponse.ErrorResponseWithData(res, "Internal Server Error.", error);
        }
    }
];


/**
 * Remove Admin
 * 
 * Only SuperAdmin can remove admin
 * 
 * @returns {Object}
 */
exports.removeAdmin = [
    (req, res) => {
        try {
            const { superId } = req.params;
            const { adminId } = req.body;
            // fist find admin
            AdminUserModel.findOne({ _id: superId }).then(superAdmin_found => {
                if(superAdmin_found === null) {
                    return apiResponse.notFoundResponse(res, "Super Admin Not Found.");
                } else {
                    // super admin can remove other admins.  check if user is super admin.
                    if(superAdmin_found.role === "superadmin") {
                        // find requested admin
                        AdminUserModel.findOneAndDeleted({ _id: adminId }, { new: true }).then((err, removedAdmin) => {
                            if(err) {
                                console.log("DB Error: ", err);
                            } else {
                                return apiResponse.successResponseWithData(res, "Admin Removed Successfully.", { list: removedAdmin });
                            }
                        })
                    } else {
                        // only super admin have acecess to remove other admins.
                        return apiResponse.unauthorizedResponse(res, "Only Super Admin can remove other admins.");
                    }
                }
            })
        } catch (error) {
            console.log("server error: "), error;
        }
    }
];


/**
 * Admin List
 * 
 * Only Super Admin can see Admin Lists.
 * 
 * @returns {Object}
 */
exports.adminLists = [
    (req, res) => {
        try {
            AdminUserModel.find({}).then(found_admins => {
                if(found_admins !== null) {
                    return apiResponse.successResponseWithData(res, "Operation Success.", { list: found_admins });
                } else {
                    return apiResponse.successResponseWithData(res, "No Admins Found.", { list: [] });
                }
            }).catch(err => {
                console.log("error: ", err);
                return apiResponse.ErrorResponse(res, err);
            });
        } catch (error) {
            console.log("server error: ", error);
            return apiResponse.ErrorResponse(res, error);
        }
    }
];



/**
 * User login.
 *
 * @param {string}      email
 * @param {string}      password
 *
 * @returns {Object}
 */
exports.login = [
    (req, res) => {
        try {
            const { email, password } = req.body;
            AdminUserModel.findOne({ email, password: md5(password) }).then(user_found => {
                if(user_found) {
                    let user = {
                        _id: user_found._id,
                        email: user_found.email,
                        password: user_found.password,
                        role: user_found.role
                    };
                    // prepare JWT token for authentication
                    // const jwtPayload = user;
                    // const jwtData = {
                    //     expiresIn: process.env.JWT_TIMEOUT_DURATION || Date.now() + (1000 * 60 * 60 * 24)
                    // };
                    // const secret = process.env.JWT_SECRET;
                    // user.token = jwt.sign(jwtPayload, secret, jwtData);
                    return apiResponse.successResponseWithData(res, "Login Success.", { list: user });
                }
            }).catch(err => {
                console.log("db : ", err);
                return apiResponse.ErrorResponse(res, err);
            });
        } catch (error) {
            console.log("server : ", error);
            return apiResponse.ErrorResponse(res, error);
        }
    }
];


/**
 * Admin Panel Product List.
 * 
 * @returns {Object}
 */
exports.productList = [
    // authenticateJWT,
    (req, res) => {
        try {
            ProductModel.find({}).then(product_found => {
                if(!product_found) {
                    return apiResponse.notFoundResponse(res, "No Products Found.");
                }
                return apiResponse.successResponseWithData(res, "Operation Success.", { list: product_found });
            });
        } catch (error) {
            return apiResponse.ErrorResponse(res, error);
        }
    }
];

/**
 * Admin Add Product.
 * 
 * @param {string}      title 
 * @param {string}      description
 * @param {string}      isbn
 * 
 * @returns {Object}
 */
exports.addProduct = [
    // authenticateJWT,
    (req, res) => {
        try {
            const { name, images, price, description, category_id, sku, stock, country, country_image } = req.body;
            // check if data empty or not?
            if(name === "" || price === "" || description === "" || sku === "") {
                return apiResponse.validationErrorResponse(res, "Please Provide All Required Fields.");
            }

            // create product Object and save.
            const product = new ProductModel({
                name,
                description,
                images: images ? images : [],
                category_id: new mongoose.Types.ObjectId(category_id),
                price,
                sku,
                stock,
                country: country ? country : "India"
            });

            product.save().then(err => {
                if(!err) {
                    return apiResponse.ErrorResponse(res, err);
                }
                return apiResponse.successResponseWithData(res, "Product Add Success.", { list: product });
            });
        } catch (error) {
            console.log("error: ", error);
            return apiResponse.ErrorResponse(res, error);
        }
    }
];


/**
 * Admin Update Product
 * @param {String}  name
 * @param {String} price
 * @param {String} stock
 * @param {String} description
 * @param {String} sku
 */
exports.productUpdate = [
    // authenticateJWT,
    (req, res) => {
        try {
            const { id } = req.params;
            if(id === "") {
                return apiResponse.validationErrorResponse(res, "Please Provide All Details.");
            } else{
                const { name, price, stock, description, sku } = req.body;
                ProductModel.findOne({ _id: id }).then(product_found => {
                    if(product_found === null) {
                        return apiResponse.notFoundResponse(res, "Product Not Found.");
                    }
                    // create product object to update
                    ProductModel.findByIdAndUpdate({ _id: req.params.id }, {
                        $set: {
                            "name": name ? name : product_found.name,
                            "price": price ? price : product_found.price,
                            "stock": stock ? stock : product_found.stock,
                            "description": description ? description : product_found.description,
                            "sku": sku ? sku : product_found.sku
                        }
                    }, { new: true }, (err, updatedProduct) => {
                        if(err) {
                            console.log("db error: ", err);
                            return apiResponse.ErrorResponse(res, err);
                        } else {
                            return apiResponse.successResponseWithData(res, "Product Updated Success.", { list: updatedProduct });
                        }
                    });
    
                }).catch(err => {
                    console.log("db error: ", err);
                    return apiResponse.ErrorResponse(res, err);
                });
            }
        } catch (error) {
            console.log("server error: ", error);
            return apiResponse.ErrorResponse(res, error);
        }
    }
];


/**
 * Admin Remove Product
 * 
 * Admin Can Remove Product from store
 * 
 * @param {String}  id
 * 
 * @returns {Object}
 */
exports.removeProduct = [
    // authenticateJWT,
    (req, res) => {
        try {
            const { id } = req.params;
            if(id !== "") {
                ProductModel.findByIdAndDelete(id, (err, deletedProduct) => {
                    if(err) {
                        return apiResponse.ErrorResponse(res, err);
                    } else {
                        return apiResponse.successResponseWithData(res, "Product has been deleted successfully.", { list: deletedProduct });
                    }
                }).catch(error => {
                    console.log("error: ", error);
                    return apiResponse.ErrorResponse(res, error);
                });
            } else {
                return apiResponse.validationErrorResponse(res, "Please Provide All Details.");
            }
        } catch (error) {
            console.log("server Error: ", error);
            return apiResponse.ErrorResponse(res, error);
        }
    }
];



/**
 * Admin Add Cateory
 * 
 *      Admin can add Category of products.
 * 
 * @param {string}  name
 * 
 * @returns {Object}
 */
exports.addCategory = [
    // authenticateJWT,
    (req, res) => {
        try {
            // check if body or body data get undefined or null
            if(req.body.name == null || req.body.name == undefined || req.body.name === "") {
                return apiResponse.validationErrorResponse(res, "Please Provide all details.");
            }
            CategoryModel.findOne({ name: req.body.name }).then(category_found => {
                // check if category exists or not?
                if(!category_found) {
                    // save category
                    const category = new CategoryModel({
                        name: req.body.name
                    });
                    category.save().then((err, savedCategory) => {
                        console.log("error: ", err);
                        // if not error send success response
                        if(err!= null || err!=undefined) {
                            return apiResponse.successResponseWithData(res, "Category Added Successfully.", { list: savedCategory });
                        }
                    }).catch(err => {
                        console.log("save error : ", err);
                        return apiResponse.ErrorResponse(res, err);
                    });
                } else {
                    return apiResponse.validationErrorResponse(res, "Category Already exists with name.");
                }
            }).catch(error => {
                // db error
                return apiResponse.ErrorResponse(res, error);
            });
        } catch (error) {
            // server error
            return apiResponse.ErrorResponseWithData(res, "Internal Server Error.", error);
        }
    }
];


/**
 * Admin Category List.
 * 
 * This will Display all the Category found in Company Id.left
 * 
 * @returns {Object}
 */
exports.categoryList = [
    // authenticateJWT,
    (req, res) => {
        try {
            CategoryModel.find({}).then(category_found => {
                if(category_found.length > 0) {
                    return apiResponse.successResponseWithData(res, "Operation Success.", { list: category_found });
                }
                return apiResponse.successResponseWithData(res, "No Category available.", { list: []}); 
            }).catch(error => {
                return apiResponse.ErrorResponse(res, error);
            })
        } catch (error) {
            return apiResponse.ErrorResponse(res, error);
        }
    }
];

/**
 * Admin Remove Category
 * 
 * This will Remove Category if there's no products linked with given category.
 * @param {String}  name 
 * 
 * @returns {Object}
 */
exports.removeCategory = [
    // authenticateJWT,
    (req, res) => {
        try {
            // check if category exists or not?
            CategoryModel.findOne({ name: req.body.name }).then(category_found => {
                console.log(category_found);
                if(category_found != null) {
                    // check if product found with category
                    ProductModel.find({ category_id: category_found._id}).then(product_found => {
                        console.log(product_found);
                        if(product_found.length > 0) {
                            // can not delete if product found
                            return apiResponse.validationErrorResponse(res, "You Can not delete a Category that have products.");
                        }
                        CategoryModel.deleteOne({ name: req.body.name }).then(doc => {
                            if(doc.n > 0) {
                                return apiResponse.successResponse(res, "Category deleted successfully.");
                            } else {
                                return apiResponse.ErrorResponse(res, "Something Went Wrong!");
                            }
                        });
                    });
                } else {
                    // no category found
                    return apiResponse.notFoundResponse(res, "No Category Found.");
                }
            }).catch(error => {
                return apiResponse.ErrorResponse(res, error);
            });
        } catch (error) {
            return apiResponse.ErrorResponse(res, error);
        }
    }
];


/**
 * Admin Update Category
 * 
 * @param {String}  name
 * 
 * @returns {Object}
 */
exports.updateCategory = [
    // authenticateJWT,
    (req, res) => {
        try {
            const { name } = req.body;
            const { id } = req.params;
            CategoryModel.findOneAndUpdate({ _id: id }, {
                $set: {
                    "name": name
                }
            }, { new: true }, (err, updatedCategory) => {
                if(err) {
                    console.log("updated error: ", err);
                    return apiResponse.ErrorResponse(res, err);
                } else {
                    return apiResponse.successResponseWithData(res, "Category Updated Successfully.", { list: updatedCategory})
                }
            }).catch(error => {
                console.log("DB error: ", error);
                return apiResponse.ErrorResponse(res, error);
            });
        } catch (error) {
            console.log("server error: ", error);
            return apiResponse.ErrorResponse(res, error);
        }
    }
];