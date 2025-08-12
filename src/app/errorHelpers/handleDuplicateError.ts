import { IGenericErrorResponse } from "../interfaces/error.interfaces";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const handleDuplicateError = (error: any): IGenericErrorResponse =>{   
    const duplicate = error.message.match(/"([^"]*)"/);

    return {
      statusCode: 400,
      message: `${duplicate[1]} already exists.`
    }    
}