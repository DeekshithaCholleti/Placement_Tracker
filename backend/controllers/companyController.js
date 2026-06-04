import CompanyModel from "../models/CompanyModel.js";
import ApplicationModel from "../models/ApplicationModel.js";
import UserModel from "../models/UserModel.js";
import checkEligibility from "../utils/eligibilityChecker.js";
import sendEmail from "../utils/sendEmail.js";
import { generateNewDriveEmail } from "../utils/emailTemplates.js";

export const addCompany = async (req, res) => {
  try {
    const company = await CompanyModel.create(req.body);

    // Asynchronously find students and send notifications to eligible candidates
    UserModel.find({ role: "student" })
      .then(async (students) => {
        const eligibleStudents = students.filter(student => checkEligibility(student, company));
        for (const student of eligibleStudents) {
          const emailContent = generateNewDriveEmail(student.name, company);
          await sendEmail(
            student.email,
            emailContent.subject,
            emailContent.text,
            emailContent.html
          );
        }
      })
      .catch(err => console.error("Error sending new drive notification emails:", err));

    res.status(201).json({
      message: "Company Added Successfully",
      company,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getAllCompanies = async (req, res) => {
  try {
    const companies = await CompanyModel.find();

    const companiesWithStats = await Promise.all(
      companies.map(async (company) => {
        const totalApplicants = await ApplicationModel.countDocuments({ companyId: company._id });
        const totalSelected = await ApplicationModel.countDocuments({ companyId: company._id, status: "Selected" });
        const totalRejected = await ApplicationModel.countDocuments({ companyId: company._id, status: "Rejected" });
        const totalApplied = await ApplicationModel.countDocuments({ companyId: company._id, status: "Applied" });
        const totalRound1 = await ApplicationModel.countDocuments({ companyId: company._id, status: "Round1" });
        const totalRound2 = await ApplicationModel.countDocuments({ companyId: company._id, status: "Round2" });
        const totalHR = await ApplicationModel.countDocuments({ companyId: company._id, status: "HR" });

        return {
          ...company.toObject(),
          totalApplicants,
          totalSelected,
          totalRejected,
          totalApplied,
          totalRound1,
          totalRound2,
          totalHR,
        };
      })
    );

    res.status(200).json(companiesWithStats);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteCompany = async (req, res) => {
  try {
    await CompanyModel.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Company Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const updateCompany = async (req, res) => {
  try {
    const updatedCompany = await CompanyModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedCompany) {
      return res.status(404).json({
        message: "Company not found",
      });
    }

    res.status(200).json({
      message: "Company Updated Successfully",
      company: updatedCompany,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};