
export interface User {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  role: string;
  created_at: string;
  mfa_enabled?: boolean;
}

export interface Workspace {
  id: string;
  name: string;
  description?: string;
  logo_url?: string;
  owner_id: string;
  plan: string;
  parallel_calls_limit: number;
  parallel_calls_used: number;
  created_at: string;
  members: User[];
}
