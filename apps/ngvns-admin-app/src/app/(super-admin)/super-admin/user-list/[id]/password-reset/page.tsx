import PasswordResetPage from "../../../../../../components/common/actions/PasswordReset";

export default async function UserDetailsPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const p = await params;

	return (
		<>
			<PasswordResetPage id={p.id} />
		</>
	);
}
