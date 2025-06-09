import Movements from "../movements/movements.model.js";

export const validateDepositTimeLimit = async (req, res, next) => {
    try {
        const { mid } = req.params;

        const movement = await Movements.findById(mid);
        if (!movement) {
        return res.status(404).json({ msg: "Movement not found" });
        }

        if (movement.type !== "DEPOSIT") {
        return res.status(400).json({ msg: "Only deposit movements can be updated or reverted" });
        }

        const oneHourInMs = 60 * 60 * 1000;
        const timeDiff = Date.now() - new Date(movement.date).getTime();

        if (timeDiff > oneHourInMs) {
        return res.status(403).json({ msg: "Time limit exceeded to update or revert this deposit" });
        }

        req.movement = movement;
        next();
    } catch (err) {
        res.status(500).json({ msg: "Server error", error: err.message });
    }
};
