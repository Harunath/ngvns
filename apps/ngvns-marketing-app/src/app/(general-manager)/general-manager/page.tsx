import React from "react";
import Referral from "../../../components/common/Referral";
import ReferralCount from "../../../components/common/ReferralCount";

const page = () => {
	return (
		<div>
			General Manager Dashboard
			<ReferralCount />
			<Referral />
			<p>more features coming soon</p>
		</div>
	);
};

export default page;
