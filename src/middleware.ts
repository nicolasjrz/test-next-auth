import NextAuth from "next-auth";
import authConfig from "./auth.config";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { cookies } from "next/headers";
import { apiAuthPrefix, authRoutes, publicRoutes, adminRoutes } from "@/routes";

const { auth } = NextAuth(authConfig);

export default auth(async (req) => {
	// Extrae la URL solicitada
	const { nextUrl } = req;

	// Obtener las cookies de la solicitud actual
	const clientCookies = cookies().getAll();
	const token = await getToken({
		req: { headers: { cookie: clientCookies.map((c) => `${c.name}=${c.value}`).join("; ") } },
		secret: process.env.AUTH_SECRET,
	});

	const userRole = token?.role; // Asumimos que el rol se guarda en el token
	const isLoggedIn = !!token; // Verifica si el token existe

	const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
	const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
	const isAuthRoute = authRoutes.includes(nextUrl.pathname);
	const isAdminRoute = adminRoutes.includes(nextUrl.pathname);

	if (isApiAuthRoute) {
		return; // No redirigir, continuar con la petición
	}

	if (isAuthRoute) {
		if (isLoggedIn) {
			if (userRole === "user") return NextResponse.redirect(new URL("/", nextUrl));
			return NextResponse.redirect(new URL("/admin", nextUrl));
			// return redirect:{}
		}
		return; // Permite el acceso a la página de autenticación si no está autenticado
	}

	if (isAdminRoute) {
		if (isLoggedIn) {
			if (userRole === "user") return NextResponse.redirect(new URL("/", nextUrl));
			// return redirect:{}
		}
		return; // Permite el acceso a la página de autenticación si no está autenticado
	}

	if (!isLoggedIn && !isPublicRoute) {
		return Response.redirect(new URL("/auth/login", nextUrl));
	}

	return; // Permite que la petición continúe para el resto de las rutas
});
export const config = {
	// Matcher especifica las rutas donde se aplica este middleware
	matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
