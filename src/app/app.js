import express from "express";
import {routerManagement} from '../router/routerManagement.js';
import {routerCustomer} from '../router/routerCustomer.js';
import { routerCompany } from "../router/routerCompany.js";
import morgan from 'morgan';
import { routerReservation } from "../router/routerReservation.js";
import { configDotenv } from "dotenv";
import { routerMiddleware } from "../router/routerMiddleware.js";
import cors from "cors"
//import qrcode from "qrcode-terminal";

configDotenv();

const app = express();
const port = process.env.PORT || 3000;
const URI = "/api/barbershop/v1";

app.use(morgan("dev"));
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.get('/',(req, res) => {
    res.send('Welcome')
});

//Router by Managment
app.use(URI + '/management', routerManagement);

//Router by Customer
app.use(URI + '/customer', routerCustomer);

//Router by Customer
app.use(URI + '/company', routerCompany);

//Router by Reservation
app.use(URI + '/reservation', routerReservation);

app.use(URI + '/middleware', routerMiddleware);

app.use(cors());

app.listen(port, () => {
    console.log(`===========> Server running on port ${port}`);
})

//sendMessage('525512300361','Hola esto es una prueba exitosa...');
