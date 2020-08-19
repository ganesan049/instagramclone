const jwt = require("jsonwebtoken")
const {
    Users
} = require("../models/user")

module.exports = (req, res, next) => {
    const {
        authorization
    } = req.headers;
    if (!authorization) {
        return res.status(401).json({
            message: "you must be logged in"
        })
    }
    const token = authorization.replace("Bearer", "")
    jwt.verify(token, process.env.JWT_SECRETKEY, (err, payload) => {
        if (err) {
            console.log(err)
            return res.status(401).json({
                message: "you must be logged in"
            })
        }
        const {
            _id
        } = payload
        Users.findById(_id)
            .then(userData => {
                // console.log(userData,'userdata')
                req.user = userData;
                next()
            })
            .catch(err => {
                console.log(err)
            })
    })
    // next()
}