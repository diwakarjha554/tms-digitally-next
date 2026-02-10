import { DefaultSession, DefaultUser } from 'next-auth';
import { UserRole } from '@prisma/client';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: UserRole;
      createdAt: string;
    } & DefaultSession['user'];
  }

  interface User extends DefaultUser {
    role: UserRole;
    createdAt: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: UserRole;
    createdAt: string;
  }
}
