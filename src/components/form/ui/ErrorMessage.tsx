import React from "react";

interface Props {
	message?: string;
	className?: string;
}

export const ErrorMessage = ({ message, className }: Props) => {
	return <span className={className}>{message}</span>;
};
