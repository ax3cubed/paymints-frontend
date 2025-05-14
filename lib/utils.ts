import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

// Format wallet address for display
export const formatAddress = (address: string | null) => {
	if (!address) return "Unknown";
	return `${address.slice(0, 4)}...${address.slice(-4)}`;
};

export const formatNumber = (value: number | string) => {
	if (typeof value === "number") {
		return value.toLocaleString("en-US", {
			minimumFractionDigits: 0,
			maximumFractionDigits: 2,
		});
	}
	return value;
};
export const formatCurrency = (value: number | string, currency: string) => {
	const number = formatNumber(value);
	return `${currency} ${number}`;
};
