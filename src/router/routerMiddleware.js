import express from "express";
export const routerMiddleware = express.Router();
import {startingWatsapp,apiSendMessage} from "../controller/middleware-whatsapp.js"

routerMiddleware.get("/getqr", startingWatsapp);
routerMiddleware.post("/sendMessage", apiSendMessage);