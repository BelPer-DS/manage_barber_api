import {queryCompany} from "../db/queryCompany.js";
import {conn} from '../db/connect.js';
import {status} from '../enums/status-enum.js'
import { httpstatus } from "../enums/http-status.js";

//NAME,LAST_NAME,OWNER,STATUS
const createCompany = async (req, res) => {
    const {name, owner} = req.body;
    if(name == null || owner == null){
        res.status(400).json(httpstatus.S_400_BAD_REQUEST);
        return;
    }
    await conn.beginTransaction();
    try{
        const [[respFindBd]] = await conn.query(queryCompany.FIND_ID_EMPLOYEE,[owner]);
        
        if(respFindBd == null){
            console.log("Invalid user");
            res.status(400).send('Invalid user');
            return;
        }
        const idOwner = respFindBd.id_employee;
        const [respCreateDb] = await conn.query(queryCompany.CREATED_COMPANY,
            [name,idOwner,status.ACIVE]);
        
        let jsonResponse = httpstatus.S_201_CREATE;
        jsonResponse.message = {
            message : "Created",
            id_company : respCreateDb.insertId
        }
        console.log(jsonResponse);
        conn.commit();
        res.status(201).json(jsonResponse);
            
    }catch(er){
        conn.rollback();
        console.log("Error in create: ",er.code);
        if(er.code == 'ER_DUP_ENTRY'){
            res.status(409).json(httpstatus.S_409_CONFLICT);
            return;
        }
        res.status(500).json(httpstatus.S_500_ERROR);
    }
} 

const createSubsidiary = async(req,res) => {
    const {name, location, phone_number_1, phone_number_2, phone_number_3, id_company} = req.body;    
    if(name !=null || id_company != null){
        await conn.beginTransaction();
        try{
            const [respCreateDb] = await conn.query(queryCompany.CREATED_SUBSIDIARY,
                [name, location, phone_number_1, phone_number_2, phone_number_3, id_company, status.ACIVE]);           
            conn.commit();
            res.status(201).json(httpstatus.S_201_CREATE);
        }catch(er){
            conn.rollback();
            console.log("Error in create: ",er);
            res.status(500).json(httpstatus.S_500_ERROR);
        }
    }else{
        res.status(400).json(httpstatus.S_400_BAD_REQUEST);
        return
    }
}

const getListSubsidiariesByOwner = async(req,res) => {
    const idOwner = req.params.owner;
    //Validamos parametro idOwner no vacio
    if(idOwner == null){
        res.status(404).json(httpstatus.S_404_NO_RESULT);
        return;
    }
    await conn.beginTransaction();
    let jsonResponse = {};
    try{
        //Buscamos compania por el idOwner
        const [[company]] = await conn.query(queryCompany.FIND_COMPANY_BY_OWNER,[idOwner]);
        if(company == null){
            res.status(404).json(httpstatus.S_404_NO_RESULT);
            return;
        }
        jsonResponse.company = company;
        
        //Se obtiene lista de subsidiarias por la compania encontrada
        const [listSubsidiaries] = await conn.query(queryCompany.FIND_SUBSIDIARIES_BY_COMPANY,[company.id_company]);        
        
        jsonResponse.company.subsidiaries = listSubsidiaries;
        res.status(200).json(jsonResponse);
    } catch(er){
        conn.rollback();
        res.status(500).json(httpstatus.S_500_ERROR);
    }
}

export {createCompany, createSubsidiary, getListSubsidiariesByOwner}