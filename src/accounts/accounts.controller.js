import Accounts from "../accounts/accounts.model.js";
import User from "../user/user.model.js";
import generateAccountNumber from "../helpers/generate-account.js";

export const createAccount = async (req, res) => {
  try {
    const user = req.usuario;

    if (!user || !user.status) {
      return res.status(404).json({ msg: "User not found or inactive" });
    }

    const { accountType, balance } = req.body;

    const accountNumber = generateAccountNumber();

    const newAccount = new Accounts({
      accountNumber,
      accountType,
      balance,
    });

    await newAccount.save();

    if (!user.accounts) user.accounts = [];
    user.accounts.push(newAccount.id);
    await user.save();

    res.status(201).json({
      msg: "Account created successfully",
      account: newAccount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

export const listAccounts = async (req, res) => {
  try {
    const accounts = await Accounts.find();
    res.status(200).json({
      msg: "Accounts retrieved successfully",
      accounts,
    });
  } catch (error) {
    res.status(500).json({ msg: "Internal server error" });
  }
};

export const listAccountsByUser = async (req, res) => {
  try {
    const { uid } = req.params;
    const user = await User.findById(uid).populate("accounts");
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    res.status(200).json({
      msg: "Accounts retrieved successfully",
      accounts: user.accounts, 
      name: user.name,         
    });
  } catch (error) {
    res.status(500).json({ msg: "Internal server error" });
  }
};

export const getAccountById = async (req, res) => {
  try {
    const { aid } = req.params;
    const account = await Accounts.findById(aid);
    if (!account) {
      return res.status(404).json({ msg: "Account not found" });
    }
    res.status(200).json({
      msg: "Account retrieved successfully",
      account,
    });
  } catch (error) {
    res.status(500).json({ msg: "Internal server error" });
  }
};
