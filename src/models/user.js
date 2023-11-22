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
        default: "user",
        enum: ["user","admin","premium"]
    },
    active: {
        type: Boolean,
        default: false
    },
    cartID: {
        type: mongoose.Schema.Types.ObjectId,
                ref: "carts"
    },
    tokenPassword: {
        type: String,
        default:null
    },
    expirationTokenTime: {
        type:Number,
        default:null
    }
})

export const userModel = mongoose.model(userCollection,userSchema)