"use server";

import prisma from "@/lib/prisma";

export const getUserByEmail = async (email: string) => {
	try {
		const user = await prisma.user.findUnique({
			where: { email: email.toLowerCase() },
		});

		if (!user) return null;

		return user;
	} catch (error) {
		console.log(error);

		throw new Error("No se encontro email");
	}
};
