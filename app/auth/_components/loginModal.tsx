import { AnimatedButton } from "@/components/button/animatedButton";
import { AnimatedLink } from "@/components/text/animatedLink";
import { AnimatedTextField } from "@/components/text/animatedTextField";
import { AnimatedCard } from "@/components/utils/animatedCard";
import { AnimatedSeparator } from "@/components/utils/animatedSeparator";
import { AuthHeader, AuthLogo } from "@/components/utils/authUI";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();

    return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4">
            {/* Background Decor*/}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full" />
                <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-red-500/5 blur-[120px] rounded-full" />
            </div>

            <AnimatedCard maxWidth="440px" padding="lg">
                <AuthLogo />
                <AuthHeader title="Welcome Back" subtitle="Access your academic preparation dashboard" />

                <form className="mt-8 space-y-4">
                    <AnimatedTextField label="Email" type="email" sizeConfig="md"/>
                    <AnimatedTextField label="Password" type="password" sizeConfig="md"/>
                    <AnimatedLink className="text-sm text-primary hover:underline" text="Forgot your password?" align="right" disableAnimation={true} />
                    <AnimatedButton label="Sign In" className="w-full" />
                </form>

                <AnimatedSeparator text="or" />

                <div className="grid grid-cols-2 gap-4">
                    <AnimatedButton variant="outline" label="Google" />
                    <AnimatedButton variant="outline" label="Apple" />
                </div>

                <AnimatedLink
                    prefixText="Don't have an account?"
                    text="Start your journey"
                    align="center"
                    className="mt-8"
                    onClick={() => {
                        // redirect to signup page logic here
                        router.push("/auth/signup");
                    }}
                />
            </AnimatedCard>
        </div>
    );
}