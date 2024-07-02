import express from "express";
export const routerManagement = express.Router();
import { createManagment, loginManagment, getListManagment } from "../controller/controlManagment.js";

routerManagement.get("/ping", (req,res) => {
    res.send("I am express router Employee");
});

routerManagement.post("/create", createManagment);
routerManagement.post("/login", loginManagment);
routerManagement.get("/getList",getListManagment);