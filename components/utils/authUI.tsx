import { GraduationCap } from "lucide-react";

export const AuthLogo = () => (
	<div className="flex justify-center">
		<div className="relative flex h-[72px] w-[72px] items-center justify-center rounded-full bg-primary/10">
			<div className="animate-rotate-border absolute inset-[-3px] z-[-1] rounded-full opacity-30 [background:conic-gradient(from_0deg,transparent_0deg,var(--primary)_120deg,transparent_240deg,var(--primary)_360deg)]" />
			<div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary shadow-lg shadow-primary/30">
				<GraduationCap className="h-5 w-5 text-primary-foreground" />
			</div>
		</div>
	</div>
);

export const AuthHeader = ({ title, subtitle }: { title: string; subtitle: string }) => (
	<div className="mt-6 text-center">
		<h1 className="text-3xl font-extrabold tracking-tight text-foreground">{title}</h1>

		<p className="mt-4 text-sm font-medium text-muted-foreground">{subtitle}</p>
	</div>
);