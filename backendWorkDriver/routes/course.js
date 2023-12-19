import express from "express";
import { assignInstructor, getCourseList, getCourseRoutine, getCoursesWithSections, getDetails, getSections, removeInstructor } from "../controllers/course.js";


const router = express.Router();

// READ 
router.get("/courselist", getCourseList)
router.get("/all", getCoursesWithSections)
router.get("/:id", getDetails);
router.get("/:id/routine", getCourseRoutine);
router.get("/:id/sections", getSections);

// Post
router.post('/:id/assign', assignInstructor)

/* UPDATE */
router.patch("/:id/update", removeInstructor);


export default router;