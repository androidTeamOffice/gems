const express = require("express");
const { validateToken, checkManagerRole } = require("../utils/authMiddleware"); // Assuming the file is named authMiddleware.js
const {
  addCivDataToDatabase,
  saveDisabledDatesToDatabase,
  findCivDataByCNIC,
  findCivDataById,
  updateCivDataInDatabase,
  getAllCivDatas,
  getAllVerifiedCivDatas,
  getAllDisabledDates,
  deleteCivData,
  rejectCivData,
  verifyCivData,
  verifyStatus
} = require("../models/civiliandata"); // Assuming the file is named civData.js
require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { randomInt } = require("crypto");
const router = express.Router();

function handleError(err, res) {
  console.error(err);
  res.status(500).json({ message: "Internal server error" });
}

router.get("/disabled-dates",  async (req, res) => {
  console.log("Fetching all Disabled Dates!");
  try {
    const dates = await getAllDisabledDates();
    res.json({ dates });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});
router.post("/add_civData", validateToken, async (req, res) => {
  const { name, cnic,  userid,  occupation, category, Applicant, Card_Duration, Vehicle_Registration_No, Mobile_no, Home_phone_no,
     FCNIC, Father_Husband_Name, Gaurdian_Contact,Gaurdian_CNIC, Present_Address,
      Permanent_Address, Profile_Picture, Disability, Description, Vehicle_Make,
       Vehicle_Model, Vehicle_Type, Previous_Card_Picture, BCNIC, Vehicle_Documents,
       Police_Verification_Document, Appointment_Day, Appointment_Time 
      } = req.body;//TODO: your furhter civ data parameters...
  


      const saveBase64Image = (base64String, folderPath, fileName) => {
        try {
          if (base64String && typeof base64String === 'string' && base64String.includes(',')) 
          {
          const buffer = Buffer.from(base64String.split(",")[1], "base64");
          const filePath = path.join(folderPath, fileName);
          fs.writeFileSync(filePath, buffer);
      
          // Extract file name and type
          const fileType = path.extname(fileName); // Get the file extension
          const nameWithoutExtension = path.basename(fileName, fileType); // Get the name without extension
      
          return nameWithoutExtension+fileType; 
        } else{
          return null;
        }}catch (error) {
          console.error("Error saving image:", error);
          return null;
        }
      };
  

  // Validation (optional)
  // if ( !name|| !cnic|| !occupation|| !category|| !Applicant||  !Card_Duration||!Mobile_no||
  //    !Home_phone_no||!FCNIC|| !Father_Husband_Name|| !Gaurdian_Contact||!Gaurdian_CNIC||
  //     !Present_Address||!Permanent_Address|| !userid||!Profile_Picture|| !Disability||
  //     !BCNIC|| !Vehicle_Documents ||
  //       !Police_Verification_Document|| !Appointment_Day|| !Appointment_Time) {
  //   return res
  //     .status(400)
  //     .json({ message: "Missing required fields" });
  // }

  // Check for existing civData
  const existingCivData = await findCivDataByCNIC(cnic);
  if (existingCivData) {
    return res.status(400).json({ message: "CivData with the same CNIC already exists" });
  }

  // Folder to store uploaded images
  const uploadsFolder = path.join(__dirname, "../../uploads");
  if (!fs.existsSync(uploadsFolder)) {
    fs.mkdirSync(uploadsFolder); // Create uploads folder if it doesn't exist
  }

  const getRandomInt = (min, max) => {
    min = Math.ceil(min); // Ensure the minimum value is an integer
    max = Math.floor(max); // Ensure the maximum value is an integer
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  const fileName = cnic+name+getRandomInt(100,10000)
  // Save images
  const profilePicturePath = saveBase64Image(Profile_Picture, uploadsFolder, `${fileName}_profile.jpg`);
  const bcnicPath = saveBase64Image(BCNIC, uploadsFolder, `${fileName}_bcnic.jpg`);
  const fcnicPath = saveBase64Image(FCNIC, uploadsFolder, `${fileName}_fcnic.jpg`);
  let vehicleDocsPath = null;

  if (Vehicle_Documents) {
    vehicleDocsPath = saveBase64Image(
      Vehicle_Documents, 
      uploadsFolder, 
      `${fileName}_vehicle_docs.jpg`
    );
  } else {
    console.log("Vehicle_Documents is null or undefined.");
  }
    const policeVerificationPath = saveBase64Image(Police_Verification_Document, uploadsFolder, `${fileName}_police_verification.jpg`);
  const previousCardPicturePath = saveBase64Image(Previous_Card_Picture, uploadsFolder, `${fileName}_previous_card_picture.jpg`);

  if (!profilePicturePath || !bcnicPath || !policeVerificationPath ) {
    return res.status(500).json({ message: "Error saving images" });
  }
  console.log("req.body: ",profilePicturePath);

  try {
    civData = {
      name: name || "ADF ",
      cnic: cnic || " AD",
      userid: userid || " AD",
      occupation: occupation , // Default value
      category: category,   // Default value
      type: Applicant || " ADF",
      status: "New",   // Default value
      remarks: "ADSF ",    // Default value
      Card_Duration: Card_Duration || "ASDF ",
      Vehicle_Registration_No: Vehicle_Registration_No || "ASDF ",
      Mobile_no: Mobile_no || "ADF ",
      Home_phone_no: Home_phone_no || " ADF",
      fCNIC: fcnicPath || "ASDF ",
      Father_Husband_Name: Father_Husband_Name || " AF",
      Gaurdian_Contact: Gaurdian_Contact || "AFS ",
      Gaurdian_CNIC: Gaurdian_CNIC || " ADF",
      Gaurdian_Occupation: "ADF ", // Default value
      Province: "ADF ",            // Default value
      Nationality: "ADF ",         // Default value
      Caste: "ADF ",         // Default value
      Present_Address: Present_Address || "ASDF ",
      Permanent_Address: Permanent_Address || "ADF ",
      Profile_Picture: profilePicturePath || "ADSF ",
      Disability: Disability || "ADFS ",
      Description: Description || "DFAD ",
      Vehicle_Make: Vehicle_Make || "ADF ",
      Vehicle_Model: Vehicle_Model || " ADF",
      Vehicle_Type: Vehicle_Type || " ADF",
      bCNIC: bcnicPath || "ADSF ",
      Vehicle_Documents: vehicleDocsPath || "ADF ",
      Police_Verification_Document: policeVerificationPath || "ASD ",
      Appointment_Day: Appointment_Day || "SAD ",
      Appointment_Time: Appointment_Time || " SDF",
      Previous_Card_Picture: previousCardPicturePath || "ADSF"
    }

    
    console.log("data",civData);
    await addCivDataToDatabase(civData);
    res.json({ message: "Civdatas created successfully", civData: civData }); // Return created civData ID
  } catch (error) {
    handleError(error, res);
  }
});
router.post("/civData_by_id", validateToken, async (req, res) => {
  const id = req.body.id;
  console.log("Finding civData!");
  try {
    const civData = await findCivDataById(id);
    if (civData) {
      res.json({ civData });
    } else {
      res.status(404).json({ message: "Civdatas with id: " + id + " not found." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});
// Route for updating a civData (POST)
router.post(
  "/update_civData",
  validateToken,
  checkManagerRole,
  async (req, res) => {
    const { id, civDataname } = req.body;

    // Check for missing fields
    if (!civDataname || !id) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Find user by id
    const civData = await findCivDataById(id);
    if (!civData) {
      return res.status(404).json({ message: "Civdatas not found" });
    }

    try {
      // Prepare updated civData object
      const updatedcivData = {};
      if (civDataname) civData.name = civDataname;

      // Update civData in the database (using updateCivDataInDatabase)
      await updateCivDataInDatabase(civData.id, civData);

      res.json({ message: "Civdatas updated successfully" });
    } catch (error) {
      console.error("Error updating civData:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);
router.get("/civilian_data_for_verification_list", validateToken, async (req, res) => {
  console.log("Fetching all civDatas list!");
  try {
    const civDatas = await getAllCivDatas();
    res.json({ civDatas });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});
router.get("/civilian_data_verified_list", validateToken, async (req, res) => {
  console.log("Fetching all civDatas list!");
  try {
    const civDatas = await getAllVerifiedCivDatas();
    res.json({ civDatas });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});
router.post(
  "/delete_civData",
  validateToken,
  checkManagerRole,
  async (req, res) => {
    const { id } = req.body;
    // Check for missing fields
    if (!id) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    try {
      const civDatas = await deleteCivData(id);
      console.log(civDatas);
      if (civDatas) res.status(200).json({ message: "Civdatas deleted successfully" });
      if (!civDatas)
        res.status(500).json({ message: "Civdatas not deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);
router.post(
  "/reject_civdata",
  validateToken,
  checkManagerRole,
  async (req, res) => {
    const { id,remarks } = req.body;
    // Check for missing fields
    if (!id||!remarks) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    try {
      const civDatas = await rejectCivData(id,remarks);
      console.log(civDatas);
      if (civDatas) res.status(200).json({ message: "Civdatas rejected successfully" });
      if (!civDatas)
        res.status(500).json({ message: "Civdatas not rejected successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);
router.post(
  "/verify_civData",
  validateToken,
  checkManagerRole,
  async (req, res) => {
    const { id } = req.body;
    // Check for missing fields
    if (!id) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    try {
      const civDatas = await verifyCivData(id);
      console.log(civDatas);
      if (civDatas) res.status(200).json({ message: "Civdatas verified successfully" });
      if (!civDatas)
        res.status(500).json({ message: "Civdatas not verified successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

router.post(
  "/verify_civData",
  validateToken,
  checkManagerRole,
  async (req, res) => {
    const { id } = req.body;
    // Check for missing fields
    if (!id) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    try {
      const civDatas = await verifyCivData(id);
      console.log(civDatas);
      if (civDatas) res.status(200).json({ message: "Civdatas verified successfully" });
      if (!civDatas)
        res.status(500).json({ message: "Civdatas not verified successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

router.post(
  "/checkFormStatus",
  async (req, res) => {
    const { id } = req.body;
    // Check for missing fields
    if (!id) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    try {
      const civDatas = await verifyStatus(id);
      const status = civDatas?.[0]?.[0]?.status || "new";
      console.log(status);
    
        res.status(200).json({ message:  status});
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

router.post("/disabled-dates", async (req, res) => {
  console.log("receiving disabled  dates:", req.body);
  const { dates } = req.body;

  if (!Array.isArray(dates) || dates.length === 0) {
    return res.status(400).json({ message: "Invalid or empty list of dates" });
  }

  try {
    // Save to the database (update this function as needed)
    await saveDisabledDatesToDatabase(dates); 
    res.status(200).json({ message: "Disabled dates saved successfully" });
  } catch (error) {
    console.error("Error saving disabled dates:", error);
    res.status(500).json({ message: "Failed to save disabled dates" });
  }
});

// Mock database function (replace with real DB logic)




module.exports = router;
