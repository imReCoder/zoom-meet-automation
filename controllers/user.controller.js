import { responseHandler } from "../utils/utils.js";

export const getUser = async(req,res,next)=>{
   const body = "success";
    responseHandler(res,body);
}
