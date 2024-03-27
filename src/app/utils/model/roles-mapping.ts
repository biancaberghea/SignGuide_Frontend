import { Role } from "./roles";

export const RoleMapping: Record<Role, string> = {
  [Role.User]: 'user',
  [Role.Administrator]: 'admin',
};
