import { auth } from "@/auth";

export const currentRole = async () => {
	const session = await auth();
	console.log("currentRole ------- Session after assigning role:", session?.user.role); // Verificar si el rol está asignado
	return session?.user?.role;
};
