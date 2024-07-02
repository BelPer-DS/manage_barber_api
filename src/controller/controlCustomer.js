import {conn} from '../db/connect.js';
import { httpstatus } from "../enums/http-status.js";
import { queryCustomer } from '../db/queryCustomer.js';
import { hashing, encryption, decrypted, randomQrId, compareHash } from './utilities.js';

const createCustomer = async (req,res) => {
    const{name, last_name, alias_name, phone_number, mail, pass} = req.body;
    if(name == null || phone_number == null || pass == null){
        res.status(400).json(httpstatus.S_400_BAD_REQUEST);
    }

    try{
        await conn.beginTransaction();
        const passEncrpypted = await hashing(pass);
        const qrId = await randomQrId();

        const[respInsert] = await conn.query(queryCustomer.CREATED_CUSTOMER,
            [name, last_name, alias_name, phone_number, mail, passEncrpypted]);
        
        const encrypt = await encryption(phone_number);
        
        let resp = {
            customer_id : respInsert.insertId,
            code : encrypt
        };
        conn.commit();
        res.status(201).json(resp);
    }catch(er){
        conn.rollback();            
        console.log("Error in create: ",er.sqlMessage);
        if(er.code == 'ER_DUP_ENTRY'){
            res.status(409).json(httpstatus.S_409_CONFLICT_EXIST);
        }else{
            res.status(500).json(httpstatus.S_500_ERROR);
        }
        
    }   
}

const getCustomerByCode = async (req, res) => {
    const code = req.params.code;
    if(code == null){
        res.status(400).json(httpstatus.S_400_BAD_REQUEST);
        return;
    }
    const phone_number = await decrypted(code);
    const [[queryResult]] = await conn.query(queryCustomer.FIND_BY_PHONE_NUMBER, 
        [phone_number]);
    console.log("QueryResult: ",queryResult);
    if(queryResult == null){
        res.status(404).json(httpstatus.S_404_NO_RESULT);
        return;
    }

    res.status(201).json(queryResult);
}

const loginCustomer = async (req, res) => {
    const {user, code} = req.body;
    try{        
        if(user != null && code != null){
            const [[access]] = await conn.query(queryCustomer.FIND_ACCESS_CODE,[user]);
            console.log("Access: ", access);
            if(access == null){
                res.status(401).json(httpstatus.S_401_UNAUTHORIZED);
                return;
            }
            const match = await compareHash(code, access.access_code);
            if(access!=null && match){
                const [[customer]] = await conn.query(queryCustomer.FIND_BY_ID,[access.id_customer]);
                console.log("Customer", customer );
                res.status(200).json(customer);
            }else{
                res.status(401).json(httpstatus.S_401_UNAUTHORIZED);
                return;
            }
        } else {
            res.status(400).json(httpstatus.S_400_BAD_REQUEST);
            return;
        }
    } catch(er) {
        console.log(er);
        res.status(500).json(httpstatus.S_500_ERROR);        
    }
    
}

export {createCustomer, getCustomerByCode, loginCustomer}