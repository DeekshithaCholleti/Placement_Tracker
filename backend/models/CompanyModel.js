import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
    },

    package: {
      type: Number,
      required: true,
    },

    eligibilityCgpa: {
      type: Number,
      required: true,
    },

    allowedBranches: [
      {
        type: String,
      },
    ],

    driveStartDate: {
      type: Date,
      required: true,
      default: Date.now,
    },

    driveDeadline: {
      type: Date,
      required: true,
      default: function() {
        return this.driveStartDate || Date.now();
      },
    },

    description: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const CompanyModel = mongoose.model("companies", companySchema);

export default CompanyModel;