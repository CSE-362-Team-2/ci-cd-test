import "dotenv/config";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "../types/userType.js";

export const getJwtSecret = (): string =>
  process.env.JWT_SECRET || "dev_jwt_secret_change_in_production";

export const getJwtExpiresIn = (): string => process.env.JWT_EXPIRES_IN || "7d";

export const signToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, getJwtSecret(), {
    expiresIn: getJwtExpiresIn(),
  } as jwt.SignOptions);
};

export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, getJwtSecret()) as JwtPayload;
};
