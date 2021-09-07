export interface User {
  id: string | number;
  email: string;
  role: string;
  userName: string;
}

export function createUser(params: Partial<User>) {
  return {

  } as User;
}
