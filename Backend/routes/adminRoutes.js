const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin')
const bcrypt = require("bcrypt");
const memberModel = require('../models/Member');
const { assignRole } = require('../controllers/memberController')
const Setting = require('../models/Settings')
const { generateToken } = require("../utils/generateToken");
const { ensureAuthenticated } = require("../middlewares/auth");


router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    // ❌ Check if any admin already exists
    const adminCount = await Admin.countDocuments();
    if (adminCount > 0) {
      return res.status(403).json({ message: 'Admin already exists. Only one admin allowed.' });
    }

    // ✅ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Create new admin
    const newAdmin = new Admin({ email, password: hashedPassword });
    await newAdmin.save();

    res.status(201).json({ message: 'Admin registered successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/api/members', ensureAuthenticated, async (req, res) => {
  try {
    const members = await memberModel.find();

    // No need to convert to base64; directly return image URL
    const membersWithImageUrls = members.map((member) => ({
      ...member._doc,
      image: member.image || null, // Cloudinary URL or null
    }));

    // Sort members by role: president, treasurer, secretary, member
    const roleOrder = ['president', 'treasurer', 'secretary', 'member'];

    const sortedMembers = membersWithImageUrls.sort((a, b) => {
      const roleA = a.role ? roleOrder.indexOf(a.role.toLowerCase()) : roleOrder.length;
      const roleB = b.role ? roleOrder.indexOf(b.role.toLowerCase()) : roleOrder.length;
      return roleA - roleB;
    });

    res.status(200).json(sortedMembers);
  } catch (error) {
    console.error('❌ Error fetching members:', error);
    res.status(500).json({ error: 'Failed to fetch members' });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: "Incorrect email or password" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect email or password" });
    }

    const token = generateToken(admin);

    res.cookie("token", token)
      .status(200)
      .json({ message: "Login successful", admin: { id: admin._id, email: admin.email } });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

router.get("/settings", ensureAuthenticated, async (req, res) => {
  try {
    const setting = await Setting.findOne();
    res.json({ success: true, setting });
  } catch (err) {
    console.error("Error fetching settings:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.post("/settings/update", ensureAuthenticated, async (req, res) => {
  let monthlyContributionAmount = Number(req.body.monthlyContributionAmount);
  let dueDate = Number(req.body.dueDate);
  let penaltyAmount = Number(req.body.penaltyAmount);
  let loanInterestRate = Number(req.body.loanInterestRate);

  // ✅ Validate Inputs
  if (isNaN(monthlyContributionAmount) || monthlyContributionAmount <= 0) {
    return res.status(400).json({ success: false, message: "Invalid contribution amount!" });
  }

  if (isNaN(dueDate) || dueDate < 1 || dueDate > 31) {
    return res.status(400).json({ success: false, message: "Invalid due date! Must be between 1 and 31." });
  }

  if (isNaN(penaltyAmount) || penaltyAmount < 0) {
    return res.status(400).json({ success: false, message: "Invalid penalty amount!" });
  }

  if (isNaN(loanInterestRate) || loanInterestRate < 0) {
    return res.status(400).json({ success: false, message: "Invalid loan interest rate!" });
  }

  try {
    let setting = await Setting.findOne();
    if (setting) {
      setting.monthlyContributionAmount = monthlyContributionAmount;
      setting.dueDate = dueDate;
      setting.penaltyAmount = penaltyAmount;
      setting.loanInterestRate = loanInterestRate;
    } else {
      setting = new Setting({ monthlyContributionAmount, dueDate, penaltyAmount, loanInterestRate });
    }

    await setting.save();
    res.json({ success: true, message: "Settings updated successfully!" });

  } catch (error) {
    console.error("Error updating settings:", error);
    res.status(500).json({ success: false, message: "Something went wrong while saving settings." });
  }
});

router.delete("/api/members/:id", ensureAuthenticated, async (req, res) => {
  try {
    const memberId = req.params.id;
    const deletedMember = await memberModel.findByIdAndDelete(memberId);

    if (!deletedMember) {
      return res.status(404).json({ success: false, message: "Member not found." });
    }

    res.status(200).json({ success: true, message: "Member deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error deleting member." });
  }
});

router.post("/assign-role", ensureAuthenticated, async (req, res) => {
  const { memberId, role } = req.body;

  if (!["president", "treasurer", "secretary", "member"].includes(role)) {
    return res.status(400).json({
      success: false,
      message: "Invalid role!",
    });
  }

  try {
    // If the role being assigned is one of president, treasurer, or secretary,
    // first check if anyone else has the same role and reset them to "member"
    if (role !== "member") {
      // Find a member with the same role and update their role to "member"
      const existingMemberWithRole = await memberModel.findOne({ role });

      if (existingMemberWithRole) {
        await memberModel.findByIdAndUpdate(existingMemberWithRole._id, { role: "member" });
      }
    }

    // Now update the selected member's role
    await memberModel.findByIdAndUpdate(memberId, { role }, { new: true });

    res.json({
      success: true,
      message: "Role updated successfully!",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating role!",
    });
  }
});

router.get('/updateprofile', ensureAuthenticated, async (req, res) => {
  try {
    const admin = await Admin.findOne({ _id: req.memberId });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    res.json({ admin }); // Send admin data as JSON for React
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/edit-profile", ensureAuthenticated, async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const updateData = { email };

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    await Admin.findOneAndUpdate({}, updateData);

    res.json({ success: true, message: "Profile updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error, please try again" });
  }
});

router.get('/api/logout', ensureAuthenticated, (req, res) => {
  res.clearCookie('token');
  res.status(200).json({ message: 'Logout successful' });
});

module.exports = router;