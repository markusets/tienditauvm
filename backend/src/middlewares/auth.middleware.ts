import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import { User } from "../entities/users.entity";
import { initDataSource } from "../db/data.source";
dotenv.config();

export const authentification = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const header = req.headers.authorization;
  if (!header) {
    res.status(401).json({ message: "Unauthorized - Missing Authorization header" })
    return
  }
  const token = header.split(" ")[1];
  if (!token) {
    res.status(401).json({ message: "Unauthorized - Not Token" });
    return
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req["currentUser"] = decoded;
    next();
  } catch (error) {
    res.status(401).json({ status: false, message: "Unauthorized - Invalid token" });
  }
};

export const authorization = (roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const userRepo = initDataSource.getRepository(User);
    const user = await userRepo.findOne({
      where: { id: req["currentUser"].id },
    });
    console.log(user);
    if (!roles.includes(user.role)) {
      res.status(403).json({ message: "Forbidden" });
      return
    }
    next();
  };
};
