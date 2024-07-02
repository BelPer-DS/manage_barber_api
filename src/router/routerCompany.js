import express from "express";
export const routerCompany = express.Router();
import { createCompany, createSubsidiary, getListSubsidiariesByOwner} from "../controller/controlCompany.js";

routerCompany.post("/createCompany", createCompany);
routerCompany.post("/createSubsidiary",createSubsidiary);
routerCompany.get("/getListSubsidiariesByOwner/:owner",getListSubsidiariesByOwner);