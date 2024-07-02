import {conn} from '../db/connect.js';
import {status} from '../enums/status-enum.js';
import {httpstatus} from '../enums/http-status.js';
import {queryManagment} from '../db/queryManagment.js';
import { randomNumberCode, hashing, compareHash } from './utilities.js';

const createManagment = async (req, resp) => { 
    const {name, last_name, role, phone_number, mail, pass} = req.body;

    if(name != null && role != null){
        await conn.beginTransaction();
        try{            
            //Genera accountId aleatorio
            const accountId = await getNewAccountId(name);
            //Inserta empleado en BD
            const [responseInsertEmployee] = await conn.query(queryManagment.CREATED_EMPLOYEE,
                [name,accountId,last_name,role,phone_number,mail,status.ACIVE]);
            
            //Prepara datos de acceso((login)) a insertar            
            const passEncrpypted = await hashing(pass);
            //Inserta datos de acceso -LOGIN-        
            const [rows,fields] = await conn.query(queryManagment.CREATED_ACCESS,
                [responseInsertEmployee.insertId,passEncrpypted,null,status.ACIVE]);            
            
            let response = httpstatus.S_201_CREATE;
            console.log(response);
            response.user_id = accountId;
            await conn.commit();
            resp.status(201).json(response);
        }catch(err){
            await conn.rollback();            
            console.log("Error in create: ",err);
            resp.status(500).json(httpstatus.S_500_ERROR);
        }
    }
}

const loginManagment = async (req,res) => {
    const {user, pass} = req.body;
    const [[access]] = await conn.query(queryManagment.FIND_ACCESS_CODE,[user]);

    if(access != null && pass != null){
        const match = await compareHash(pass, access.access_code);
        if(match){
            const [[employee]] = await conn.query(queryManagment.FIND_BY_ACCOUNT_ID,[user]);
            res.status(200).json(employee);            
            await conn.commit();
        } else {
            await conn.rollback();
            res.status(401).json(httpstatus.S_401_UNAUTHORIZED);
        }
    } else {
        await conn.rollback();          
        res.status(401).json(httpstatus.S_401_UNAUTHORIZED);
    }   
};

const getListManagment = async (req,res) => {
    const [rows, f] = await conn.query(queryManagment.FIND_EMPLOYEES);
    res.status(200).json(rows);
    console.log("List employees: ", rows);
}

async function findManagmentByAccountId(codeId) {
    const [[rows],fields] = await conn.query(queryManagment.FIND_BY_ACCOUNT_ID,[codeId]);
    return rows;
}

async function getNewAccountId(name){    
    do{        
        let randomCode = name.slice(0,1) + name.slice(-1) + randomNumberCode(4);
        const data = await findManagmentByAccountId(randomCode);
        console.log("Data: ", data);
        
        if(data == undefined){
            return randomCode;
        }                
    }while(true);
}

export {createManagment, loginManagment, getListManagment}