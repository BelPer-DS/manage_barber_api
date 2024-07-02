import express from "express";
export const routerCustomer = express.Router();
import {createCustomer, getCustomerByCode, loginCustomer} from "../controller/controlCustomer.js"

routerCustomer.post("/createCustomer", createCustomer);

routerCustomer.get("/getCustomer/:code",getCustomerByCode);

routerCustomer.post("/login", loginCustomer);