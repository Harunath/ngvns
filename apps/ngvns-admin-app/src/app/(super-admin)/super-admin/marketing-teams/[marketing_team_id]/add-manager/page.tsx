import React from "react";
import FetchingUser from "./FetchingUser";

const page = async ({
	params,
}: {
	params: Promise<{ marketing_team_id: string }>;
}) => {
	const { marketing_team_id: marketingTeamId } = await params;
	return (
		<div>
			<FetchingUser teamId={marketingTeamId} />
		</div>
	);
};

export default page;
