import express from "express";
export const routerMiddleware = express.Router();
import {startingWatsapp,sendMessage} from "../controller/middleware-whatsapp.js"

routerMiddleware.get("/getqr", startingWatsapp);
routerMiddleware.post("/sendMessage", sendMessage);