import express from "express";
export const routerReservation = express.Router();
import {createReservation, getListReservationBySubsidiary, getListReservationByCustomer} from "../controller/controlReservation.js";

routerReservation.post("/createReservation", createReservation);
routerReservation.get("/getReservationsBySubsidiary", getListReservationBySubsidiary );
routerReservation.get("/getReservationsByCustomer",getListReservationByCustomer);