import { Request, Response } from "express";
import { FuelStationDTO } from "../DTO/fuelStationDTO";
import { getUserStationDetailsService, saveNewStationService } from "../service/fuelStationService";
import { AuthRequest } from "../middlewares/authMiddleware";
import { Types } from "mongoose";

export const registerStation=async (req:AuthRequest,res:Response)=>{
  
        try{
            const fuelStationDTO:FuelStationDTO=req.body;
            const userId:string | undefined =req.userId
            // console.log(fuelStationDTO)
        const saved= await saveNewStationService(fuelStationDTO,new Types.ObjectId(userId));
        console.log("saved station succesfully",saved)
        res.status(200).json({
            message:"fuelStation Registered successfully",
            user:saved
        });

        }catch(error){
             console.log(error)
            const message=error instanceof Error ? error.message : "something went wrong"
            const status =404
            return res.status(status).json({
                 success:false,
                 message
            })
        }
   
}

export const getUserStationDetails=async (req:AuthRequest,res:Response)=>{
    try{
              const userId:string | undefined =req.userId;
              console.log("userId : ",userId)
              const userStaionDetail= await getUserStationDetailsService(new Types.ObjectId(userId));  
              console.log("uerStation : ",userStaionDetail)
              res.status(200).json({
                message:"get userStation Details successfully",
                station:userStaionDetail
            });
    }catch(error){
        console.log(error)
            const message=error instanceof Error ? error.message : "something went wrong"
            const status =404
            return res.status(status).json({
                 success:false,
                 message
            })
    }
}