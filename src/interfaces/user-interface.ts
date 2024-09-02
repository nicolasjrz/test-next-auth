export interface User {
	id: string;
	name: string;
	email: string;
	emailVerified: Date | null;
	role: string;
	image: string | null;
	active?: boolean | null;
}

export type Role = "owner" | "administrator" | "employee" | "user";
