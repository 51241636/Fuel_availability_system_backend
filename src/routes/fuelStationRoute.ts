import { Router } from "express";
import { getUserStationDetails, registerStation, updateFillingDetail } from "../controller/stationCOntroller";
import { authenticate } from "../middlewares/authMiddleware";
import { roleAuthenticate } from "../middlewares/rolebaseAuthetication";


const stationRouter = Router();
stationRouter.post("/saveFuelStation",authenticate,roleAuthenticate("admin","owner"),registerStation);
stationRouter.get("/getUserFilligStation",authenticate,roleAuthenticate("admin","owner"),getUserStationDetails);
stationRouter.post("/updateStationDetail",authenticate,roleAuthenticate("admin","owner"),updateFillingDetail)

export default stationRouter;