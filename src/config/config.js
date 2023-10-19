import { Command } from "commander";
import dotenv from "dotenv";

const program = new Command();

program
    .option ('--mode <modo>',"environment variable","stage")
program.parse()

const enviroment = program.opts().mode;

dotenv.config({
    path: enviroment === "production" ? "./.env.prod" : "./.env.dev"
});

export default {
    port: process.env.PORT,
    mongoUrl : process.env.MONGO_URL,
    adminName : process.env.ADMIN_NAME,
    adminPassword : process.env.ADMIN_PASSWORD

}

