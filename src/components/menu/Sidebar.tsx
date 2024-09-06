import Link from "next/link";
import { LogoutButton } from "../button/LogoutButton";
import { Button } from "../ui";
import { currentRole, currentUser } from "@/hooks/useCurrentRole";

export const Sidebar = async () => {
	const role = await currentRole();
	const user = await currentUser();

	return (
		<div className="h-16 w-full bg-red-300">
			<div className="w-full h-full flex justify-center items-center space-x-4">
				<div className="flex h-full items-center">
					<Link href="/">Home</Link>
				</div>
				<div className="flex h-full items-center">
					<Link href="/contacto">Contacto</Link>
				</div>

				{role === "administrator" ? (
					<div className="flex h-full items-center">
						<Link href="/admin">Admin</Link>
					</div>
				) : (
					""
				)}

				{!user ? (
					<div className="flex h-full items-center">
						<Button>
							<Link href="/auth/login">Login</Link>
						</Button>
					</div>
				) : (
					<div className="flex h-full items-center">
						<LogoutButton />
					</div>
				)}
			</div>
		</div>
	);
};
