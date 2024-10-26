const express = require("express");
const app = express();

const fs = require("fs");
const { validateToken, checkManagerRole } = require("../utils/authMiddleware");
const {
  addBioDataToDatabase,
  findBioDataByArmyNo,
  updateBioDataInDatabase,
  getAllBioData,
  deleteBioData,
  SearchData,
  LeaveReport,
  addBioDataToDatabase1,
} = require("../models/biodata");
const { findRankById } = require("../models/rank");
const { findCadreById } = require("../models/cadre");
require("dotenv").config();

const router = express.Router();

function handleError(err, res) {
  console.error(err);
  res.status(500).json({ message: "Internal server error" });
}
router.get(
  "/add_bio_data_into_emps",
  async (req, res) => {
    const newBioData = await addBioDataToDatabase1();
    console.log("compos");
  });
// Route for adding bio data (POST)
router.post(
  "/add_bio_data",
  validateToken,
  checkManagerRole,
  async (req, res) => {
    const {
      armyNo,
      rank,
      trade,
      indlName,
      CNIC,
      fatherName,
      medicalCategory,
      bdrDist,
      sect,
      martialStatus,
      qualStatus,
      bloodGp,
      clCast,
      DOB,
      DOE,
      DOPR,
      TOS,
      SOS,
      civEdn,
      bty_id,
      image,
      lve_circle_id,
      district,
    } = req.body;

    let imageFileName = "";
    const buffer = Buffer.from(image.split(",")[1], "base64");
    const fileName = `${armyNo}.jpg`;
    imageFileName = "../uploads/" + fileName;
    try {
      fs.writeFileSync(imageFileName, buffer, (err) => {
        if (err) {
          console.error(err);
        } else {
          console.log("Image saved successfully!");
        }
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Error uploading image" });
    }

    if (
      !armyNo ||
      !rank ||
      !trade ||
      !indlName ||
      !CNIC ||
      !fatherName ||
      !medicalCategory ||
      !bdrDist ||
      !sect ||
      !martialStatus ||
      !qualStatus ||
      !bloodGp ||
      !clCast ||
      !DOB ||
      !DOE ||
      !DOPR ||
      !TOS ||
      !SOS ||
      !civEdn ||
      !bty_id ||
      !image ||
      !lve_circle_id ||
      !district
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    rankName = await findRankById(rank.value);
    tradeName = await findCadreById(trade.value);
    svcBktYears = 0;

    if (rankName.name == "Sep" || rankName.name == "Lnk") {
      svcBktYears = 18;
    } else if (
      rankName.name == "L/Hav" ||
      rankName.name == "Lhav" ||
      rankName.name == "Nk"
    ) {
      if (tradeName.name == "OCU") {
        svcBktYears = 20;
      } else {
        svcBktYears = 23;
      }
    } else if (rankName.name == "Hav") {
      if (tradeName.name == "OCU") {
        svcBktYears = 23;
      } else {
        svcBktYears = 26;
      }
    } else if (rankName.name == "N/Sub") {
      if (tradeName.name == "OCU") {
        svcBktYears = 26;
      } else {
        svcBktYears = 30;
      }
    } else if (rankName.name == "Sub") {
      if (tradeName.name == "OCU") {
        svcBktYears = 30;
      } else {
        svcBktYears = 32;
      }
    } else if (rankName.name == "SM") {
      svcBktYears = 34;
    }

    const totalSvcDict = calculateTotalService(DOE);
    const totalSvc = totalSvcDict["totalSvc"];
    const daysRemainingDict = calculateRemainingService(
      DOE,
      totalSvc,
      svcBktYears
    );
    const remainingSvc = daysRemainingDict["remainingSvcString"];

    try {
      const newBioData = await addBioDataToDatabase({
        Army_No: armyNo,
        Rank: rank.value,
        Trade: trade.value,
        Name: indlName,
        CNIC_Indl: CNIC,
        Father_Name: fatherName,
        Med_Cat: medicalCategory.value,
        Bdr_Dist: bdrDist,
        Sect: sect,
        Md_Unmd: martialStatus.value,
        qual_unqual: qualStatus.value,
        Blood_Gp: bloodGp,
        Cl_Cast: clCast,
        Svc_Bkt_Years: svcBktYears,
        Total_Svc: totalSvc,
        Remaining_Svc: remainingSvc,
        DOB,
        DOE,
        DOPR,
        TOS,
        SOS,
        Civ_Edn: civEdn,
        bty_id: bty_id.value,
        image: imageFileName,
        lve_circle_id: lve_circle_id.value,
        district,
      });
      res.json({
        message: "Bio data created successfully",
        bioData: newBioData,
      });
    } catch (error) {
      handleError(error, res);
    }
  }
);

// Route for getting bio data by ID (POST)
router.post("/bio_data_by_army_no", validateToken, async (req, res) => {
  const { armyNo } = req.body;

  try {
    const bioData = await findBioDataByArmyNo(armyNo);
    if (bioData) {
      if (bioData.image) {
        const dataWithBase64Images = bioData.image
          ? `data:image/jpg;base64,${getBase64Image(bioData.image)}`
          : null;
        bioData.image = dataWithBase64Images;
        res.json({ bioData });
      } else {
        res.json({ bioData });
      }
    } else {
      res
        .status(404)
        .json({ message: "Bio data with id: " + armyNo + " not found." });
    }
  } catch (error) {
    handleError(error, res);
  }
});


// Route for searching bio data (POST)
// Route for searching bio data (POST)
router.post("/search_data", validateToken, async (req, res) => {
  const {
    indlName,
    rank,
    trade,
    medicalCategory,
    martialStatus,
    bloodGp,
    clCast,
    qualStatus,
    bty_id,
  } = req.body;

  try {
    const bioData = await SearchData(
      indlName,
      rank.value,
      trade.value,
      medicalCategory.value,
      martialStatus.value,
      bloodGp,
      clCast,
      qualStatus.value,
      bty_id.value
    );

    if (bioData && bioData.length > 0) {
      const dataWithBase64Images = bioData.map((row) => ({
        ...row,
        image: row.image
          ? `data:image/jpg;base64,${getBase64Image(row.image)}`
          : null,
      }));
      res.json({ bioData: dataWithBase64Images });
    } else {
      res.status(404).json({ message: "No bio data found matching the criteria." });
    }
  } catch (error) {
    handleError(error, res);
  }
});


// Route for searching leave report (POST)
router.post("/search_lve_report", validateToken, async (req, res) => {
  const { bty_id, start_date, end_date } = req.body;

  try {
    const leaveReport = await LeaveReport(bty_id.value, start_date, end_date);
    if (leaveReport) {
      res.json({ leaveReport });
    } else {
      res.status(404).json({ message: "Leave Report Not Found" });
    }
  } catch (error) {
    handleError(error, res);
  }
});
const calculateTotalService = (enrollmentDate) => {
  const currentDate = new Date(); // Current date
  console.log("currentDate: " + currentDate);
  console.log("enrollmentDate: " + enrollmentDate);
  const enrollmentDateMs = Date.parse(enrollmentDate);
  const enrollmentDateObject = new Date(enrollmentDateMs);
  // Calculate total milliseconds difference
  let difference = currentDate - enrollmentDateObject;
  console.log("difference: " + difference);
  // Calculate years
  const years = Math.floor(difference / (365 * 24 * 60 * 60 * 1000));
  difference -= years * (365 * 24 * 60 * 60 * 1000);

  // Calculate months
  const months = Math.floor(difference / (30 * 24 * 60 * 60 * 1000));
  difference -= months * (30 * 24 * 60 * 60 * 1000);

  // Calculate days
  const days = Math.floor(difference / (24 * 60 * 60 * 1000));

  console.log(`${years} years, ${months} months, ${days} days`);
  return {
    totalSvc: `${years} years, ${months} months, ${days} days`,
    years: years,
    months: months,
    days: days,
  };
};
function calculateRemainingService(DOE, totalSvcString, svcBktYears) {
  // Regex to extract numbers (consider libraries for complex parsing)
  const match = totalSvcString.match(/\d+/g);

  // Check if there's a match and all three components are present
  if (!match || match.length !== 3) {
    throw new Error("Invalid totalSvc format");
  }

  const years = parseInt(match[0]);
  const months = parseInt(match[1]);
  const days = parseInt(match[2]);

  // Conversion factors (assuming 30 days per month, adjust if needed)
  const daysInYears = years * 365;
  const daysInMonths = months * 30;
  const totalSvcDays = daysInYears + daysInMonths + days;

  // Convert DOE string to date object
  const enrollmentDate = new Date(Date.parse(DOE));

  // Calculate sum total date by adding service bucket years to enrollment date
  const sumTotalDate = new Date(
    enrollmentDate.getTime() + svcBktYears * 365 * 24 * 60 * 60 * 1000
  );

  // Get current date
  const currentDate = new Date();

  // Calculate remaining service in milliseconds
  const remainingServiceMs = sumTotalDate.getTime() - currentDate.getTime();

  // Handle potential negative remaining service (employee served more than required)
  if (remainingServiceMs < 0) {
    return {
      message: "Employee has already served their required service time.",
    };
  }

  // Convert remaining service to days (consider rounding logic if needed)
  const remainingDays = Math.floor(remainingServiceMs / (1000 * 60 * 60 * 24));

  // Calculate remaining years, months (assuming 30 days per month)
  const remainingYears = Math.floor(remainingDays / 365);
  const remainingDaysAfterYears = remainingDays % 365;
  const remainingMonths = Math.floor(remainingDaysAfterYears / 30);
  const remainingDaysAfterMonths = remainingDaysAfterYears % 30;

  // Format remaining service string
  const remainingSvcString = `${remainingYears} years, ${remainingMonths} months, ${remainingDaysAfterMonths.toFixed(
    0
  )} days`; // Format days to 2 decimal places

  return { remainingSvcString };
}
function calculateTotalDays(totalSvcString) {
  // Regex to extract numbers
  const match = totalSvcString.match(/\d+/g);

  // Check if there's a match and all three components are present
  if (!match || match.length !== 3) {
    throw new Error("Invalid totalSvc format");
  }

  const years = parseInt(match[0]);
  const months = parseInt(match[1]);
  const days = parseInt(match[2]);

  // Conversion factors (assuming 30 days per month, can be adjusted)
  const daysInYears = years * 365;
  const daysInMonths = months * 30; // Adjust for actual month lengths if needed

  // Total days
  const totalDays = daysInYears + daysInMonths + days;

  return totalDays;
}

// Route for updating bio data (POST)
router.post(
  "/update_bio_data",
  validateToken,

  checkManagerRole,
  async (req, res) => {
    const {
      armyNo,
      rank,
      trade,
      indlName,
      CNIC,
      fatherName,
      medicalCategory,
      bdrDist,
      sect,
      martialStatus,
      qualStatus,
      bloodGp,
      clCast,
      bty_id,
      DOB,
      DOE,
      DOPR,
      TOS,
      SOS,
      civEdn,
      image,
      lve_circle_id,
      district,
    } = req.body;
    let imageFileName = "";
    const buffer = Buffer.from(image.split(",")[1], "base64");
    // Now 'buffer' contains the decoded binary data of the image

    const fileName = `${armyNo}.jpg`; // Combine armyNo with original extension
    console.log("fileName:" + fileName);
    imageFileName = "../uploads/" + fileName;
    try {
      fs.writeFileSync(imageFileName, buffer, (err) => {
        if (err) {
          console.error(err);
          // Handle errors appropriately
        } else {
          console.log("Image saved successfully!");
        }
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Error uploading image" });
    }

    // Validation (optional)
    // You can add validation for required fields here, for example:
    if (
      !armyNo ||
      !rank ||
      !trade ||
      !indlName ||
      !CNIC ||
      !fatherName ||
      !medicalCategory ||
      !bdrDist ||
      !sect ||
      !martialStatus ||
      !qualStatus ||
      !bloodGp ||
      !clCast ||
      !bty_id ||
      !DOB ||
      !DOE ||
      !DOPR ||
      !TOS ||
      !SOS ||
      !civEdn ||
      !lve_circle_id ||
      !district
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    try {
      rankName = await findRankById(rank.value);
      tradeName = await findCadreById(trade.value);
      let svcBktYears = 0;
      console.log("rankName.name: " + rankName.name);
      console.log("tradeName.name: " + tradeName.name);
      if (rankName.name == "Sep" || rankName.name == "Lnk") {
        svcBktYears = 18;
      } else if (
        rankName.name == "L/Hav" ||
        rankName.name == "Lhav" ||
        rankName.name == "Nk"
      ) {
        if (tradeName.name == "OCU") {
          svcBktYears = 20;
        } else {
          svcBktYears = 23;
        }
      } else if (rankName.name == "Hav") {
        if (tradeName.name == "OCU") {
          svcBktYears = 23;
        } else {
          svcBktYears = 26;
        }
      } else if (rankName.name == "N/Sub") {
        if (tradeName.name == "OCU") {
          svcBktYears = 26;
        } else {
          svcBktYears = 30;
        }
      } else if (rankName.name == "Sub") {
        if (tradeName.name == "OCU") {
          svcBktYears = 30;
        } else {
          svcBktYears = 32;
        }
      } else if (rankName.name == "SM") {
        svcBktYears = 34;
      }
      const totalSvcDict = calculateTotalService(DOE);
      //calculating remaining svc
      const totalSvc = totalSvcDict["totalSvc"];
      const daysRemainingDict = calculateRemainingService(
        DOE,
        totalSvc,
        svcBktYears
      );
      const remainingSvc = daysRemainingDict["remainingSvcString"];
      console.log("daysRemaining: " + remainingSvc);
      const newBioData = await updateBioDataInDatabase(armyNo, {
        Rank: rank.value,
        Trade: trade.value,
        Name: indlName,
        CNIC_Indl: CNIC,
        Father_Name: fatherName,
        Med_Cat: medicalCategory.value,
        Bdr_Dist: bdrDist,
        Sect: sect,
        Md_Unmd: martialStatus.value,
        qual_unqual: qualStatus.value,
        Blood_Gp: bloodGp,
        Cl_Cast: clCast,
        Svc_Bkt_Years: svcBktYears,
        Total_Svc: totalSvc,
        Remaining_Svc: remainingSvc,
        DOB: DOB,
        DOE: DOE,
        DOPR: DOPR,
        TOS: TOS,
        SOS: SOS,
        Civ_Edn: civEdn,
        bty_id: bty_id.value,
        image: imageFileName,
        lve_circle_id: lve_circle_id.value,
        district,
      });
      res.json({
        message: "Bio data updated successfully",
        bioData: newBioData,
      });
    } catch (error) {
      handleError(error, res);
    }
  }
);
function getImageType(buffer) {
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return "jpeg";
  } else if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47
  ) {
    return "png";
  }
  // Add more checks for other image types if necessary
  return "jpeg"; // Default to jpeg if type cannot be determined
}

// Route for getting all bio data (GET)
router.get("/bio_data_list", validateToken, async (req, res) => {
  try {
    const bioData = await getAllBioData();
    // console.log(bioData);
    const dataWithBase64Images = bioData?.map((row) => ({
      ...row,
      image: row.image
        ? `data:image/jpg;base64,${getBase64Image(row.image)}`
        : null,
    }));
    res.json({ bioData: dataWithBase64Images });
  } catch (error) {
    handleError(error, res);
  }
});
function getBase64Image(imagePath) {
  try {
    const imageData = fs.readFileSync(imagePath, "base64");
    return imageData;
  } catch (err) {
    console.error(`Error reading image: ${imagePath}`, err);
    return null; // Handle errors by returning null for the image
  }
}
// Route for deleting bio data (POST)
router.post(
  "/delete_bio_data",
  validateToken,
  checkManagerRole,
  async (req, res) => {
    const { armyNo } = req.body;

    // Check for missing fields
    if (!armyNo) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    try {
      const deleted = await deleteBioData(armyNo);
      if (deleted) {
        res.status(200).json({ message: "Bio data deleted successfully" });
      } else {
        res
          .status(404)
          .json({ message: "Bio data not found or deletion failed" });
      }
    } catch (error) {
      handleError(error, res);
    }
  }
);

module.exports = router;