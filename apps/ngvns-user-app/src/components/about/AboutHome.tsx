import React from "react";
import AboutBanner from "./AboutBanner";
import WhoWeAre from "./WhoWeAre";
import Vision from "./Vision";
import Mission from "./Mission";
// import JoinCTA from "./JoinCta";
function AboutHome() {
	return (
		<>
			<AboutBanner />
			<WhoWeAre />
			<Vision />
			<Mission />
			{/* <JoinCTA /> */}
		</>
	);
}

export default AboutHome;
