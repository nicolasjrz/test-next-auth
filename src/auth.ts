import NextAuth, { type DefaultSession } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter"
import authConfig from "./auth.config"
import prisma from "./lib/prisma"
import { getUserById } from "./actions/user/get-user-by-id";






export const {
    handlers: { GET, POST }, // Desestructuración de los manejadores HTTP GET y POST de NextAuth
    auth, // Exporta el objeto `auth` para que pueda ser utilizado en otras partes de la aplicación
    signIn, // Exporta la función `signIn` para iniciar sesión
    signOut // Exporta la función `signOut` para cerrar sesión
  } = NextAuth({
    
    // Configuración de los eventos de NextAuth
  
    
    // Configuración de las páginas personalizadas para el inicio de sesión y errores
    pages: {
      signIn: "/auth/login", // Página personalizada para iniciar sesión
      error: "/auth/error" // Página personalizada para mostrar errores
    },
  
    // Callbacks personalizados para modificar el comportamiento de NextAuth
    callbacks: {
  
      // Callback que se ejecuta al iniciar sesión
      async signIn({ user, account }) {
        // console.log({ user, account });
       
        // Si el proveedor no es "credentials", permitir el inicio de sesión
        if (account?.provider !== "credentials") return true;
  
        // Verifica si el usuario ha verificado su email
        const existingUser = await getUserById(user.id!);
        if (!existingUser?.emailVerified) return false; // Si no está verificado, rechaza el inicio de sesión
        
    
        return true; // Permite el inicio de sesión si todo está correcto
      },
  
      // Callback que se ejecuta al crear la sesión
      async session({ token, session }) {
        // Si el token contiene un `sub` (sub identificador) y `session.user` existe, asigna el `sub` al ID del usuario en la sesión
        if (token.sub && session.user) {
          session.user.id = token.sub;
        }
  
        // Si el token contiene un `role` y `session.user` existe, asigna el rol del usuario en la sesión
        if (token.role && session.user) {
          session.user.role = token.role; 
        }
  
        return session; // Devuelve la sesión con los datos adicionales
      },
  
      // Callback que se ejecuta al manipular el token JWT
      async jwt({ token }) {
        // Si no existe un `sub` en el token, devuélvelo tal cual
        if (!token.sub) return token;
  
        // Busca el usuario en la base de datos usando el ID (`sub`) del token
        const existingUser = await getUserById(token.sub);
        if (!existingUser) return token; // Si el usuario no existe, devuelve el token tal cual
  
        // Asigna el rol del usuario al token
        token.role = existingUser.role;
  
        return token; // Devuelve el token modificado
      },
      async redirect({ url, baseUrl }) {
        // Allows relative callback URLs
        if (url.startsWith("/")) return `${baseUrl}${url}`
        // Allows callback URLs on the same origin
        else if (new URL(url).origin === baseUrl) return url

       
        return baseUrl
      }
    },
  
    // Adaptador de Prisma para manejar la conexión con la base de datos
    adapter: PrismaAdapter(prisma),
  
    // Configuración para usar JWT en la sesión
    session: { strategy: "jwt" },
  
    // Importa y expande la configuración adicional desde `authConfig`
    ...authConfig,
  });
  