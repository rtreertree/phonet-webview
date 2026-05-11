"use client";

import { AnimatedButton } from "@/components/button/animatedButton";
import { AnimatedTextField } from "@/components/text/animatedTextField";
import { AnimatedSeparator } from "@/components/utils/animatedSeparator";
import { Apple, LogIn, Sparkles } from "lucide-react";


export default function Home() {
	return (
		<>
			<div className="space-y-6 p-10">
				{/* Small Scale: Compact height, smaller text */}
				<AnimatedTextField
					sizeConfig="sm"
					label="Small Field"
					placeholder="Compact UI"
				/>

				{/* Medium Scale: The default aesthetic */}
				<AnimatedTextField
					sizeConfig="md"
					label="Medium Field"
					placeholder="Balanced UI"
				/>

				{/* Large Scale: High prominence, taller, larger text */}
				<AnimatedTextField
					sizeConfig="lg"
					label="Large Field"
					placeholder="Hero/Focus UI"
				/>
			</div>
			<AnimatedSeparator text="Or Continue With" sizeConfig="md" />
			<div className="flex flex-col gap-6 p-10 max-w-sm">
				{/* Primary Large with Shimmer & Icon */}
				<AnimatedButton
					sizeConfig="lg"
					label="Get Started"
					icon={<Sparkles size={18} />}
				/>
				<AnimatedButton
					sizeConfig="lg"
					label="Get Started"
					icon={<Sparkles size={18} />}
					disabled={true}
				/>

				{/* Medium Primary (Default) */}
				<AnimatedButton
					label="Sign In"
					icon={<LogIn size={16} />}
				/>
				<AnimatedButton
					label="Sign In"
					icon={<LogIn size={16} />}
					disabled={true}

				/>

				{/* Secondary Small */}
				<AnimatedButton
					variant="secondary"
					sizeConfig="sm"
					label="Learn More"

				/>
				<AnimatedButton
					variant="secondary"
					sizeConfig="sm"
					label="Learn More"
					disabled={true}

				/>

				{/* Outline Social Button */}
				<AnimatedButton
					variant="outline"
					label="Continue with Apple"
					icon={<Apple size={18} />}
				/>
				<AnimatedButton
					variant="outline"
					label="Continue with Apple"
					icon={<Apple size={18} />}
					disabled={true}

				/>

				{/* Loading State */}
				<AnimatedButton
					isLoading={true}
					label="Processing..."
				/>
			</div>
		</>
	);
}
