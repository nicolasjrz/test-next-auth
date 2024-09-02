import { initialData } from "./seed";
import prisma from "../lib/prisma";

async function main() {
	await Promise.all([await prisma.user.deleteMany()]);

	const { users } = initialData;

	const resp = await prisma.user.createMany({
		data: users,
	});

	console.log({ resp });
	console.log("seed ejecutado correctamente");
}

(() => {
	main();

	if (process.env.NODE_ENV === "production") return;
})();
