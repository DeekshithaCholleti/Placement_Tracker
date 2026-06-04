import ApplicationModel from "../models/ApplicationModel.js";
import CompanyModel from "../models/CompanyModel.js";
import UserModel from "../models/UserModel.js";

import checkEligibility from "../utils/eligibilityChecker.js";
import sendEmail from "../utils/sendEmail.js";
import { generateStatusUpdateEmail } from "../utils/emailTemplates.js";

export const applyCompany = async (req, res) => {
  try {
    const student = await UserModel.findById(req.user.id);

    const company = await CompanyModel.findById(
      req.params.companyId
    );

    if (!company) {
      return res.status(404).json({
        message: "Company Not Found",
      });
    }

    const alreadyApplied =
      await ApplicationModel.findOne({
        studentId: student._id,
        companyId: company._id,
      });

    if (alreadyApplied) {
      return res.status(400).json({
        message: "Already Applied",
      });
    }

    const now = new Date();
    if (company.driveStartDate && now < new Date(company.driveStartDate)) {
      return res.status(400).json({
        message: "Registration for this placement drive has not started yet",
      });
    }

    if (company.driveDeadline && now > new Date(company.driveDeadline)) {
      return res.status(400).json({
        message: "Application deadline for this placement drive has passed",
      });
    }

    const eligible = checkEligibility(student, company);

    if (!eligible) {
      return res.status(400).json({
        message: "You are not eligible",
      });
    }

    const application = await ApplicationModel.create({
      studentId: student._id,
      companyId: company._id,
    });

    // Send confirmation email asynchronously to not block response
    const emailContent = generateStatusUpdateEmail(
      student.name,
      company.companyName,
      "Applied"
    );
    sendEmail(
      student.email,
      `[Application Received] Confirmation for ${company.companyName}`,
      emailContent.text,
      emailContent.html
    ).catch(err => console.error("Error sending application confirmation email:", err));

    res.status(201).json({
      message: "Applied Successfully",
      application,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const myApplications = async (req, res) => {
  try {
    const applications = await ApplicationModel.find({
      studentId: req.user.id,
    })
      .populate("companyId")
      .populate("studentId", "-password");

    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const companyApplicants = async (req, res) => {
  try {
    const applications = await ApplicationModel.find({
      companyId: req.params.companyId,
    })
      .populate("studentId", "-password")
      .populate("companyId");

    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const updateApplicationStatus = async (
  req,
  res
) => {
  try {
    const { status } = req.body;

    const application =
      await ApplicationModel.findByIdAndUpdate(
        req.params.applicationId,
        { status },
        { new: true }
      )
        .populate("studentId")
        .populate("companyId");

    const emailContent = generateStatusUpdateEmail(
      application.studentId.name,
      application.companyId.companyName,
      status
    );

    await sendEmail(
      application.studentId.email,
      emailContent.subject,
      emailContent.text,
      emailContent.html
    );

    res.status(200).json({
      message: "Application Status Updated",
      application,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};