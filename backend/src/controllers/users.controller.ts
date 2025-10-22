import { Request, Response } from 'express';
import * as cache from "memory-cache";
import { initDataSource } from '../db/data.source';
import { User } from '../entities/users.entity';
import { encrypt } from '../utils/security.utils';
import { UserResponceDTO } from '../dtos/users.dtos';


export class UsersController {
  static async getUsers(req: Request, res: Response) {
    const data = cache.get("dataUsers");
    if (data) {
      console.log("serving from cache");
      res.status(200).json({
        data,
      });
      return
    } else {
      console.log("serving from db");
      const userRepository = initDataSource.getRepository(User);
      const users = await userRepository.find();
      const userData = users.map((user) => {
        const userSent = new UserResponceDTO();
        userSent.id = user.id;
        userSent.name = user.name;
        userSent.lastname = user.lastname;
        userSent.email = user.email;
        userSent.role = user.role;
        return userSent;
      });

      cache.put("dataUsers", userData, 6000);
      res.status(200).json({
        data: userData,
      });
      return
    }
  }

  static async signup(req: Request, res: Response) {
    const { name, lastname, email, password } = req.body;
    if (!name || !lastname || !email || !password) {
      res.status(400).json({ message: "All fields are required" })
      return
    }

    const userRepo = initDataSource.getRepository(User);
    const findUser = await userRepo.findOne({ where: { email } });

    if (findUser) {
      res.status(409).json({ message: "Conflict User already exists" })
      return
    }

    const user = new User();
    user.name = name;
    user.lastname = lastname;
    user.email = email;
    user.password = await encrypt.encryptpass(password);

    await userRepo.save(user);

    const token = encrypt.generateToken({ id: user.id, role: user.role })

    const userDataSent = new UserResponceDTO();
    userDataSent.name = user.name;
    userDataSent.lastname = user.lastname;
    userDataSent.email = user.email;
    userDataSent.role = user.role;
    res
      .status(200)
      .json({ message: "User created successfully", access_token: token, userDataSent });
    return
  }

  static async changePassword(req: Request, res: Response): Promise<void> {
    try {
      const { currentPassword, newPassword } = req.body;
      const currentUserId = req['currentUser'].id;

      if (!currentPassword || !newPassword) {
        res.status(400).json({
          message: "Current password and new password are required"
        });
        return;
      }

      const userRepository = initDataSource.getRepository(User);
      const user = await userRepository.findOne({
        where: { id: currentUserId },
      });

      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      // Verificar la contraseña actual
      const isPasswordValid = await encrypt.comparepassword(user.password, currentPassword);
      if (!isPasswordValid) {
        res.status(400).json({ message: "Current password is incorrect" });
        return;
      }

      // Actualizar la contraseña
      user.password = await encrypt.encryptpass(newPassword);
      await userRepository.save(user);

      res.status(200).json({
        status: true,
        message: "Password changed successfully"
      });
      return;
    } catch (error) {
      console.error("Error changing password:", error);
      res.status(500).json({ message: "Internal server error" });
      return;
    }
  }

  static async updateUser(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { name, lastname, email, password, role } = req.body;
    const userRepository = initDataSource.getRepository(User);
    const user = await userRepository.findOne({
      where: { id },
    });

    if (!user) {
      res.status(404).json({ status: false, message: "User not found for Update" });
      return
    }
    user.name = name;
    user.lastname = lastname;
    user.email = email;
    if (password) {
      user.password = await encrypt.encryptpass(password);
    }

    if (req['currentUser'].role === "admin") {
      // Un admin puede actualizar cualquier usuario
      // Pero no puede cambiar el rol de otro admin (incluyendo el suyo propio)
      if (user.role === "admin" && role !== "admin") {
        res.status(403).
          json({ message: "You cannot change the role of an admin." });
        return
      }
      // Si es un usuario regular, se puede cambiar su rol
      if (user.role !== "admin") {
        user.role = role;
      }
      // Si es admin y no se está intentando cambiar el rol, continuar
      // Esto permite que un admin cambie su propia contraseña
    } else {
      // Si no es admin, no puede actualizar usuarios
      res.status(403).
        json({ message: "You do not have permission to perform this action." });
      return
    }

    await userRepository.save(user);
    const userDataSent = new UserResponceDTO();
    userDataSent.name = user.name;
    userDataSent.lastname = user.lastname;
    userDataSent.email = user.email;

    res.status(200).json({ status: true, message: "User updated successfully", userDataSent });
    return
  }

  static async deleteUser(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const userRepository = initDataSource.getRepository(User);
    const user = await userRepository.findOne({
      where: { id },
    });

    if (!user) {
      res.status(404).json({ status: false, message: "User not found for Delete" });
      return
    }

    await userRepository.remove(user);
    res.status(200).json({ status: true, message: "ok" });
    return
  }
}
