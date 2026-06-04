import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },

    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "companies",
      required: true,
    },

    status: {
      type: String,
      enum: [
        "Applied",
        "Round1",
        "Round2",
        "HR",
        "Selected",
        "Rejected",
      ],
      default: "Applied",
    },
  },
  {
    timestamps: true,
  }
);

const ApplicationModel = mongoose.model(
  "applications",
  applicationSchema
);

export default ApplicationModel;