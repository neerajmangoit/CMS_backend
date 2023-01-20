import { Router } from "express";
const router = Router();
import jwt from "jsonwebtoken";
// const { _decode } = jwt
// const { verify } = jwt;
import { config } from "dotenv";
config();

var myLogger = (req, res, next) => {
  try {
    const bearerHeader = req.headers["authorization"] || req.headers["Authorization"];
    if (bearerHeader) {
      const token = bearerHeader.split(" ")[1];
      jwt.verify(token, process.env.LOGINKEY); //Checking for SecretKey
      const decode = jwt.decode(token);
      const expire = decode.exp * 1000;
      if (expire < new Date().getTime()) {
        res.status(400).send({
          message: "token expired !",
        });
      } else {
        next();
      }
    } else {
      // Forbidden
      res.status(403).send({
        message: "token is required !",
      });
    }
  } catch (error) {
    res.status(400).send({
      message: "invalid Token",
      subError: error,
    });
  }
};

export default myLogger;
