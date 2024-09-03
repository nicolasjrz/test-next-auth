import NextAuth from "next-auth";
import authConfig from "./auth.config";

import { DEFAULT_LOGIN_USER_REDIRECT, DEFAULT_LOGIN_ADMIN_REDIRECT, apiAuthPrefix, authRoutes, publicRoutes, adminRoutes } from "@/routes";

import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import { redirect } from "next/navigation";

const { auth } = NextAuth(authConfig);

export default auth(async (req) => {
	// Extrae la URL solicitada
	const { nextUrl, auth } = req;
	// Determina si el usuario está autenticado
	const isLoggedIn = !!req.auth;

	// console.log({ auth });
	// const token = await getToken({
	// 	req,
	// 	secret: process.env.AUTH_SECRET,
	// });
	// console.log("ROLE:", token?.role);
	// console.log("IS LOGGEDIN:", isLoggedIn);
	const token = await getToken({
		req,
		secret: process.env.AUTH_SECRET,
	});

	const userRole = token?.role; // Asumimos que el rol se guarda en el token

	const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);

	const isPublicRoute = publicRoutes.includes(nextUrl.pathname);

	const isAuthRoute = authRoutes.includes(nextUrl.pathname);

	if (isApiAuthRoute) {
		return; // No redirigir, continuar con la petición
	}

	if (isAuthRoute) {
		if (isLoggedIn) {
			// if (token!.role === "user") {
			// 	NextResponse.redirect(new URL(DEFAULT_LOGIN_USER_REDIRECT, nextUrl));
			// } else {
			// 	return NextResponse.redirect(new URL(DEFAULT_LOGIN_ADMIN_REDIRECT, nextUrl));
			// }
			// return redirect:{}
		}
		return; // Permite el acceso a la página de autenticación si no está autenticado
	}

	if (!isLoggedIn && !isPublicRoute) {
		return Response.redirect(new URL("/auth/login", nextUrl));
	}

	return;
});
export const config = {
	// Matcher especifica las rutas donde se aplica este middleware
	matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};

// export default auth((req) => {

// 	const { nextUrl } = req;

// 	// Determina si el usuario está autenticado
// 	const isLoggedIn = !!req.auth;

// 	console.log("IS LOGGEDIN:", isLoggedIn);

// 	// Determina si la ruta es una API relacionada con la autenticación
// 	const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);

// 	// Verifica si la ruta solicitada es una ruta pública
// 	const isPublicRoute = publicRoutes.includes(nextUrl.pathname);

// 	// Verifica si la ruta solicitada es una ruta de autenticación (login, registro, etc.)
// 	const isAuthRoute = authRoutes.includes(nextUrl.pathname);

// 	// Si la ruta es una API de autenticación, no hace nada (permite continuar)
// 	if (isApiAuthRoute) {
// 		return null;
// 	}

// 	// Si la ruta es una ruta de autenticación y el usuario ya está autenticado,
// 	// redirige al usuario a la página predeterminada después de iniciar sesión
// 	if (isAuthRoute) {
// 		if (isLoggedIn) {
// 			return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
// 		}
// 		return null; // Permite el acceso a la página de autenticación si no está autenticado
// 	}

//
// 	if (!isLoggedIn && !isPublicRoute) {
// 		return Response.redirect(new URL("/auth/login", nextUrl));
// 	}

// 	// Permite el acceso a la ruta solicitada si ninguna de las condiciones anteriores se cumple
// 	return null;
// });
