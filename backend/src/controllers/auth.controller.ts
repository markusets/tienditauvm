import { Request, Response } from "express";
import { initDataSource } from "../db/data.source";
import { User } from "../entities/users.entity";
import { encrypt } from "../utils/security.utils";
import { UserResponceDTO } from "../dtos/users.dtos";

export class AuthController {
  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        res
          .status(400)
          .json({ message: " email and password required" });
        return
      }

      const userRepository = initDataSource.getRepository(User);
      const user = await userRepository.findOne({ where: { email } });

      if (!user) {
        res.status(404).json({ message: "User not found" });
        return
      }

      const isPasswordValid = await encrypt.comparepassword(user.password, password);

      if (!isPasswordValid) {
        res.status(400).json({ message: "Invalid password" });
        return
      }

      const token = encrypt.generateToken({ id: user.id, role: user.role })

      const userDataResponse = new UserResponceDTO()
      userDataResponse.name = user.name;
      userDataResponse.lastname = user.lastname;
      userDataResponse.email = user.email;
      userDataResponse.role = user.role;

      res.status(200).json({ message: "Login successful", access_token: token, userDataResponse });
      return
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
      return
    }
  }

  static async getProfile(req: Request, res: Response) {
    if (!req["currentUser"]) {
      res.status(401).json({ message: "Unauthorized" });
    }
    const userRepository = initDataSource.getRepository(User);
    const user = await userRepository.findOne({
      where: { id: req["currentUser"].id },
    });
    res.status(200).json({ ...user, password: undefined });
    return
  }
}
