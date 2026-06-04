import UserModel from "../models/UserModel.js";
import CompanyModel from "../models/CompanyModel.js";
import ApplicationModel from "../models/ApplicationModel.js";

export const dashboardStats = async (req, res) => {
  try {
    const students = await UserModel.find({ role: "student" });
    const totalStudents = students.length;

    const companies = await CompanyModel.find();
    const totalCompanies = companies.length;

    const allApplications = await ApplicationModel.find()
      .populate("studentId")
      .populate("companyId");
    
    const totalApplications = allApplications.length;

    // Filter selected applications
    const selectedApplications = allApplications.filter(app => app.status === "Selected");
    
    // Placed students (unique students with at least one "Selected" application)
    const placedStudentIds = new Set(selectedApplications.map(app => app.studentId?._id?.toString()).filter(Boolean));
    const placedStudentsCount = placedStudentIds.size;

    const placementPercentage = totalStudents > 0 
      ? Number(((placedStudentsCount / totalStudents) * 100).toFixed(1))
      : 0;

    // Package analytics for placed students
    let highestPackage = 0;
    let lowestPackage = 0;
    let averagePackage = 0;

    if (selectedApplications.length > 0) {
      const packages = selectedApplications
        .map(app => app.companyId?.package)
        .filter(p => p != null && !isNaN(p));
      
      if (packages.length > 0) {
        highestPackage = Math.max(...packages);
        lowestPackage = Math.min(...packages);
        const sum = packages.reduce((a, b) => a + b, 0);
        averagePackage = Number((sum / packages.length).toFixed(1));
      }
    }

    // Department-wise stats
    const branches = [...new Set(students.map(s => s.branch).filter(Boolean))].sort();
    const departmentStats = branches.map(branch => {
      const deptStudents = students.filter(s => s.branch === branch);
      const totalDeptStudents = deptStudents.length;
      
      const deptSelectedStudents = deptStudents.filter(s => placedStudentIds.has(s._id.toString()));
      const selectedDeptCount = deptSelectedStudents.length;

      const deptPlacementPercentage = totalDeptStudents > 0
        ? Number(((selectedDeptCount / totalDeptStudents) * 100).toFixed(1))
        : 0;

      // Calculate department-specific package stats
      const deptSelectedApps = selectedApplications.filter(app => app.studentId?.branch === branch);
      let deptHighestPackage = 0;
      let deptLowestPackage = 0;
      let deptAveragePackage = 0;

      if (deptSelectedApps.length > 0) {
        const deptPackages = deptSelectedApps
          .map(app => app.companyId?.package)
          .filter(p => p != null && !isNaN(p));
        
        if (deptPackages.length > 0) {
          deptHighestPackage = Math.max(...deptPackages);
          deptLowestPackage = Math.min(...deptPackages);
          const sum = deptPackages.reduce((a, b) => a + b, 0);
          deptAveragePackage = Number((sum / deptPackages.length).toFixed(1));
        }
      }

      return {
        branch,
        totalStudents: totalDeptStudents,
        placedStudents: selectedDeptCount,
        placementPercentage: deptPlacementPercentage,
        highestPackage: deptHighestPackage,
        lowestPackage: deptLowestPackage,
        averagePackage: deptAveragePackage
      };
    });

    // Company-wise stats
    const companyStatsMap = {};
    companies.forEach(company => {
      companyStatsMap[company._id.toString()] = {
        companyName: company.companyName,
        appliedCount: 0,
        selectedCount: 0
      };
    });

    allApplications.forEach(app => {
      const companyIdStr = app.companyId?._id?.toString();
      if (companyIdStr && companyStatsMap[companyIdStr]) {
        companyStatsMap[companyIdStr].appliedCount += 1;
        if (app.status === "Selected") {
          companyStatsMap[companyIdStr].selectedCount += 1;
        }
      }
    });

    const companyStats = Object.values(companyStatsMap);

    // Package distribution ranges: < 5, 5 - 10, 10 - 15, 15+ LPA
    const ranges = {
      "< 5 LPA": 0,
      "5 - 10 LPA": 0,
      "10 - 15 LPA": 0,
      "15+ LPA": 0
    };

    selectedApplications.forEach(app => {
      const p = app.companyId?.package;
      if (p != null) {
        if (p < 5) ranges["< 5 LPA"] += 1;
        else if (p >= 5 && p < 10) ranges["5 - 10 LPA"] += 1;
        else if (p >= 10 && p < 15) ranges["10 - 15 LPA"] += 1;
        else if (p >= 15) ranges["15+ LPA"] += 1;
      }
    });

    const packageDistribution = Object.keys(ranges).map(key => ({
      range: key,
      count: ranges[key]
    }));

    res.status(200).json({
      totalStudents,
      totalCompanies,
      totalApplications,
      selectedStudents: placedStudentsCount, // Matches legacy key but represents unique placed count
      placementPercentage,
      highestPackage,
      lowestPackage,
      averagePackage,
      departmentStats,
      companyStats,
      packageDistribution
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getAllApplications = async (req, res) => {
  try {
    const applications = await ApplicationModel.find()
      .populate("studentId", "-password")
      .populate("companyId")
      .sort({ createdAt: -1 });

    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getSelectedStudents = async (req, res) => {
  try {
    const applications = await ApplicationModel.find({ status: "Selected" })
      .populate("studentId", "-password")
      .populate("companyId")
      .sort({ updatedAt: -1 });

    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};