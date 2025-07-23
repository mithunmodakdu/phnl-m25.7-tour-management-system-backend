import { Request, Response } from "express"
import httpStatusCodes from "http-status-codes";

const notFound = (req: Request, res:Response) =>{
  res.status(httpStatusCodes.NOT_FOUND).json({
    success: false,
    message: "ROUTE NOT FOUND"
  })
}

export default notFound;