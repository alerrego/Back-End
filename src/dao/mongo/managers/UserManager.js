import {userModel} from '../../../models/user.js'
import config from '../../../config/config.js'

export default class UserManager{
    constructor(){}
    getUsers = async() =>{
        const users = await userModel.find()
        if(!users){
            return null
        }
        return users
    }
    getUser = async(uID) =>{
        const user = await userModel.findById(uID)
        if(!user){
            return null
        }
        return user
    }
    updatePremium = async(uID) =>{
        const user = await userModel.findOne({_id : uID})
        if(!user){
            return null
        }
        let verify = this.isVerify(user.documents)
        if(!verify){
            return -1
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
    uploadDocuments = async(uID,files,uploadType) =>{
        const user = await userModel.findOne({_id:uID})
        if(!user){
            return null
        }
        if(user.documents_load == false){
            user.documents_load = true
        }
        const oldFiles = user.documents
        files.map(el =>{
            let newDoc = {
            name: el.filename,
            reference: `/public/${uploadType}/${el.filename}`
            }
            oldFiles.push(newDoc)
        })
        await userModel.updateOne({_id:uID},user)
        return user

    }
    isVerify = (documents) =>{
        let passed = 0
        documents.forEach(element => {
            const name = element.name;
            const nameOutExtension = name.replace(/\.[^/.]+$/, "");
            if((nameOutExtension == "Identification")||(nameOutExtension == "Proof-of-address")||(nameOutExtension == "Proof-of-account-status")){
                passed ++
            }
        });
        if(passed == 3){
            return true
        }
        return false
    }
    deleteUser = async(uID) =>{
        const user = await userModel.findByIdAndDelete(uID)
        if(!user){
            return null
        }
        return user
    }
    deleteInactives = async() =>{
        const users = await userModel.find()

        if(!users){
            return null
        }
        
        const inactives = []
        
        users.forEach(user => {
            const lastConnectionString = user.last_connection
            const lastConnection = new Date(lastConnectionString) //CONVIERTO EL STRING A DATE
            const currentDate = new Date()

            const isInactive = currentDate - lastConnection >= 2*24*60*60*1000 // SI ES MAYOR O IGUAL A 2 DIAS
            
            if(isInactive && config.adminName != user.email){
                inactives.push(user.email)
            }
        })
        for (let index = 0; index < inactives.length; index++) {
            const element = inactives[index];
            await userModel.deleteOne({email:element})
            
        }
        return inactives
    }
}