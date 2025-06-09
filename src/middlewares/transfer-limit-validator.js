import Movements from "../movements/movements.model.js";

export const validateTransferLimits = async (req, res, next) => {
    try {
        const { amount, originAccount } = req.body;

        if (amount > 2000) {
        return res.status(400).json({ msg: "Transfer amount exceeds the Q2000 limit per transaction" });
        }
        

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const todayTransfers = await Movements.find({
        originAccount,
        type: "TRANSFER",
        date: { $gte: today, $lt: tomorrow }
        });

        const totalAmountToday = todayTransfers.reduce((sum, m) => sum + m.amount, 0);

        if (totalAmountToday + amount > 10000) {
        return res.status(400).json({ msg: "Daily transfer limit of Q10,000 exceeded" });
        }

        next();
    } catch (err) {
        res.status(500).json({ msg: "Server error", error: err.message });
    }
};
