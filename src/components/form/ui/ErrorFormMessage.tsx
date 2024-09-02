import React from "react";

interface Props {
	message?: string;
	className?: string;
}

export const ErrorFormMessage = ({ message, className }: Props) => {
	const lines = message?.split("\n") || [];

	return (
		<div className={className}>
			{lines.map((line, index) => (
				<p key={index} className="mb-2">
					{line}
				</p>
			))}
		</div>
	);
};
