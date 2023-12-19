import express from "express";
import { courseRoutine, getRooms, instructorRoutine, roomRoutine } from "../controllers/schedules.js";

const router = express.Router();

// READ 
router.get("/rooms",getRooms)
router.get("/instructor/:id",instructorRoutine)
router.get("/room/:room",roomRoutine)
router.get("/course/:id",courseRoutine)

export default router;