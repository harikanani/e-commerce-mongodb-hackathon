const UserModel = require("../models/UserModel");
const apiResponse = require("../helpers/apiResponse");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


/**
 * User registration.
 *
 * @param {string}      name
 * @param {string}      email
 * @param {string}      password
 * @param {string}      role
 *
 * @returns {Object}
 */
exports.register = [
    (req, res) => {
        try {
            const { full_name, email, password, role } = req.body
            if(!full_name || !email || !password) {
                return apiResponse.validationErrorResponse(res, "please provide all data.")
            }
            UserModel.findOne({ email }).then(async (user_found) => {
                if(user_found != null || user_found != undefined) {
                    return apiResponse.validationErrorResponse(res, "email already registered.")
                }

                // HASH PASSWORD
                const hash = await bcrypt.hash(password, 10)
                
                // create User
                const user = new UserModel({
                    full_name,
                    email,
                    password: hash,
                    role: role ? role : "customer"
                })

                user.save().then((user) => {
                    // register complete
                    if(!user) {
                        return apiResponse.ErrorResponse(res, "Internal Server Error.");
                    }
                    console.log("register sucess");
                    return apiResponse.successResponseWithData(res, "Registration Success.", user);
                }).catch(err => {
                    console.log(" db catch error: ", err);
                    return apiResponse.ErrorResponseWithData(res, "User Registration Error.", err)
                })

            }).catch(err => {
                console.log("find error: ",err);
                return apiResponse.ErrorResponse(res, err)
            })
        } catch (err) {
            console.log("server error: ", err);
            //throw error in json response with status 500.
            return apiResponse.ErrorResponse(res, err)
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
        const { email, password } = req.body;
        // check if data empty or not
        if(!email || !password) {
            return apiResponse.validationErrorResponse(res, "Please Provide all Required Fields!");
        }
        try {
            UserModel.findOne({ email}).then(user_found => {
                if(user_found != null) {
                    // check if active and check password with hash
                    if(user_found.is_active === true) {
                        bcrypt.compare(password, user_found.password, (err, resp) => {
                            if(err) {
                                console.log("bcrypt  : ", err);
                                return apiResponse.ErrorResponse(res, err);
                            } 
                            if(!resp) {
                                console.log("pass missmatch : ", resp);
                                return apiResponse.unauthorizedResponse(res, "invalid password");
                            }
                            // generate token
                            let userData = {
                                _id: user_found._id,
                                email: user_found.email,
                                full_name: user_found.full_name
                            }
                            // const jwtPayload = userData;
                            // const jwtData = {
                            //     expiresIn: process.env.JWT_TIMEOUT_DURATION || Date.now() + (1000 * 60 * 60 * 24)
                            // }
                            // const secret = process.env.JWT_SECRET;
                            // userData.token = jwt.sign(jwtPayload, secret, jwtData);
                            return apiResponse.successResponseWithData(res, "Login Success.", userData);
                        });
                    } else {
                        return apiResponse.unauthorizedResponse(res, "User is not active.");
                    }
                } else {
                    return apiResponse.notFoundResponse(res, "User Not Found.");
                }
            }).catch(error => {
                console.log("db error: ", error);
                return apiResponse.ErrorResponse(res, error);
            });
        } catch (error) {
            console.log("server error : ", error);
            return apiResponse.ErrorResponse(res, error);
        }
    }
];