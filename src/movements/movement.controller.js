import Accounts from "../accounts/accounts.model.js"
import Movements from "./movements.model.js"
import User from "../user/user.model.js"

export const makeTransfer = async (req, res) => {
    try {
        const originAccountNumber = req.params.originAccount; 
        const { destinationAccount, amount, description = "" } = req.body;
        const { usuario } = req;

        if (!destinationAccount)
            return res.status(400).json({ msg: "Destination account is required" });

        if (amount <= 0)
            return res.status(400).json({ msg: "Amount must be greater than zero" });

        const origin = await Accounts.findOne({ accountNumber: originAccountNumber });
        if (!origin)
            return res.status(404).json({ msg: "Origin account not found" });

        if (!origin.status)
            return res.status(400).json({ msg: "Origin account is inactive" });

        const ownsAccount = usuario.accounts.some(
            (accId) => accId?.toString() === origin._id.toString()
        );
        if (!ownsAccount)
            return res.status(403).json({ msg: "You do not own the origin account" });

        const destination = await Accounts.findOne({ accountNumber: destinationAccount });
        if (!destination || !destination.status)
            return res.status(404).json({ msg: "Destination account not found or inactive" });

        if (origin.balance < amount)
            return res.status(400).json({ msg: "Insufficient funds" });

        origin.balance = Number((origin.balance - amount).toFixed(2));
        await origin.save();

        destination.balance = Number((destination.balance + amount).toFixed(2));
        await destination.save();

        const withdrawalMovement = new Movements({
            originAccount: origin._id,
            destinationAccount: destination._id,
            amount,
            type: "TRANSFER_OUT",
            description,
            balanceAfter: origin.balance,
        });
        await withdrawalMovement.save();

        const depositMovement = new Movements({
            originAccount: origin._id,
            destinationAccount: destination._id,
            amount,
            type: "TRANSFER_IN",
            description,
            balanceAfter: destination.balance,
        });
        await depositMovement.save();

        return res.status(201).json({
            msg: "Transfer completed successfully",
            withdrawal: withdrawalMovement,
            deposit: depositMovement,
            newBalanceOrigin: origin.balance,
            newBalanceDestination: destination.balance,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: "Server error", error: err.message });
    }
};

export const makeDeposit = async (req, res) => {
    try {
        const { destinationAccount, amount, description = "" } = req.body;

        if (!destinationAccount)
            return res.status(400).json({ msg: "Destination account is required" });

        const numericAmount = parseFloat(amount);

        if (isNaN(numericAmount) || numericAmount <= 0)
            return res.status(400).json({ msg: "Amount must be a valid number greater than zero" });

        const account = await Accounts.findOne({ accountNumber: destinationAccount });
        if (!account?.status)
            return res.status(404).json({ msg: "Destination account not found or inactive" });

        account.balance = Math.round((account.balance + numericAmount) * 100) / 100;
        await account.save();

        const depositMovement = new Movements({
            originAccount: null,
            destinationAccount: account._id, 
            amount: numericAmount,
            type: "DEPOSIT",
            description,
            balanceAfter: account.balance,
        });

        await depositMovement.save();

        res.status(201).json({
            msg: "Deposit completed successfully",
            deposit: depositMovement,
            newBalance: account.balance,
        });
    } catch (err) {
        res.status(500).json({
            msg: "Server error",
            error: err.message,
        });
    }
};

export const makeWithdrawal = async (req, res) => {
    try {
        const { accountNumber, amount, description = "" } = req.body;

        if (!accountNumber)
            return res.status(400).json({ msg: "Account number is required" });

        const numericAmount = parseFloat(amount);
        if (isNaN(numericAmount) || numericAmount <= 0)
            return res.status(400).json({ msg: "Amount must be a valid number greater than zero" });

        const account = await Accounts.findOne({ accountNumber });
        if (!account?.status)
            return res.status(404).json({ msg: "Account not found or inactive" });

        if (account.balance < numericAmount)
            return res.status(400).json({ msg: "Insufficient funds" });

        account.balance = Math.round((account.balance - numericAmount) * 100) / 100;
        await account.save();

        const withdrawalMovement = new Movements({
            originAccount: account._id,
            destinationAccount: null,
            amount: numericAmount,
            type: "WITHDRAWAL",
            description,
            balanceAfter: account.balance,
        });

        await withdrawalMovement.save();

        res.status(201).json({
            msg: "Withdrawal completed successfully",
            withdrawal: withdrawalMovement,
            newBalance: account.balance,
        });
    } catch (err) {
        res.status(500).json({ msg: "Server error", error: err.message });
    }
};

export const updateDepositAmount = async (req, res) => {
    try {
        const { newAmount } = req.body;
        const movement = req.movement;

        if (newAmount <= 0)
        return res.status(400).json({ msg: "Amount must be greater than zero" });

        const account = await Accounts.findById(movement.destinationAccount);
        if (!account?.status)
        return res.status(404).json({ msg: "Destination account not found or inactive" });

        account.balance -= movement.amount;

        account.balance += newAmount;

        movement.amount = newAmount;
        movement.balanceAfter = account.balance;

        await Promise.all([account.save(), movement.save()]);

        res.status(200).json({
        msg: "Deposit amount updated successfully",
        updatedMovement: movement,
        newBalance: account.balance
        });
    } catch (err) {
        res.status(500).json({ msg: "Server error", error: err.message });
    }
};

export const revertDepositAmount = async (req, res) => {
    try {
        const { mid } = req.params;

        const movement = await Movements.findById(mid);
        if (!movement || movement.type !== "DEPOSIT" || movement.status === "REVERTED") {
        return res.status(400).json({ msg: "Invalid or already reverted deposit" });
        }

        const account = await Accounts.findById(movement.destinationAccount);
        if (!account) {
        return res.status(404).json({ msg: "Destination account not found" });
        }

        account.balance = Math.round((account.balance - movement.amount) * 100) / 100;

        movement.status = "REVERTED";
        movement.balanceAfter = account.balance;

        await Promise.all([account.save(), movement.save()]);

        res.status(200).json({
        msg: "Deposit reverted successfully",
        revertedMovement: movement,
        newBalance: account.balance,
        });
    } catch (err) {
        res.status(500).json({ msg: "Server error", error: err.message });
    }
};

export const getAccountMovements = async (req, res) => {
    try {
        const { accountId } = req.params;
        const { limit = 10, from = 0 } = req.query;

        const query = {
        $or: [
            { originAccount: accountId },
            { destinationAccount: accountId }
        ]
        };

        const [total, movements] = await Promise.all([
        Movements.countDocuments(query),
        Movements.find(query)
            .skip(Number(from))
            .limit(Number(limit))
            .sort({ createdAt: -1 })
            .populate("originAccount", "accountNumber accountType")
            .populate("destinationAccount", "accountNumber accountType")
        ]);

        return res.status(200).json({
        success: true,
        total,
        movements
        });
    } catch (err) {
        res.status(500).json({
        success: false,
        msg: "Error fetching account movements",
        error: err.message
        });
    }
};

export const getTopMovements = async (req, res) => {
    try {
        const aggregated = await Movements.aggregate([
        {
            $facet: {
            origins: [
                { $match: { originAccount: { $ne: null } } },
                { $group: { _id: "$originAccount", count: { $sum: 1 } } }
            ],
            destinations: [
                { $match: { destinationAccount: { $ne: null } } },
                { $group: { _id: "$destinationAccount", count: { $sum: 1 } } }
            ]
            }
        },
        {
            $project: {
            combined: {
                $concatArrays: ["$origins", "$destinations"]
            }
            }
        },
        { $unwind: "$combined" },
        {
            $group: {
            _id: "$combined._id",
            totalMovements: { $sum: "$combined.count" }
            }
        },
        { $sort: { totalMovements: -1 } },
        { $limit: 5 }
        ]);

        const topAccounts = await Promise.all(
        aggregated.map(async (item) => {
            const account = await Accounts.findById(item._id).lean();
            const user = await User.findOne({ accounts: account._id })
            .select("name email username")
            .lean();

            return {
            account,
            owner: user || null,
            totalMovements: item.totalMovements
            };
        })
        );

        res.status(200).json({ topAccounts });
    } catch (err) {
        res.status(500).json({ msg: "Server error", error: err.message });
    }
};

export const getMyRecentMovements = async (req, res) => {
    try {
        const { aid } = req.params;
        const usuario = req.usuario;

        const ownsAccount = usuario.accounts
        .filter(accId => accId)
        .some(accId => accId.toString() === aid.toString());

        if (!ownsAccount) {
        return res.status(403).json({ msg: "You do not own this account" });
        }

        const recentMovements = await Movements.find({
        $or: [
            { originAccount: aid },
            { destinationAccount: aid }
        ]
        })
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("originAccount", "accountNumber accountType balance")
        .populate("destinationAccount", "accountNumber accountType balance");

        return res.status(200).json({
        total: recentMovements.length,
        movements: recentMovements
        });

    } catch (err) {
        return res.status(500).json({ msg: "Server error", error: err.message });
    }
};


