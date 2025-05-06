// eslint-disable-next-line @typescript-eslint/no-unused-vars
const roleEnum = ['USER', 'ADMIN'] as const;

export class UserDto {
  id: string;
  name: string;
  email: string;
  role: (typeof roleEnum)[number];
}
