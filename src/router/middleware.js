import jwt from 'jsonwebtoken';
import { configDotenv } from "dotenv";
configDotenv();
const { verify } = jwt;
const authenticator = (req, res, next) =>{
    const header = req.header("Authorization") || "";
    const token = header.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Token not provied" });
    }
    try {
      const payload = verify(token, process.env.SCRT_KEY);
      req.session = payload;
      next();
    } catch (error) {
      return res.status(403).json({ message: "Token not valid" });
    }
}

export {authenticator}