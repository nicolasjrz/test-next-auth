import { cn } from "@/lib/utils";
import "./globals.css";
import { Inter as FontSans } from "next/font/google";
import { Sidebar } from "@/components/menu/Sidebar";

// 	title: {
// 		template: "%s - Teslo | Shop",
// 		default: "Home Teslo | Shop",
// 	},
// 	description: "Una tienda virtual de ropa",
// };

const fontSans = FontSans({
	subsets: ["latin"],
	variable: "--font-sans",
});

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<head />
			<body className={cn("min-h-screen bg-background font-sans antialiased", fontSans.variable)}>
				<Sidebar />
				{children}
			</body>
		</html>
	);
}
