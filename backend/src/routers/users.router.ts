import * as express from "express";
import { authentification, authorization } from "../middlewares/auth.middleware"
import { UsersController } from "../controllers/users.controller";
import { AuthController } from "../controllers/auth.controller";
const Router = express.Router();

Router.get(
  "/users",
  authentification,
  authorization(["admin"]),
  UsersController.getUsers
);
Router.get(
  "/profile",
  authentification,
  authorization(["admin", "user"]),
  AuthController.getProfile
);
Router.post("/signup", UsersController.signup);
Router.post("/login", AuthController.login);
Router.put(
  "/change-password",
  authentification,
  authorization(["admin", "user"]),
  UsersController.changePassword
);
Router.put(
  "/users/:id",
  authentification,
  authorization(["admin"]),
  UsersController.updateUser
);
Router.delete(
  "/users/:id",
  authentification,
  authorization(["admin"]),
  UsersController.deleteUser
);
export { Router as userRouter };
