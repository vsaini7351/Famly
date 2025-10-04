import express from "express";
import { generateFamilyStoriesPDF } from "../controllers/pdf.controller.js";

const router = express.Router();

router.get("/families/:familyId/stories", generateFamilyStoriesPDF);

export default router;
