import express from "express";
export const routerCustomer = express.Router();
import {createCustomer, getCustomerByCode, loginCustomer} from "../controller/controlCustomer.js";
import {authenticator} from './middleware.js';

routerCustomer.post("/createCustomer", createCustomer);

routerCustomer.get("/getCustomer/:code",authenticator,getCustomerByCode);

routerCustomer.post("/login", loginCustomer);