export type User = {
  id: number;
  username: string;
  email: string;
  password: string;
  created_at: Date;
  updated_at: Date;
};

// TODO: Remove the comments that I used here for debugging
export type TwahaUser = {
  id: number;
  username: string;
  email: string;
  password: string;
  role: string;
  createdAt: Date;  // fixed naming convention mismatch
  // updated_at: Date;
};

export type SafeUser = Omit<User, "password">;

export type PublicUserInfo = Omit<TwahaUser, "password">;

export type JwtPayload = {
  id: number;
  username: string;
  email: string;
};
