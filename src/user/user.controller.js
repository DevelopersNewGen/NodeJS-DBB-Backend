import User from "../user/user.model.js"
import {hash, verify} from "argon2"

export const createUser = async (req, res) => {
    try {
        const {name, username, dpi, address, cellphone, email, password, jobName, monthlyIncome} = req.body;

        const hashedPassword = await hash(password);

        const newUser = new User({name, username, dpi, address, cellphone, email, password: hashedPassword,
        jobName, monthlyIncome});

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

export const getUsers = async (req, res) => {
    try {
        const users = await User.find({}, "-password");  

        if (!users.length) {
            return res.status(404).json({
                success: false,
                message: "No users found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Users retrieved successfully",
            users
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve users",
            error: err.message
        });
    }
};

export const getUserById = async (req, res) => {
    try {
        const { uid } = req.params;  

        const user = await User.findById(uid);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "User retrieved successfully",
            user
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve user",
            error: err.message
        });
    }
};

//USUARIO
export const updateUser = async (req, res) => {
    try {
        const { usuario } = req;  
        const { username, email, address, cellphone, jobName, monthlyIncome } = req.body;

        const updatedUser = await User.findByIdAndUpdate(usuario._id, {$set:{username, email, address,
        cellphone, jobName, monthlyIncome}}, { new: true, runValidators: true });

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "User updated successfully",
            user: updatedUser.toJSON()  
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Failed to update user",
            error: err.message
        });
    }
};

export const updateUserAdmin = async (req, res) => {
    try {
        const { uid } = req.params;
        const data = req.body;

        const updatedUser = await User.findByIdAndUpdate(uid, data, { new: true });

        return res.status(200).json({
            success: true,
            msg: 'Usuario Actualizado',
            user: updatedUser,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            msg: 'Error al actualizar usuario',
            error: err.message
        });
    }
};

export const updateUserPassword = async (req, res) => {
  try {
    const { usuario } = req;
    const { contraActual, nuevaContra, confirmacionContra } = req.body;

    const user = await User.findById(usuario._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado"
      });
    }

    if (nuevaContra !== confirmacionContra) {
      return res.status(400).json({
        success: false,
        message: "La nueva contraseña y su confirmación no coinciden"
      });
    }

    const contraActualValida = await verify(user.password, contraActual);
    if (!contraActualValida) {
      return res.status(400).json({
        success: false,
        message: "La contraseña actual es incorrecta"
      });
    }

    if (contraActual === nuevaContra) {
      return res.status(400).json({
        success: false,
        message: "La nueva contraseña no puede ser igual a la anterior"
      });
    }

    const hashedNew = await hash(nuevaContra, 10);
    user.password = hashedNew;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Contraseña actualizada exitosamente"
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error al actualizar la contraseña",
      error: err.message
    });
  }
};

export const deleteUserAdmin = async (req, res) => {
    try {
        const { uid } = req.params;

        const user = await User.findByIdAndUpdate(uid, { status: false }, { new: true });

        return res.status(200).json({
            success: true,
            message: "Usuario eliminado",
            user
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error al eliminar el usuario",
            error: err.message
        });
    }
};

export const updateRole = async (req,res) => {
    try {
        const { uid } = req.params;
        const {newRole} = req.body;

        const updatedUser = await User.findByIdAndUpdate(uid, { role: newRole }, { new: true });

        return res.status(200).json({
            success: true,
            msg: 'Usuario Actualizado',
            user: updatedUser,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            msg: 'Error al actualizar usuario',
            error: err.message
        });
    }
}

export const getUserLogged = async (req, res) => {
    try {
        const { usuario } = req;

        const user = await User.findById(usuario._id)
            .populate({
                path: "favs",
                select: "accountNumber" 
            });

        return res.status(200).json({
            success: true,
            user: {
                _id: user._id,
                dpi: user.dpi,
                username: user.username,
                name: user.name,
                email: user.email,
                role: user.role,
                favs: user.favs, 
                status: user.status
            }
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            msg: 'Error al obtener el rol del usuario',
            error: err.message
        });
    }
}