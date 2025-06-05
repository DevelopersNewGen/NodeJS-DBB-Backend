import cloudinary from "../../configs/cloudinary.js";

export const uploadImage = async (file, folder) => {
    try {
        if (!file || !file.path) {
            throw new Error("Archivo no válido para subir");
        }

        const { secure_url } = await cloudinary.uploader.upload(file.path, {
            folder: folder,
            use_filename: true,
            unique_filename: false,
        });

        return {secure_url};
    } catch (error) {
        throw new Error("Error al subir la imagen: " + error.message);
    }
};