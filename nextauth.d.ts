
import { Role } from "@/interfaces/user-interface";
import NextAuth, { type DefaultSession } from "next-auth"
 
export type ExtendedUser = DefaultSession["user"] & {
    role:"owner" | "administrator" | "employee" | "user";
}


declare module "next-auth" {
  interface Session {
    user: {
      role: Role; // Aquí simplemente declaramos que role es de tipo Role
    } & DefaultSession["user"];
  }
}


import { JWT } from "next-auth/jwt"
declare module "next-auth/jwt" {
    /** Returned by the `jwt` callback and `auth`, when using JWT sessions */
    interface JWT {
      /** OpenID ID Token */
      role:Role
    }
  }