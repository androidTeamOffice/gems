const express = require("express");
const {
  addPromotionStatus,
  findPromotionStatusByArmyNo,
  findPromotionStatusById,
  updatePromotionStatus,
  deletePromotionStatus,
} = require("../models/promotionStatus"); // Assuming the file is named promotionStatus.js

const router = express.Router();

// Route for adding a new promotion status (POST)
router.post("/add_promotion_status", async (req, res) => {
  const { army_no, trade_cl, other_trade_cl, mr, estm_i, estm_ii, estm_adv, bcc, blc, jnc, pc, jncoc, jnac, fceic, commic, ogmic, jnmt, jnbic, jlc, jla, snc, allc,
    adm_course, qual_course, other_adventure_course, lacking_cl, qual_unqual, financial_disc, ere_att_dates, red_ink_entry, indl_sign, date_prom_postinf_sos,
    unit_comd_sign, } = req.body; // Destructuring all fields

  try {
    await addPromotionStatus({
      army_no, trade_cl, other_trade_cl, mr, estm_i, estm_ii, estm_adv, bcc, blc, jnc, pc, jncoc, jnac, fceic, commic, ogmic, jnmt,
      jnbic, jlc, jla, snc, allc, adm_course, qual_course, other_adventure_course, lacking_cl, qual_unqual, financial_disc, ere_att_dates, red_ink_entry,
      indl_sign, date_prom_postinf_sos, unit_comd_sign,
    });
    res.json({ message: "Promotion status added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding promotion status" });
  }
}
);

// Route for getting promotion status by army No (POST)
router.post("/promotion_status_by_army_no", async (req, res) => {
  const { armyNo } = req.body;

  try {
    const promotionStatus = await findPromotionStatusByArmyNo(armyNo);
    if (promotionStatus) {
      res.json({ promotionStatus });
    } else {
      res.status(404).json({ message: "Promotion status not found for army No: " + armyNo });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error finding promotion status" });
  }
}
);

// Route for getting promotion status by ID (POST)
router.post("/promotion_status_by_id", async (req, res) => {
  const { id } = req.body;

  try {
    const promotionStatus = await findPromotionStatusById(id);
    if (promotionStatus) {
      res.json({ promotionStatus });
    } else {
      res.status(404).json({ message: "Promotion status not found with id: " + id });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error finding promotion status" });
  }
}
);

// Route for updating promotion status (POST)
router.post("/update_promotion_status", async (req, res) => {
  const { id, army_no, trade_cl, other_trade_cl, mr, estm_i, estm_ii, estm_adv, bcc, blc, jnc, pc, jncoc, jnac, fceic, commic, ogmic, jnmt, jnbic, jlc, jla, snc, allc,
    adm_course, qual_course, other_adventure_course, lacking_cl, qual_unqual, financial_disc, ere_att_dates, red_ink_entry, indl_sign, date_prom_postinf_sos,
    unit_comd_sign, } = req.body;

  // Check for missing fields
  if (!id || !army_no || !trade_cl || !other_trade_cl || !mr || !estm_i || !estm_ii || !estm_adv || !bcc || !blc || !jnc || !pc ||
    !jncoc || !jnac || !fceic || !commic || !ogmic || !jnmt || !jnbic || !jlc || !jla || !snc || !allc || !adm_course || !qual_course || !other_adventure_course
    || !lacking_cl || !qual_unqual || !financial_disc || !ere_att_dates || !red_ink_entry || !indl_sign || !date_prom_postinf_sos || !unit_comd_sign) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    await updatePromotionStatus(id, {
      army_no, trade_cl, other_trade_cl, mr, estm_i, estm_ii, estm_adv, bcc, blc, jnc, pc, jncoc, jnac,
      fceic, commic, ogmic, jnmt, jnbic, jlc, jla, snc, allc, adm_course, qual_course, other_adventure_course, lacking_cl, qual_unqual,
      financial_disc, ere_att_dates, red_ink_entry, indl_sign, date_prom_postinf_sos, unit_comd_sign,
    });
    res.json({ message: "Promotion status updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating promotion status" });
  }
}
);

// Route for deleting promotion status (POST)
router.post("/delete_promotion_status", async (req, res) => {
  const { id } = req.body;

  // Check for missing fields
  if (!id) {
    return res.status(400).json({ message: "Missing required field: id" });
  }

  try {
    const deleted = await deletePromotionStatus(id);
    if (deleted) {
      res.status(200).json({ message: "Promotion status deleted successfully" });
    } else {
      res.status(404).json({ message: "Promotion status not found or deletion failed" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting promotion status" });
  }
}
);

module.exports = router;
