import mongoose from "mongoose";

const userCollection = "users"

const userSchema = new mongoose.Schema({
    first_name : String,
    last_name : String,
    email : String,
    age: Number,
    password : String,
    role: {
        type: String,
        default: "user"
    },
    cartID: {
        type: mongoose.Schema.Types.ObjectId,
                ref: "carts"
    }
})

export const userModel = mongoose.model(userCollection,userSchema)