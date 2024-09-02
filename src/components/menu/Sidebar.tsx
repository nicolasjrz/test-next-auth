import Link from "next/link";
import React from "react";

export const Sidebar = () => {
	return (
		<div className="h-16 w-full   bg-red-300  ">
			<div className="w-full h-full flex justify-center items-center space-x-4">
				<div className="flex h-full items-center ">
					<Link href={"/"}>Home</Link>
				</div>
				<div className="flex h-full items-center ">
					<Link href={"/contacto"}>Contacto</Link>
				</div>
				<div className="flex h-full items-center ">
					<Link href={"/admin"}>Admin</Link>
				</div>
				<div className="flex h-full items-center ">
					<Link href={""}>Logout</Link>
				</div>
			</div>
		</div>
	);
};
