/** @format */

"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({
	children,
	...props
}: React.ComponentProps<typeof NextThemesProvider>) {
	//Create a memory switch
	const [mounted, setMounted] = React.useState(false);
	// Wait until the browser is ready
	React.useEffect(() => {
		setMounted(true);
	}, []);
	//If not ready yet, render simple page without script
	if (!mounted) {
		return <>{children}</>;
	}
	// Once ready, load the theme provider
	return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
