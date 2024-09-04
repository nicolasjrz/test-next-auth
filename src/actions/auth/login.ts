"use server";

import { LoginSchema } from "@/schemas";
import { z } from "zod";
import { getUserByEmail } from "../user/get-user-by-email";
import { signIn } from "@/auth";
import { cookies } from "next/headers"; // Importa cookies de Next.js para obtener las cookies del cliente
import { getToken } from "next-auth/jwt";

// Función para manejar el inicio de sesión
export const login = async (values: z.infer<typeof LoginSchema>, requestUrl: string) => {
	// Validar campos del formulario
	const validateFields = LoginSchema.safeParse(values);
	if (!validateFields.success) {
		const errors = validateFields.error.errors;
		const errorMessages = errors.map((err) => `${err.message}`).join("\n");
		return { error: `${errorMessages}` };
	}

	const { email, password } = validateFields.data;
	const existingUser = await getUserByEmail(email);
	if (!existingUser || !existingUser.email || !existingUser.password) {
		return { error: "El correo electrónico no existe en la base de datos" };
	}

	try {
		// Intentar iniciar sesión con las credenciales proporcionadas
		const result = await signIn("credentials", {
			redirect: false,
			email,
			password,
		});

		if (result?.error) {
			return { error: result.error };
		}

		// Obtener las cookies de la solicitud actual
		const clientCookies = cookies().getAll();

		// Obtener el token de sesión después del inicio de sesión exitoso
		const token = await getToken({
			req: { headers: { cookie: clientCookies.map((c) => `${c.name}=${c.value}`).join("; ") } },
			secret: process.env.AUTH_SECRET,
		});

		if (!token) {
			return { error: "No se pudo obtener el token de sesión" };
		}

		// Obtener el rol del usuario desde el token
		const role = token.role; // Asegúrate de que `role` esté en el token

		// Determinar la URL de redirección basada en el rol
		let redirectTo = "/";
		if (role === "administrator" || role === "owner") {
			redirectTo = "/admin";
		}

		return { redirectTo }; // Retornar la URL de redirección
	} catch (error) {
		console.error("Error durante el inicio de sesión:", error);
		return { error: "¡Algo salió mal!" };
	}
};
