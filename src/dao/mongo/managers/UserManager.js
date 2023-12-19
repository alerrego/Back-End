import {userModel} from '../../../models/user.js'

export default class UserManager{
    constructor(){}
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
}