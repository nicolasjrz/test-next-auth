import { Inter as FontSans } from "next/font/google";
import { cn } from "@/lib/utils";

const fontSans = FontSans({
	subsets: ["latin"],
	variable: "--font-sans",
});

export default function AuthLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className={cn("min-h-screen bg-background font-sans antialiased", fontSans.variable)}>
			<div className="h-screen flex justify-center items-center">{children}</div>
			{/* <Toaster /> */}
		</div>
	);
}
