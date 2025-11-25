"use client";

import * as Sentry from "@sentry/nextjs";
import type NextError from "next/error";
import { useEffect } from "react";

export default function GlobalError({
	error,
	reset,
}: {
	error: NextError & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		Sentry.captureException(error);
	}, [error]);

	return (
		<html lang="en">
			<body>
				<h2>Something went wrong!</h2>
				<button type="button" onClick={() => reset()}>
					Try again
				</button>
			</body>
		</html>
	);
}
