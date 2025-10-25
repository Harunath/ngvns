import AgentNav from "../../components/common/navs/AgentNav";

function layout({ children }: { children: React.ReactNode }) {
	return (
		<div>
			<AgentNav />

			{children}
		</div>
	);
}

export default layout;
