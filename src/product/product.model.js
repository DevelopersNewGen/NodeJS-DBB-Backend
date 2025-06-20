import { Schema, model } from "mongoose";

const productSchema = Schema({
    productImg: {
        type: String
    },
    name: {
        type: String,
        required: [true, "Name is required"],
        maxLength: [35, "Name cannot exceed 35 characters"]
    },
    category: {
        type: String,
        required: true,
        enum: ["Product", "Service"]
    },
    description: {
        type: String,
        required: [true, "Description is required"],
        maxLength: [500, "Description cannot exceed 500 characters"]
    }
});

productSchema.methods.toJSON = function () {
    const { password, _id, ...product } = this.toObject();
    product.uid = _id;
    return product;
}

export default model("Product", productSchema);