import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface User {
    id: string;
    email: string;
    name?: string | null;
    userId: string;
    tenantId: string;
    siteId: string;
    role: string;
  }

  interface Session {
    user: {
      email: string;
      name?: string | null;
      userId: string;
      tenantId: string;
      siteId: string;
      role: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId: string;
    tenantId: string;
    siteId: string;
    role: string;
  }
}
