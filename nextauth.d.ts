import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";
import { Role } from "@/interfaces/user-interface";

declare module "next-auth" {
  interface Session {
    user: {
      id?: string; // Puedes agregar otros campos aquí si es necesario
      role: Role; // Asegúrate de que `role` sea opcional si no siempre está presente
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: Role; // Asegúrate de que `role` sea opcional si no siempre está presente
  }
}
