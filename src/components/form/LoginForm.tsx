"use client";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "./ui/ErrorMessage";
import { ErrorFormMessage } from "./ui/ErrorFormMessage";
import { Button, Input, Label } from "../ui";
import { useToast } from "@/hooks/use-toast";
import { login } from "@/actions/auth/login";

interface FormInputs {
	email: string;
	password: string;
}

export const LoginForm = () => {
	const { toast } = useToast();
	const router = useRouter(); // Usar useRouter para redirigir
	const searchParams = useSearchParams();
	const callbackUrl = searchParams.get("callbackUrl") || "/";
	const [loading, setLoading] = useState(false);

	const [messageError, setMessageError] = useState("");

	const {
		handleSubmit,
		register,
		formState: { errors },
	} = useForm<FormInputs>({
		defaultValues: {},
	});
	const onSubmitForm = async (data: FormInputs) => {
		setLoading(true); // Habilitar el estado de carga

		const loginData = {
			email: data.email,
			password: data.password,
		};

		try {
			const { error, redirectTo } = await login(loginData, callbackUrl);

			if (error) {
				setMessageError(error || ""); // Establecer mensaje de error
			} else {
				router.replace(redirectTo!); // Redirigir a la URL adecuada
				window.location.reload(); // Recargar la página después de redirigir
			}
		} catch (error) {
			console.error("Error durante la solicitud:", error); // Registrar el error
			setMessageError("Error al enviar la solicitud"); // Mensaje de error genérico
		} finally {
			setLoading(false); // Deshabilitar el estado de carga
		}
	};
	return (
		<form onSubmit={handleSubmit(onSubmitForm)}>
			<div className="flex flex-col w-full space-y-2 ">
				<div className=" w-full  px-4">
					<Label htmlFor="email">Email</Label>
					<Input
						type="email"
						id="email"
						placeholder="your@email.com"
						{...register("email", {
							required: "Por favor ingrese un email",
							minLength: {
								value: 5,
								message: "El Email debe tener al menos 5 caracteres.",
							},
							maxLength: {
								value: 50,
								message: "El Email no puede tener más de 50 caracteres.",
							},
						})}
						className="  border border-black mt-1"
					/>
					{errors.email && <ErrorMessage message={errors.email.message} className="text-gray-500 text-xs ml-1 mt-1 " />}
				</div>{" "}
				<div className=" w-full   px-4">
					<Label htmlFor="password">Password</Label>
					<Input
						type="password"
						id="password"
						placeholder="Password"
						{...register("password", {
							required: "Por favor ingrese el password",
							minLength: {
								value: 6,
								message: "El Password debe tener al menos 6 caracteres.",
							},
							maxLength: {
								value: 20,
								message: "El Password no puede tener más de 20 caracteres.",
							},
						})}
						className="  border border-black mt-1"
					/>
					{errors.password && <ErrorMessage message={errors.password.message} className="text-gray-500 text-xs ml-1 mt-1" />}
				</div>
			</div>
			<div className="flex justify-center  ">{messageError && <ErrorFormMessage message={messageError} className="text-gray-900 text-sm mt-1" />}</div>
			<div className="flex w-full items-center justify-center  max-lg:justify-center px-4 pt-5">
				<Button
					data-ripple-light="true"
					type="submit"
					// onClick={() => onClick("email")}
					className=" w-full "
					disabled={loading}
				>
					Login
				</Button>
			</div>
		</form>
	);
};
