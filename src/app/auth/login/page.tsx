import { GoogleButton } from "@/components/button/GoogleButton";
import { LoginForm } from "@/components/form/LoginForm";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function LoginPage() {
	return (
		<div className={cn("  p-2 rounded-md shadow-2xl", "max-sm:w-5/6", "md:w-3/6", "lg:w-3/6", "xl:w-2/6", "2xl:w-1/6")}>
			<div className="flex justify-start mx-4 my-2">
				<h4 className={` text-2xl font-semibold tracking-tight `}>Welcome.</h4>
			</div>

			<div className="flex flex-col">
				<LoginForm />
				{/* <div className="flex w-full items-center justify-center h-[40px] max-lg:justify-center px-4 ">o</div> */}
				<GoogleButton />
				<div className="flex w-full  flex-col  items-center justify-center h-[40px] max-lg:justify-center px-4 ">
					<div>
						<Link href={"/auth/register"} className="font-light text-sm">
							Dont have an account?
						</Link>
					</div>

					<div>
						<Link href={"/auth/reset"} className="font-light text-sm">
							se olvido la contracenia?
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}
