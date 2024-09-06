import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { cookies } from "next/headers";
import { apiAuthPrefix, authRoutes, publicRoutes, adminRoutes } from "@/routes";

export default async function auth(req) {
	const { nextUrl } = req;

	// Obtener cookies y token de sesión
	const clientCookies = cookies().getAll();
	const token = await getToken({
		req: { headers: { cookie: clientCookies.map((c) => `${c.name}=${c.value}`).join("; ") } },
		secret: process.env.AUTH_SECRET,
	});

	const userRole = token?.role; // Obtenemos el rol del token
	const isLoggedIn = !!token; // Si el token existe, el usuario está logueado

	// Identificar si es una ruta específica
	const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
	const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
	const isAuthRoute = authRoutes.includes(nextUrl.pathname);
	const isAdminRoute = adminRoutes.includes(nextUrl.pathname);

	// No redirigir si es una ruta API relacionada con autenticación
	if (isApiAuthRoute) return;

	// Si el usuario intenta acceder a una ruta de autenticación (login, register, etc.)
	if (isAuthRoute) {
		if (isLoggedIn) {
			// Redirigir según el rol si ya está logueado
			if (userRole === "administrator") {
				return NextResponse.redirect(new URL("/admin", nextUrl));
			}
			return NextResponse.redirect(new URL("/", nextUrl));
		}
		return; // Permitir acceso a las rutas de autenticación si no está logueado
	}

	// Si es una ruta de administración y el usuario no es administrador
	if (isAdminRoute) {
		if (!isLoggedIn || userRole !== "administrator") {
			return NextResponse.redirect(new URL("/auth/login", nextUrl)); // Redirigir a login
		}
	}

	// Si no está logueado y la ruta no es pública, redirigir a login
	if (!isLoggedIn && !isPublicRoute) {
		return NextResponse.redirect(new URL("/auth/login", nextUrl));
	}

	return; // Permitir la petición para las demás rutas
}

export const config = {
	// Aplicar el middleware a las rutas especificadas
	matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
