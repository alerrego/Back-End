import {userModel} from '../../../models/user.js'

export default class UserManager{
    constructor(){}
    updatePremium = async(uID) =>{
        const user = await userModel.findOne({_id : uID})
        if(!user){
            return null
        }
        user.role = "premium"
        await userModel.updateOne({_id:uID},user)
        return user
    }
    updateUser = async(uID) =>{
        const user = await userModel.findOne({_id : uID})
        if(!user){
            return null
        }
        user.role = "user"
        await userModel.updateOne({_id:uID},user)
        return user
    }
}