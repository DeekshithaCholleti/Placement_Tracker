const checkEligibility = (student, company) => {
  const cgpaEligible =
    student.cgpa >= company.eligibilityCgpa;

  const branchEligible =
    company.allowedBranches.includes(student.branch);

  return cgpaEligible && branchEligible;
};

export default checkEligibility;