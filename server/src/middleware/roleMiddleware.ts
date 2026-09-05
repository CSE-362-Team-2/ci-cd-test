import type { Context, Next } from "hono";

export const authorize = (...allowedRoles: string[]) => {
  return async (c: Context, next: Next) => {
    const user = c.get("user");
    if (!user) {
      return c.json(
        { errCode: 200, errMsg: "Unauthorized: Missing or invalid token" },
        401,
      );
    }
    if (!user.role || !allowedRoles.includes(user.role)) {
      return c.json(
        { errCode: 240, errMsg: "Forbidden: Insufficient permissions" },
        403,
      );
    }
    await next();
  };
};
