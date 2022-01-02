const ProductModel = require("../models/ProductModel");
const apiResponse = require("../helpers/apiResponse");
const mongoose = require("mongoose");

/**
 * User Product List
 * 
 * @returns {Object}
 */
exports.productList = [
    (req, res) => {
        try {
            ProductModel.find({}).then(resp => {
                if(resp.length > 0) {
                    apiResponse.successResponseWithData(res, "Operation Success.", { list: resp });
                } else {
                    apiResponse.successResponseWithData(res, "No Products Found.", { list: [] });
                }
            }).catch(err => {
                console.log("error: ", err);
                apiResponse.ErrorResponse(res, err);
            })
        } catch (error) {
            console.log("Error: ", error);
            apiResponse.ErrorResponse(res, error);
        }
    }
];

/**
 * Product Details 
 * 
 * User can see product details
 * @param {id} String
 * 
 * @returns {Object}
 */
exports.productDetails = [
    (req, res) => {
        const productId = req.params.id;
        try {
            ProductModel.findOne({ _id: productId}).then(resp => {
                if(resp !== null || resp !== undefined) {
                    apiResponse.successResponseWithData(res, "Operation Success.", resp)
                } else {
                    apiResponse.notFoundResponse(res, "Requested Product Not Found!!!");
                }
            }).catch(err => {
                console.log("error: ", err);
                apiResponse.ErrorResponse(res, err);
            })
        } catch (error) {
            console.log("Error: ", error);
            apiResponse.ErrorResponse(res, error);
        }
    }
]

/**
 * List of Product that are in Cart
 * @param {ids} Array
 * 
 * @returns {Object}
 */
exports.cartItems = [
    (req, res) => {
        try {
            const { ids } = req.body;
            console.log(ids.map(id => new mongoose.Types.ObjectId(id)));
            ProductModel.find({
                _id: {
                    $in: ids.map(id => new mongoose.Types.ObjectId(id))
                }
            })
            .then(products => {
                if(!products) {
                    res.set('Access-Control-Allow-Origin', '*');
                    apiResponse.notFoundResponse(res, "Products Not Found!!!");
                } else {
                    res.set('Access-Control-Allow-Origin', '*');
                    apiResponse.successResponseWithData(res, "Operation Success.", { list: products })
                }
            })
            .catch(err => {
                res.set('Access-Control-Allow-Origin', '*');
                console.log("error: ", err);
                apiResponse.ErrorResponse(res, err);
            })
        } catch(error) {
            res.set('Access-Control-Allow-Origin', '*');
            console.log("Error: ", error);
            apiResponse.ErrorResponse(res, error);
        }

    }
]