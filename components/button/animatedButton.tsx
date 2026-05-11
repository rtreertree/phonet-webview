"use client";

import React from "react";
import { Loader2 } from "lucide-react";

type ButtonSize = "sm" | "md" | "lg";
type ButtonVariant = "primary" | "secondary" | "outline";

interface AnimatedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	label: string;
	sizeConfig?: ButtonSize;
	variant?: ButtonVariant;
	isLoading?: boolean;
	icon?: React.ReactNode;
}

export const AnimatedButton = ({
	label,
	sizeConfig = "md",
	variant = "primary",
	isLoading = false,
	icon,
	className = "",
	disabled, // Extracting disabled from props
	...props
}: AnimatedButtonProps) => {
	const isInactive = disabled || isLoading;

	const scales = {
		sm: "h-9 px-4 text-xs rounded-lg gap-1.5",
		md: "h-12 px-6 text-sm rounded-xl gap-2",
		lg: "h-14 px-8 text-base rounded-2xl gap-2.5",
	};

	const variants = {
		primary: "bg-primary text-primary-foreground shadow-lg shadow-primary/25 border-transparent",
		secondary: "bg-secondary text-secondary-foreground shadow-md border-transparent hover:bg-secondary/80",
		outline: "bg-transparent border-border text-foreground hover:bg-accent hover:text-accent-foreground",
	};

	return (
		<button
			{...props}
			disabled={isInactive}
			className={`
				group relative flex items-center justify-center overflow-hidden border font-bold tracking-wide 
				transition-all duration-300 ease-out 
				${scales[sizeConfig]}
				${variants[variant]}
				
				/* Interaction Logic */
				${isInactive 
					? "opacity-50 cursor-not-allowed grayscale-[0.3]" 
					: "active:scale-[0.96] hover:-translate-y-1 hover:shadow-xl"
				}
				
				/* Outline specific hover is disabled if button is inactive */
				${variant === "outline" && !isInactive ? "hover:border-primary/50" : ""}
				
				${className}
			`}
		>
			{/* Shimmer Layer - only animate if NOT inactive */}
			{variant !== "outline" && !isInactive && (
				<div className="absolute inset-0 pointer-events-none" aria-hidden="true">
					<div className={`
						absolute top-0 -inset-full h-full w-1/2 
						bg-gradient-to-r from-transparent via-white/20 to-transparent 
						skew-x-[-25deg] transition-all duration-[700ms] ease-in-out
						left-[-100%] group-hover:left-[150%]
					`} />
				</div>
			)}

			{/* Content */}
			<div className="relative z-10 flex items-center justify-center gap-2">
				{isLoading ? (
					<Loader2 className="h-4 w-4 animate-spin" />
				) : (
					<>
						{icon && (
							<span className={`transition-transform duration-300 ${!isInactive && "group-hover:scale-110"}`}>
								{icon}
							</span>
						)}
						<span>{label}</span>
					</>
				)}
			</div>

			{/* Background Glow - only show if NOT inactive */}
			{variant === "primary" && !isInactive && (
				<div className="absolute inset-0 z-0 bg-primary opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-20" />
			)}
		</button>
	);
};