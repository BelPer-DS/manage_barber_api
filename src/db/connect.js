import { createConnection } from "mysql2/promise";
import { configDotenv } from "dotenv";
configDotenv();
export const conn = await createConnection({
    user : process.env.DB_USER,
    password : process.env.DB_ACCESS,
    host : process.env.DB_HOST,
    port : process.env.DB_PORT,
    database : process.env.DB_NAME
});