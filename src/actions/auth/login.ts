"use server";

import { LoginSchema } from "@/schemas";
import { z } from "zod";
import { getUserByEmail } from "../user/get-user-by-email";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_USER_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";
// import { AuthError } from "next-auth";
// import { signIn } from "@/auth";
// import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
// import { LoginSchema } from "@/schemas";
// import { AuthError } from "next-auth";
// import { z } from "zod";
// import { getUserByEmail } from "../user/get-user-by-email";
// import { generateVerificationToken } from "@/lib/tokens";
// import { sendVerificationEmail } from "@/lib/mail";

// Función para manejar el inicio de sesión
export const login = async (values: z.infer<typeof LoginSchema>) => {
	// Validación de los campos del formulario con el esquema definido en `LoginSchema`
	const validateFields = LoginSchema.safeParse(values);
	// Si la validación falla, se devuelve un mensaje de error indicando que los campos son inválidos
	if (!validateFields.success) {
		// Extraer los errores de validación
		const errors = validateFields.error.errors;
		// Formatear los mensajes de error
		const errorMessages = errors.map((err) => `${err.message}`).join("\n");
		return { error: `${errorMessages}` };
	}
	// Desestructuración del email y la contraseña desde los datos validados
	const { email, password } = validateFields.data;
	// Buscar al usuario en la base de datos por su email
	const existingUser = await getUserByEmail(email);
	// Si el usuario no existe o faltan datos esenciales, se devuelve un mensaje de error
	if (!existingUser || !existingUser.email || !existingUser.password) {
		return { error: "El correo electrónico no existe en la base de datos" };
	}

	try {
		// Intentar iniciar sesión con las credenciales proporcionadas
		await signIn("credentials", {
			email,
			password,
			redirectTo: DEFAULT_LOGIN_USER_REDIRECT,
		});
	} catch (error) {
		// Si ocurre un error durante el inicio de sesión, manejar los errores específicos de autenticación
		if (error instanceof AuthError) {
			switch (error.type) {
				case "CredentialsSignin":
					return { error: "¡Credenciales inválidas!" };
				default:
					return { error: "¡Algo salió mal!" };
			}
		}
		// Si hay un error no manejado, se lanza para ser tratado en otro lugar
		throw error;
	}
};
