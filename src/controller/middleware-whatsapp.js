import pkg from 'whatsapp-web.js';
const { Client, LocalAuth } = pkg;
import {generateQr} from "../controller/utilities.js";
let client;
let base64UrlQr;
let attemps = 0;
const maxAttemps = 3;
const STATE_CONNECTED = "CONNECTED";
//const client = new Client(puppeteerOptions);
const startingWatsapp = async (req, res) => {
    try {
        if(client == null){
            console.log("New client: ");
            client = new Client({
                webVersionCache: {
                  type: "remote",
                  remotePath:
                    "https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html",
                },
                puppeteer: {
                  args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox'
                  ],
                  authStrategy: new LocalAuth()      
                },
                qrMaxRetries : maxAttemps     
            });
            client.once('ready', () => {
                console.log('Client is ready!');
            });
            client.on('qr', async (qr) => {
                console.log("In QR generate: ",attemps);
                base64UrlQr = await generateQr(qr);
                ++attemps;
                if(attemps == 1){
                    res.send(base64UrlQr);                 
                    return
                }
                
            });        
            client.initialize();
        } else {
            let state = await client.getState();
            console.log("State connection: ", state);
            if(state == null){
                console.log("In state null: ");
                res.send(base64UrlQr);
                return
            } else {                
                if(attemps >= (maxAttemps-1)){
                    //console.log("Client: ", client);
                    if(state != STATE_CONNECTED){
                        await client.destroy();
                        client = null;
                        attemps = 0;
                        res.send("The maximum number of attempts has been reached. Please try again");                
                        return
                    }
                }
                res.send("The session status is " + state);
                return
            }    
        }
        
    } catch (err) {
        if(client != null){
            await client.destroy();
            client = null;
        }        
        console.log(err);
        res.send(err.message)
    }
}

const apiSendMessage = async (req, res) => {
    const {numberphone, country_code, message} = req.body;
    await sendMessage(numberphone, country_code, message)
    .then((response) => {
        console.log("send ok: ", response);
        res.status(response.status).json(response);
        return
    }).catch((error) => {
        console.log("send error: ", error);
        res.status(500).json(error);
        return
    });    
    
}

const sendMessage = async(numberphone, country_code, message) =>{
    try{
        if(client != null){
            let state = await client.getState();
            if(!state){
                //res.status(400).send("session not available, try again");
                console.log("sendMessage: 400 - session not available, try again");
                return new Promise((resolve, reject) => {
                    resolve({
                        status : 400,
                        message : "session not available, try again"
                    });                    
                })
            }
            
            //const {numberphone, message, country_code} = req.body;
            if(country_code == null)
                country_code == "52";
    
            const sanitized_number = numberphone.toString().replace(/[- )(]/g, "");
            const final_number = country_code + sanitized_number.substring(sanitized_number.length - 10);
            console.log("final_number: ", final_number);
            const number_details = await client.getNumberId(final_number);
    
            if (number_details) {
                const statusSendMessage = await client.sendMessage(number_details._serialized, message);
                /*.then(response => {
                    console.log("sendMessage: 200 - Mendaje enviado correctamente...");
                    return new Promise((resolve, reject) => {
                        resolve({
                            status : 200,
                            message : "Mendaje enviado correctamente..."
                        });
                    });
                })
                .catch(err => {
                    //res.status(500).send("Error al mandar mensaje: ");
                    console.log("sendMessage: 500 - Error al mandar mensaje ");
                    return new Promise((resolve, reject) => {
                        reject({
                            status : 500,
                            message : "Error al mandar mensaje "
                        });
                    });    
                }); // send message*/
                console.log("SendMessage: ",statusSendMessage);
                return new Promise((resolve, reject) => {
                    resolve({
                        status : 200,
                        message : "sendMessage"
                    });
                });
            } else {               
                //res.status(400).send("Mobile number is not registered");
                console.log("sendMessage: 400 - Mobile number is not registered");
                return new Promise((resolve, reject) => {
                    resolve({
                        status : 400,
                        message : "Mobile number is not registered"
                    });
                });                
            }
    
        } else {
            //res.status(400).send("No hay sesiones de whatsapp activas");
            console.log("sendMessage: 400 - No hay sesiones de whatsapp activas");
            return new Promise((resolve, reject) => {
                resolve({
                    status : 400,
                    message : "No hay sesiones de whatsapp activas"
                });
            });            
        }
    }catch(er){
        if(client != null){
            await client.destroy();
            client = null;
        }        
        console.log(er);
        //res.send(err.message);
        console.log("sendMessage: 500 - Error al mandar mensaje ");
        return new Promise((resolve, reject) => {
            resolve({
                status : 500,
                message : "Error al mandar mensaje "
            });
        });        
    }
}

export {sendMessage, startingWatsapp, apiSendMessage}