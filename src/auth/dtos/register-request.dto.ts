export type RegisterRequestDto = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  isAdmin?: boolean;
  images?: any[];
  certificates?: any[];
};
