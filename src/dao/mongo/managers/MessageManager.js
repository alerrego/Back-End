import {messageModel}  from "../../../models/message.js";

export default class MessageManager{
    constructor(){}

    async getMessages() {
        return await messageModel.find()
    }

    async createMessage(message) {
        return await messageModel.create(message);
    }
}