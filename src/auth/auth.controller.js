import { verify } from "argon2"
import User from "../user/user.model.js";
import { generateJWT } from "../helpers/generate-jwt.js";

export const login = async (req, res) => {
    try {
        const { emailOrUsername, password } = req.body;

        const acces = await User.findOne({
            $or: [
                { email: emailOrUsername }, 
                { username: emailOrUsername } 
            ],
            status: true
        });

        if (!acces) {
            return res.status(400).json({
                success: false,
                message: "Invalid credential",
                error: "There is no user with the entered email or username"
            });
        }

        const validatorPassword = await verify(acces.password, password);

        if (!validatorPassword) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials",
                error: "The password is incorrect"
            });
        }

        const webToken = await generateJWT(acces.id);

        return res.status(200).json({
            success: true,
            message: "Login successful",
            userDetails: {
                email: acces.email,
                username: acces.username,
                img: acces.profilePicture,
                token: webToken
            }
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Login failed, server error",
            error: err.message
        });
    }
};