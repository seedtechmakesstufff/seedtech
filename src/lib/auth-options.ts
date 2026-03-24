import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "SeedTech Admin",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "you@seedtechllc.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const email = credentials.email.trim().toLowerCase();
        const password = credentials.password;

        // Look up user in DB
        const user = await prisma.user.findUnique({
          where: { email },
          include: {
            memberships: {
              include: { tenant: { include: { sites: true } } },
            },
          },
        });

        if (!user) return null;

        // Verify password
        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) return null;

        // Get the first membership (for now, single-tenant)
        const membership = user.memberships[0];
        if (!membership) return null;

        // Get the first site in that tenant (for now, single-site)
        const site = membership.tenant.sites[0];
        if (!site) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name ?? email.split("@")[0],
          userId: user.id,
          tenantId: membership.tenantId,
          siteId: site.id,
          role: membership.role,
        };
      },
    }),
  ],
  pages: {
    signIn: "/admin/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.email = user.email;
        token.userId = user.userId;
        token.tenantId = user.tenantId;
        token.siteId = user.siteId;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.email = token.email as string;
        session.user.userId = token.userId;
        session.user.tenantId = token.tenantId;
        session.user.siteId = token.siteId;
        session.user.role = token.role;
      }
      return session;
    },
  },
};
