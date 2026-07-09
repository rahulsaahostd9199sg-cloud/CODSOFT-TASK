import express from "express";
import { getQuestions } from "../controllers/questionController.js";

const questionRouter = express.Router();

questionRouter.get("/", getQuestions);

export default questionRouter;