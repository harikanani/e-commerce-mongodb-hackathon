const SUCCESS = 200
const SERVER = 500
const NOT_FOUND = 404
const UN_AUTH = 401
const VALIDATION = 422
exports.successResponse = (res, msg) => {
    const data = {
        status: 1,
        message: msg
    }
    return res.status(SUCCESS).json(data)
}   

exports.successResponseWithData = (res, msg, data) => {
    const resData = {
        status: 1,
        message: msg,
        data: data
    }
    return res.status(SUCCESS).json(resData)
}

exports.ErrorResponse = (res, msg) => {
    const data = {
        status: 0,
        message: msg
    }
    return res.status(SERVER).json(data)
}

exports.ErrorResponseWithData = (res, msg, data) => {
    const resData = {
        status: 0,
        message: msg,
        data: data
    }
    return res.status(SERVER).json(resData)
}

exports.notFoundResponse = (res, msg) => {
    const data = {
        status: 0,
        message: msg
    }
    return res.status(NOT_FOUND).json(data)
}

exports.unauthorizedResponse = (res, msg) => {
    const data = {
        status: 0,
        message: msg
    }
    return res.status(UN_AUTH).json(data)
}

exports.validationErrorResponse = (res, msg) => {
    const data = {
        status: 0,
        message: msg
    }
    return res.status(VALIDATION).json(data)
}