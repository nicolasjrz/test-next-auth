"use client";

import React from "react";
import { Button } from "../ui";
import { logout } from "@/actions/auth/logout";

export const LogoutButton = () => {
	const handlerLogout = async () => {
		await logout();
	};
	return (
		<div>
			<Button variant={"outline"} onClick={handlerLogout}>
				Salir
			</Button>
		</div>
	);
};
