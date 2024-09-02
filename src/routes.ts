/**
 * Un array de rutas que son accesibles al público
 * Estas rutas no requieren autenticación
 * @type {string[]}
 */
export const publicRoutes = ["/", "/contacto"];

/**
 * Un array de rutas que se utilizan para la autenticación
 * Estas rutas redirigirán a los usuarios que ya han iniciado sesión a /turno
 * @type {string[]}
 */
export const authRoutes = [
	"/auth/login", // Ruta para iniciar sesión
];

export const adminRoutes = [
	"/admin", // Panel de administración principal
];

/**
 * El prefijo para las rutas de autenticación de la API
 * Las rutas que comienzan con este prefijo se utilizan para fines de autenticación en la API
 * @type {string}
 */

export const apiAuthPrefix = "/api/auth";

/**
 * La ruta de redirección predeterminada después de iniciar sesión
 * @type {string}
 */

export const DEFAULT_LOGIN_USER_REDIRECT = "/";

export const DEFAULT_LOGIN_ADMIN_REDIRECT = "/admin";

// export const DEFAULT_LOGIN_REDIRECT = "/";
