import { Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import { UpdateFuelDetailsService } from "../service/fuelService";

export const UpdateFuelDetails=async(req:AuthRequest,res:Response)=>{
    try{
         const stationId = req.params.stationId as string;
        const { fuels } = req.body;
        console.log(stationId,"idddddd")
        // if(!stationId){
        //     throw new Error("station id not found")
        // }
        const updateFuelDetails=UpdateFuelDetailsService(stationId,fuels);
        console.log("updateFuelDetails", updateFuelDetails)
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