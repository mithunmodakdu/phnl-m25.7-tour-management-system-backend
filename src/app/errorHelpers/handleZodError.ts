import { IErrorSources, IGenericErrorResponse } from "../interfaces/error.interfaces";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const handleZodError = (error: any) : IGenericErrorResponse =>{
 
    const errorSources: IErrorSources[] = [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error.issues.forEach((issue: any) => {
      errorSources.push({
        path: issue.path[issue.path.length - 1],
        // path: issue.path.length > 1 && issue.path.reverse().join(" inside "),
        message: issue.message,
      });
    });

    return {
       statusCode: 400,
       message: "Zod Error"
    }

}