import { Schema, model } from "mongoose";

const accountsSchema = Schema({
  accountNumber: {
    type: String,
    required: [true, "Account number is required"],
    unique: true,
  },
  balance: {
    type: Number,
    required: [true, "Balance is required"],
    default: 0,
  },
  accountType: {
    type: String,
    required: [true, "Account type is required"],
    enum: ["MONETARY", "SAVER", "OTHER"],
  },
  status: {
    type: Boolean,
    default: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User is required"],
  },
});

accountsSchema.methods.toJSON = function () {
  const { _id, ...account } = this.toObject();
  account.uid = _id;
  return account;
};

export default model("Accounts", accountsSchema);
