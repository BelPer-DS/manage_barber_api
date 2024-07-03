import bcrypt from 'bcrypt';
import cryptoJs from 'crypto-js';
import { v4 as uuidv4 } from 'uuid';
import QRCode from 'qrcode';
//import qrcode

const ENCRYPTION_KEY = 'B4rb3r_T3st1ng';

const randomNumberCode = (size) => {
    const chars = '0123456789';
    const charLength = chars.length;
    let result = '';
    for(let i = 0; i < size; i++){
        result += chars.charAt(Math.floor(Math.random() * charLength));
    }
    return result;
}

const randomQrId = async () => {
    return uuidv4();
}

const hashing = async (value) => {
    return await bcrypt.hashSync(value,10);
}

const compareHash = async (value, encryption) => {
    return await bcrypt.compare(value, encryption)
}

const encryption = async(value) => {
    return await cryptoJs.AES.encrypt(value,ENCRYPTION_KEY).toString();
}

const decrypted = async(value) => {
    return await cryptoJs.AES.decrypt(value,ENCRYPTION_KEY).toString(cryptoJs.enc.Utf8);
}

const setDatetime = (date, time) => {
    const regexTime = "^([01]?[0-9]|2[0-3]):[0-5][0-9]$";
    try{
        if(!time.match(regexTime)) return null;
        const hourMin = time.split(":");
        const hour = parseInt(hourMin[0]);
        const min = parseInt(hourMin[1]);
        if((hour >= 0 && hour <= 23) && (min >= 0 && min <= 59)){
            const d = date.setUTCHours(hour, min);
            return d;
        }else{
            return null;
        }
        
    }catch(er){
        console.log("Error in setDateTime: ", er);
        return null;
    }
}

const setDate = (date) => {
    try{
        console.log(date);
        const yyyymmdd = date.split("-");
        const year = yyyymmdd[0];
        const month = yyyymmdd[1];
        const day = yyyymmdd[2];
        console.log(yyyymmdd);
        if((year < 2024 || year >= 3000) || (month < 1 || month > 12) || (day < 1 || day > 31)){
            console.log("Invalid date: ", date);
            return null;
        }
        
        const d = new Date(date);
        console.log("return Date: ", d);
        return d;
    }catch(er){
        console.log("Error: ", er);
        return null;
    }
}

const formatUrl = (value) => {
    const resp = encodeURIComponent(value);//.replaceAll("/", "%252F");
    console.log('formatUrl: ',resp);
    return resp;
}

const generateQr = async (value) => {
    const imgUrl = await QRCode.toDataURL(value);
    return imgUrl;
}

const blodToImgBase64 = async (valueBlob) => {
    const imgBase64 = await new Response(valueBlob).text();
    return imgBase64;
}
export {randomNumberCode, hashing, compareHash, encryption, decrypted, randomQrId, setDatetime, setDate, generateQr, blodToImgBase64, formatUrl}