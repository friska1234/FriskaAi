// Define API response types
export interface LoginResponse {
  message: string;
  success: boolean;
  user: User;
  token: string;
}
export interface LoginFormValues {
  email: string;
  password: string;
}
export interface User {
  roleID: number;
  roleName: string;
  userID: number;
  userName: string;
  menuAccessList?: null;
  menuAccessRights?: null;
  accessibleMenuItems?: AccessibleMenuItemsEntity[] | null;
  language: string;
}

export interface AccessibleMenuItemsEntity {
  menuID: number;
  menuContolID: string;
  name: string;
  parentID: number;
  sortOrder: number;
  actionUrl: string;
  description?: string | null;
}

export interface LoginCredentials {
  user: string;
  password: string;
}

export interface AuthState {
  user: LoginResponse["user"] | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}
