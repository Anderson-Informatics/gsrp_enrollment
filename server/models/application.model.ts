import mongoose from "mongoose";

const childSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    middleName: { type: String },
    lastName: { type: String, required: true },
    dob: { type: String, required: true },
    gender: { type: String, required: true },
    language: { type: String, required: true },
    languageOther: { type: String },
  },
  { _id: false }
);

const addressSchema = new mongoose.Schema(
  {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zip: { type: String, required: true },
  },
  { _id: false }
);

const householdSchema = new mongoose.Schema(
  {
    responsibleCount: { type: Number, required: true, min: 1 },
    incomeAmount: { type: Number, required: true, min: 0 },
    incomeFrequency: { type: String, required: true },
  },
  { _id: false }
);

const guardianSchema = new mongoose.Schema(
  {
    firstName: { type: String },
    lastName: { type: String },
    phone: { type: String },
    email: { type: String },
  },
  { _id: false }
);

const schoolSchema = new mongoose.Schema(
  {
    firstChoice: { type: String, required: true },
    secondChoice: { type: String, required: true },
  },
  { _id: false }
);

const siblingsSchema = new mongoose.Schema(
  {
    atSelection: { type: String, required: true },
    nameAndSchool: { type: String },
  },
  { _id: false }
);

const referralSchema = new mongoose.Schema(
  {
    selected: { type: [String], default: [] },
    otherText: { type: String },
  },
  { _id: false }
);

const applicationSchema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      auto: true,
    },
    child: { type: childSchema, required: true },
    address: { type: addressSchema, required: true },
    household: { type: householdSchema, required: true },
    pg1: {
      type: guardianSchema,
      required: true,
      // enforce required fields for pg1
      validate: {
        validator: (v: any) => v && v.firstName && v.lastName && v.phone && v.email,
        message: "Primary parent/guardian (pg1) must include firstName, lastName, phone, and email",
      },
    },
    pg2: { type: guardianSchema },
    school: { type: schoolSchema, required: true },
    siblings: { type: siblingsSchema, required: true },
    referral: { type: referralSchema },
  },
  { timestamps: true }
);

export default mongoose.model("Application", applicationSchema);