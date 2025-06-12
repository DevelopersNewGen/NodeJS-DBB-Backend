import { Schema, model } from "mongoose";

const MovementSchema = Schema({
    date: {
        type: Date,
        required: [true, "Date is required"],
        default: Date.now
    },
    amount: {
        type: Number,
        required: [true, "Amount is required"]
    },
    type: {
        type: String,
        required: [true, "Type is required"],
        enum: ["DEPOSIT", "WITHDRAWAL", "TRANSFER_IN", "TRANSFER_OUT"]
    },
    description: {
        type: String,
        default: ""
    },
    balanceAfter: {
        type: Number,
        required: [true, "Balance after movement is required"]
    },
    originAccount: {
        type: Schema.Types.ObjectId,
        ref: "Accounts",
    },
    destinationAccount: {
        type: Schema.Types.ObjectId,
        ref: "Accounts",
        default: null
    },
    status: {
    type: String,
    enum: ["COMPLETED", "REVERTED", "PENDING", "FAILED"],
    default: "COMPLETED"
    }
});

MovementSchema.methods.toJSON = function () {
    const { _id, ...movement } = this.toObject();
    movement.mid = _id;
    return movement;
};

export default model("Movements", MovementSchema);
