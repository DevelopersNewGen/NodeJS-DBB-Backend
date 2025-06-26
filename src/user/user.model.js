import { Schema, model } from "mongoose";

const userSchema = Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        maxLength: [35, "Name cannot exceed 35 characters"]
    },
    username: {
        type: String,
        required: [true, "Username is required"],
        unique: true,
        maxLength: [20, "Username cannot exceed 20 characters"]
    },
    accounts: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Accounts'
        }
    ],
    dpi: {
        type: String,
        required: [true, "DPI is required"],
        unique: true
    },
    address: {
        type: String,
        required: [true, "Address is required"]
    },
    cellphone: {
        type: String,
        required: [true, "Cellphone is required"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "Password is required"]
    },
    jobName: {
        type: String,
        required: [true, "Job name is required"]
    },
    monthlyIncome: {
        type: Number,
        required: [true, "Monthly income is required"]
    },
    role: {
        type: String,
        required: true,
        default: "CLIENT_ROLE",
        enum: ["ADMIN_ROLE", "CLIENT_ROLE"]
    },
    favs: [
        {
            accountNumber: {
                type: String,
                required: true
            },
            alias: {
                type: String,
                required: false
            }
        }
    ],
    status: {
        type: Boolean,
        default: true
    }
});

userSchema.methods.toJSON = function () {
    const { password, _id, ...usuario } = this.toObject();
    usuario.uid = _id;
    return usuario;
}

export default model("User", userSchema);