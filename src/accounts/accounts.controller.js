import Accounts from "../accounts/accounts.model.js";
import User from "../user/user.model.js";
import Movements from "../movements/movements.model.js";
import generateAccountNumber from "../helpers/generate-account.js";

export const createAccount = async (req, res) => {
  try {
    const { uid } = req.params;
    const user = await User.findById(uid);

    if (!user || !user.status) {
      return res.status(404).json({ msg: "User not found or inactive" });
    }

    const { accountType, balance } = req.body;

    const accountNumber = generateAccountNumber();

    const newAccount = new Accounts({
      accountNumber,
      accountType,
      balance,
      user: user._id, 
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

    const accounts = await Accounts.find().populate("user", "name"); 
    res.status(200).json({
      msg: "Accounts retrieved successfully",
      accounts,
    });
  } catch (error) {
    console.error("Error al listar cuentas:", error);
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

export const getAccountRecentMovements = async (req, res) => {
  try {
    const { accountNumber } = req.body; 

    if (!accountNumber) {
      return res.status(400).json({ msg: "Account number is required" });
    }

    const account = await Accounts.findOne({ accountNumber });
    if (!account) {
      return res.status(404).json({ msg: "Account not found" });
    }

    const movements = await Movements.find({ account: account._id })
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(200).json({
      msg: "Recent movements retrieved successfully",
      movements,
    });
  } catch (error) {
    res.status(500).json({ msg: "Internal server error" });
  }
};