export type AuthUser = {
  name?: string;
  email?: string;
};

export type SessionResponse = {
  success?: boolean;
  session_id?: string;
  tenant_id?: string;
  user?: AuthUser;
};

export type CompleteOAuthResponse = {
  success: boolean;
  session_id?: string;
  user?: AuthUser;
};

export type GoogleAuthUrlResponse = {
  auth_url?: string;
  state?: string;
};
