import User from "../user/user.model.js";

export const emailExists = async (email = "") => {
  const existe = await User.findOne({ email });
  if (existe) {
    throw new Error(`The email ${email} is already registered`);
  }
};

export const userExists = async (uid = " ") => {
  const existe = await User.findById(uid);
  if (!existe) {
    throw new Error("The user does not exist");
  }
};

export const dpiExists = async (dpi = "") => {
  const existe = await User.findOne({ dpi });
  if (existe) {
    throw new Error(`The DPI ${dpi} is already registered`);
  }
};

export const usernameExists = async (username = "") => {
  const existe = await User.findOne({ username });
  if (existe) {
    throw new Error(`The username ${username} is already taken`);
  }
};

export const validateMonthlyIncome = async (monthlyIncome = 0) => {
  if (monthlyIncome < 100) {
    throw new Error("Monthly income must be greater than Q100");
  }
};

export const isClient = async (uid = " ") => {
  const existe = await User.findById(uid);
  if (!existe) {
    throw new Error("The client does not exist");
  }

  if (existe.role !== "CLIENT_ROLE") {
    throw new Error("Is not a client");
  }
};
