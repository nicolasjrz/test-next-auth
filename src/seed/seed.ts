import bcryptjs from "bcryptjs";

interface SeedUser {
	email: string;
	password: string;
	name: string;
	role: "administrator" | "user" | "employee";
}

interface SeedData {
	users: SeedUser[];
}

export const initialData: SeedData = {
	users: [
		{ email: "nico1@gmail.com", name: "nico test 1", password: bcryptjs.hashSync("123456"), role: "administrator" },
		{ email: "nico2@gmail.com", name: "nico test 2", password: bcryptjs.hashSync("123456"), role: "user" },
	],
};
