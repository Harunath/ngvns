import Gallery from "../../components/home/Gallery";
import Hero from "../../components/home/Hero";
import Programs from "../../components/home/Programs";
import StayConnected from "../../components/home/StayConnected";
// import News from "../../components/home/News";
import Achievements from "../../components/home/Achievements";
import LiveStockEnergy from "../../components/home/LiveStockEnergy";
import Intro from "../../components/home/Intro";
import WhatWeDo from "../../components/home/WhatWeDo";
import ReachNetwork from "../../components/home/ReachNetwork";
import EcoProducts from "../../components/home/EcoProducts";

function page() {
	return (
		<>
			<Hero />
			<Intro />
			<WhatWeDo />
			<ReachNetwork />
			<EcoProducts />
			{/* <News /> */}
			<LiveStockEnergy />
			<Programs />
			<Gallery />
			<Achievements />
			<StayConnected />
		</>
	);
}

export default page;
