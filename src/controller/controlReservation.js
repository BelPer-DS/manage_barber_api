import {conn} from '../db/connect.js';
import {status} from '../enums/status-enum.js';
import {httpstatus} from '../enums/http-status.js';
import {queryReservation} from '../db/queryReservation.js';
import { setDatetime, setDate } from './utilities.js';
import * as _ from 'underscore'
const createReservation = async(req, res) => {
    const {id_customer, id_subsidiary, id_employee, date, start_time, end_time, id_service, services} = req.body;
    await conn.beginTransaction();
    try{
        const reservationDate = setDate(date);
        //Validacion de parametros
        if(reservationDate==null){
            res.status(400).json(httpstatus.S_400_BAD_REQUEST);
            return;
        }
        const dateStart = setDatetime(reservationDate, start_time);
        const dateEnd = setDatetime(reservationDate, end_time);
        if(_.isEmpty(id_customer) || _.isEmpty(id_subsidiary) || _.isEmpty(id_employee) 
            || dateStart == null || dateEnd == null || (dateEnd <= dateStart)){
            res.status(400).json(httpstatus.S_400_BAD_REQUEST);
            return;
        }

        const available = await isAvailable(date,start_time,end_time);
        console.log("Available: ", available);
        if(available){
            const [rows] = await conn.query(queryReservation.CREATED_RESERVATION,[date,start_time, end_time, id_customer, id_subsidiary, id_employee]);
            conn.commit();
            res.status(201).json(httpstatus.S_201_CREATE);
        } else {
            conn.rollback();
            res.status(400).json(httpstatus.S_409_CONFLICT_EXIST);
        }

    }catch(er){
        conn.rollback();
        res.status(500).send('Error...');
        console.log("Error: ", er); 
    }
}

const getListReservationBySubsidiary = async (req, res) => {
    const subsidiary = req.query.subsidiary;
    const reservationDate = req.query.date;
    const validationDate = setDate(req.query.date);
    try{
        if(validationDate==null){
            res.status(400).json(httpstatus.S_400_BAD_REQUEST);
            return;
        }
        const [respQuery] = await conn.query(queryReservation.FIND_BY_SUBSIDIARY,[reservationDate,subsidiary]);
        res.status(200).json(respQuery);
    }catch(er){
        res.status(500).send('Error...');
        console.log("Error: ", er); 
    }
} 

async function isAvailable(date, startTime, endTime){
    try{
        const [resultQuery] = await conn.query(queryReservation.VALIDATE_RESERVATION,[date,startTime,endTime,startTime,endTime,startTime,endTime]);
        console.log("Validation_reservation: ",resultQuery.length);
        return (resultQuery.length > 0) ? false : true;
        
    }catch(er){
        console.log("Error in validateAvailability: ", er);
    }
}

export {createReservation, getListReservationBySubsidiary}