
import express from "express";
import {
  createFamily , 
  getFamily ,
   addMember , 
   addRootMember , 
   updateFamily ,
    removeMember , 
    deleteFamily , 
} from "../controllers/family.controller.js";

import {getFamilyAncestorsAndDescendants } from "../controllers/FamilyTree.controller.js"
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();


// -------------------- FAMILY ROUTES --------------------

// Create a new family
router.post("/create-family", verifyJWT, upload.single("familyPhoto"), createFamily);

// Get family details by ID
router.get("/:familyId", verifyJWT, getFamily);

// Add a normal member
router.post("/add-member/:family_id", verifyJWT, addMember);

// Add remaining root member
router.post("/add-root-member", verifyJWT, addRootMember);

// Update family details
router.put("/update/:family_id", verifyJWT, upload.single("familyPhoto"), updateFamily);

// Remove a member
router.delete("/remove-member/:family_id", verifyJWT, removeMember);

// Delete a family
router.delete("/delete-family/:family_id", verifyJWT, deleteFamily);


router.post("/tree/:family_id", verifyJWT, getFamilyAncestorsAndDescendants);


export default router;