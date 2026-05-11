import { connection } from "next/server";

export default async function DatabasePage({
	searchParams,
}: {
	searchParams: Promise<{ model?: string | string[] }>;
}) {
	await connection();

	const params = await searchParams;

	return (
		<div className="bg-red-500 text-white p-10">
  			Tailwind Test
		</div>
	);
}
