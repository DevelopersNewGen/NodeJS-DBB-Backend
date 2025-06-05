import User from "../user/user.model.js"

export const createUser = async (req, res) => {
    try {
        const {
            name,
            username,
            dpi,
            address,
            cellphone,
            email,
            password,
            jobName,
            monthlyIncome
        } = req.body;

        const newUser = new User({
            name,
            username,
            accountNumber,
            dpi,
            address,
            cellphone,
            email,
            password,
            jobName,
            monthlyIncome
        });

        await newUser.save();

        res.status(201).json({
            msg: "User created successfully",
            user: newUser
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: "An error occurred while creating the user",
            error: error.message
        });
    }
};