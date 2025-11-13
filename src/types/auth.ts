export interface LoginRequest {
  email: string
  password: string
  twoFactorCode?: string
  twoFactorRecoveryCode?: string
}

export interface RegisterRequest {
  email: string
  password: string
}

export interface AccessTokenResponse {
  tokenType?: string
  accessToken: string
  expiresIn: number
  refreshToken: string
}

export interface RefreshRequest {
  refreshToken: string
}

export interface User {
  id: string
  email: string
  userName?: string
}
