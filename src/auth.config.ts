
import type { NextAuthConfig } from "next-auth"
import Credentials from 'next-auth/providers/credentials';
import bcryptjs from 'bcryptjs';
import { getUserByEmail } from "./actions/user/get-user-by-email";
import { LoginSchema } from "./schemas";
import Google from "next-auth/providers/google"



export default {
  providers: [
    Google, // Proveedor de autenticación de Google

    // Proveedor de autenticación personalizada basado en credenciales (correo electrónico y contraseña)
    Credentials({
      async authorize(credentials) {
        
        // Validación de los campos (correo electrónico y contraseña) usando `LoginSchema`
        const validatedFields = LoginSchema.safeParse(credentials);

        // Si la validación es exitosa
        if (validatedFields.success) {
          const { email, password } = validatedFields.data;

          // Busca el usuario en la base de datos por correo electrónico
          const user = await getUserByEmail(email);

          // Si el usuario no existe o no tiene contraseña, retorna `null` (fallo en la autenticación)
          if (!user || !user.password) return null;

          // Compara la contraseña proporcionada con la contraseña almacenada en la base de datos
          const passwordsMatch = await bcryptjs.compare(password, user.password);

          // Si las contraseñas coinciden, retorna el objeto `user` (autenticación exitosa)
          if (passwordsMatch) return user;
        }

        // Si la validación falla o las contraseñas no coinciden, retorna `null` (fallo en la autenticación)
        return null;
      }
    })
  ]
} satisfies NextAuthConfig; // Indica que el objeto cumple con la configuración de NextAuth
