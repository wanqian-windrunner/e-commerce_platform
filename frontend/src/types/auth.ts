export type UserRole = "customer" | "admin";

// auth.service.ts registerUser返回值
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

// user.service.ts getUserProfile返回值
export interface CurrentUser extends AuthUser {
  isActive: boolean;
  createdAt: string;
}

// 来自auth.valildation.ts registerSchema
export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

// 来自auth.valildation.ts loginSchema
export interface LoginPayload {
  email: string;
  password: string;
}

// auth.controller.ts register返回值
export interface AuthResult {
  user: AuthUser;
  accessToken: string;
}

// auth.controller.ts refresh返回值
export interface RefreshResult {
    accessToken: string;
}
