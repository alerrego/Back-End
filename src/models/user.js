import mongoose from "mongoose";

const userCollection = "users"

const userSchema = new mongoose.Schema({
    first_name : String,
    last_name : String,
    email : String,
    phone : {
        type: Number,
        default: 0
    },
    age: Number,
    password : String,
    role: {
        type: String,
        default: "user"
    },
    active: {
        type: Boolean,
        default: false
    },
    cartID: {
        type: mongoose.Schema.Types.ObjectId,
                ref: "carts"
    }
})

export const userModel = mongoose.model(userCollection,userSchema)