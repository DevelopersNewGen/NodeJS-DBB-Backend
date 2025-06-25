import User from "../user/user.model.js";
import Accounts from "../accounts/accounts.model.js";

export const checkAccountTypeExists = async (req, res, next) => {
  try {
    const user = req.usuario;
    const { accountType } = req.body;

    if (!user) {
      return res.status(400).json({ msg: "Usuario no autenticado" });
    }

    await user.populate("accounts");
    const exists = user.accounts.some(acc => acc.accountType === accountType);

    if (exists) {
      return res.status(400).json({ msg: `Ya tienes una cuenta tipo ${accountType}` });
    }

    next();
  } catch (error) {
    res.status(500).json({ msg: "Error verificando cuentas del usuario" });
  }
};