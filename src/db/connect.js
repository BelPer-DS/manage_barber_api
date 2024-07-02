import { createConnection } from "mysql2/promise";

export const conn = await createConnection({
    user : 'USBARBER',
    password : 'Us*B4rb3rM4',
    host : 'localhost',
    port : 3306,
    database : 'barbershop_db'
});