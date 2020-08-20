const mongoose = require("mongoose")
const {
    ObjectId
} = mongoose.Schema.Types

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    followers: [{
        type: ObjectId,
        ref: "User"
    }],
    following: [{
        type: ObjectId,
        ref: "User"
    }],
    url: {
        type: String,
    },
    resetToken: String,
    expireToken: Date,
}, {
    timestamps: true,
})

const Users = mongoose.model("Users", userSchema)
module.exports = {
    Users
}