const UserModel = require("../models/UserModel");
const apiResponse = require("../helpers/apiResponse");
const authenticateJWT = require("../middlewares/jwt");
const bcrypt = require("bcryptjs");



/**
 * Register User
 * 
 * @param {String}  full_name
 * @param {String}  email
 * @param {String}  password
 * @param {String}  address
 */
// exports.register = [
//     (req, res) => {
//         try {
//             const { full_name, email, password } = req.body;
//             // check if data is not empty before adding it to database
//             if(full_name === "" || email === "" || password === "") {
//                 return apiResponse.validationErrorResponse(res, "Please Provide Valid data.");
//             }
//             // generate hash of password and store to database
//             bcrypt.hash(password, 10).then(hash => {
//                 // create object of user to save user
//                 const user = new UserModel({
//                     full_name,
//                     email,
//                     password: hash
//                 });
//                 // save user
//                 user.save().then(doc => {
//                     console.log("doc : ", doc);
//                 });
//             }).catch(error => {
//                 console.log("password hash error: ", error);
//                 return apiResponse.ErrorResponse(res, "Password Hash Error.");
//             });
//         } catch (error) {
//             console.log("server error: ", error);
//             return apiResponse.ErrorResponse(res, error);
//         }
//     }
// ];


/**
 * User Profile.
 * 
 * @param {string} _id
 * 
 * @returns {Object}
 */
exports.userProfile = [
    authenticateJWT,
    (req, res) => {
        try {
            UserModel.findOne({ _id: req.userData._id }).then((user_found) => {
                if(user_found != null) {
                    const sendJson = {
                        email: user_found.email ? user_found.email : "",
                        full_name: user_found.full_name ? user_found.full_name : "",
                        profile_pic: user_found.profile_pic ? user_found.profile_pic : "",
                        joined_date: user_found.createdAt,
                    }
                    return apiResponse.successResponseWithData(res, "Operation Success.", sendJson);
                } else {
                    return apiResponse.notFoundResponse(res, "User Not Found!");
                }
            })
        } catch (error) {
            console.log("server error: ", error);
            return apiResponse.ErrorResponse(res, error)
        }
    }
];


/**
 * Update User Detail.
 * 
 * @param {string} email
 * @param {string} full_name
 * @param {string} profile_pic
 * 
 * @returns {Object}
 */
exports.updateUserProfile = [
    authenticateJWT,
    (req, res) => {
        try {
            // check if body empty or not
            const bodyData = req.body;
            const userData = req.userData;

            console.log(bodyData);
    
            // update user profile
            UserModel.findOne({ _id: userData._id }).then(user_found => {
                // const user = {
                //     "$set": {
                //         "email": bodyData.email ? bodyData.email : user_found.email,
                //         "profile_pic": bodyData.profile_pic ? bodyData.profile_pic : user_found.profile_pic,
                //         "full_name": bodyData.full_name ? bodyData.profile_pic : user_found.profile_pic,
                //     }
                // }
                UserModel.findOneAndUpdate({ _id: userData._id }, {
                    $set: {
                        "email": bodyData.email ? bodyData.email : user_found.email,
                        "full_name": bodyData.full_name ? bodyData.profile_pic : user_found.profile_pic,
                        "profile_pic": bodyData.profile_pic ? bodyData.profile_pic : user_found.profile_pic
                    }
                }, { new: true }, (err, updatedUser) => {
                    if(err) {
                        console.log("db error: ", err);
                        return apiResponse.ErrorResponse(res, err);
                    } else {
                        return apiResponse.successResponse(res, "Profile updated Success.", { list: updatedUser });
                    }
                })
            }).catch(err => {
                return apiResponse.ErrorResponse(res, err);
            });
        } catch(error) {
            console.log("server error: ", error);
            return apiResponse.ErrorResponse(res, error);
        }
    }
];