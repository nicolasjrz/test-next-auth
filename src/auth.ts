import NextAuth from "next-auth";
import prisma from "./lib/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import authConfig from "./auth.config";
import { getUserById } from "./actions/user/get-user-by-id";

export const {
	handlers: { GET, POST },
	auth,
	signIn,
	signOut,
} = NextAuth({
	pages: {
		signIn: "/auth/login", // Página personalizada para iniciar sesión
		error: "/auth/error", // Página personalizada para mostrar errores
	},

	callbacks: {
		async signIn({ user, account }) {
			if (account?.provider !== "credentials") return true;

			// Verifica si el usuario ha verificado su email
			const existingUser = await getUserById(user.id!);
			if (!existingUser?.emailVerified) return false;
			return true;
		},

		async session({ token, session }) {
			if (token.sub && session.user) {
				session.user.id = token.sub;
			}

			if (token.role && session.user) {
				session.user.role = token.role;
			}

			return session;
		},

		async jwt({ token }) {
			if (!token.sub) return token;

			// Busca el usuario en la base de datos usando el ID (`sub`) del token
			const existingUser = await getUserById(token.sub);
			if (!existingUser) return token;

			// Asigna el rol del usuario al token
			token.role = existingUser.role;

			return token;
		},

		async redirect({ url, baseUrl }) {
			if (url.startsWith("/")) return `${baseUrl}${url}`;
			else if (new URL(url).origin === baseUrl) return url;
			return baseUrl;
		},
	},

	adapter: PrismaAdapter(prisma),

	session: { strategy: "jwt" },

	...authConfig,
});
