import {conn} from '../db/connect.js';
import { httpstatus } from "../enums/http-status.js";
import {status} from '../enums/status-enum.js';
import { queryCustomer } from '../db/queryCustomer.js';
import { hashing, encryption, decrypted, randomQrId, compareHash, generateQr, blodToImgBase64, formatUrl} from './utilities.js';
import jwt from 'jsonwebtoken';
import moment from 'moment';
import { configDotenv } from "dotenv";
import { sendMessage } from './middleware-whatsapp.js';

configDotenv();
const { sign } = jwt;

const testPath = async (req, res) => {
    console.log(req.protocol);        // http or https
    console.log(req.hostname);        // only hostname without port
    console.log(req.headers.host);    // hostname with port number (if any); same result with req.header('host')
    console.log(req.route.path);      // exact defined route
    console.log(req.baseUrl);         // base path or group prefix
    console.log(req.path);            // relative path except query params
    console.log(req.url);             // relative path with query|search params
    console.log(req.originalUrl);     // baseURL + url
    res.status(200).send(req.protocol +"://" + req.headers.host + req.baseUrl + "/active/");
}

const createCustomer = async (req,res) => {
    const{name, last_name, alias_name, phone_number, mail, pass, country_code} = req.body;
    if(name == null || phone_number == null || pass == null){
        res.status(400).json(httpstatus.S_400_BAD_REQUEST);
    }

    try{
        await conn.beginTransaction();
        const passEncrpypted = await hashing(pass);
        if(!country_code)
            country_code = "52";
        const encrypt = formatUrl(await encryption(phone_number));
        const qrCode = await generateQr(encrypt);
        const[respInsQr] = await conn.query(queryCustomer.CREATED_QR_IMG,[('qr_user_id_'+phone_number),'image/png',qrCode,status.ACIVE]);
        const idQrImg = respInsQr.insertId;

        const[respInsert] = await conn.query(queryCustomer.CREATED_CUSTOMER,
            [name, last_name, alias_name, phone_number, mail, passEncrpypted,idQrImg,status.PENDING,country_code]);
        
        const[[respQrPath]] = await conn.query(queryCustomer.FIND_QR_IMG,[idQrImg]);        
        
        const imgB64 = await blodToImgBase64(respQrPath.path);
        console.log("-----------------------> IMG \n", imgB64);
        let resp = {
            customer_id : respInsert.insertId,
            code : encrypt
        };
        conn.commit();
        const activationCode = req.protocol +"://" + req.headers.host + req.baseUrl + "/active/" + encrypt;        
        sendMessage(phone_number,country_code,`Gracias por registrarte con nosotros. Ingresa a la siguiente liga para activar tu cuenta: ${activationCode}`)
        .then((response) =>{
            console.log(response);
            res.status(201).json(resp);
        })
        .catch((error)=>{
            console.log(error);
        });
        
    }catch(er){
        conn.rollback();            
        console.log("Error in create: ",er);
        if(er.code == 'ER_DUP_ENTRY'){
            res.status(409).json(httpstatus.S_409_CONFLICT_EXIST);
        }else{
            res.status(500).json(httpstatus.S_500_ERROR);
        }
    }   
}

const getCustomerByCode = async (req, res) => {
    const code = decodeURIComponent(req.params.code);
    console.log("code: ", code);
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
            console.log("user: ", user);
            console.log("code: ", code);
            const [[access]] = await conn.query(queryCustomer.FIND_ACCESS_CODE,[user, status.ACIVE]);
            console.log("Access: ", access);
            if(access == null){
                res.status(401).json(httpstatus.S_401_UNAUTHORIZED);
                return;
            }
            const match = await compareHash(code, access.access_code);
            if(access!=null && match){
                const [[customer]] = await conn.query(queryCustomer.FIND_BY_ID,[access.id_customer]);
                //Logica para implementar JWT
                const payload = {
                    iat: moment().unix(),
                    exp: moment().add(30,'m').unix(),
                    customer: customer
                }
                const token = sign(payload,process.env.SCRT_KEY);
                res.status(200).json({token});
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

const activeCustomer = async (req, res) => {
    const code = decodeURIComponent(req.params.code);
    console.log("code: ", code);
    if(code == null){
        res.status(400).json(httpstatus.S_400_BAD_REQUEST);
        return;
    }
    const phone_number = await decrypted(code);
    const [queryResult] = await conn.query(queryCustomer.ACTIVE_CUSTOMER, 
        [status.ACIVE,phone_number]);
    console.log("QueryResult: ",queryResult);
    res.status(200).send("Active successful");
}
export {createCustomer, getCustomerByCode, loginCustomer, activeCustomer, testPath}