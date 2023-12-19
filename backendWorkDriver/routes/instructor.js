import express from "express";
import { assignCourse, createInstructor, getAll, getInfo, getList, getRoutine, removeCourse, updateCourse } from "../controllers/instructor.js";

const router = express.Router();

// READ 
router.get("/", getList)
router.get("/getall", getAll)
router.get("/:id", getInfo);
router.get("/:id/routine", getRoutine);

// Post
router.post('/create', createInstructor)
router.post('/:id/assign', assignCourse)
router.post("/:id/remove", removeCourse);

/* UPDATE */
router.patch("/:id/update", updateCourse);


export default router;