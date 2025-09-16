import PaymentStatusPoller from "../../../../../../components/auth/register/PaymentStatusPoller";

const page = async ({ params }: { params: Promise<{ order_id: string }> }) => {
	const { order_id } = await params;
	console.log("Order ID in catch page:", order_id);
	return (
		<div>
			<PaymentStatusPoller paymentId={order_id} />
		</div>
	);
};

export default page;
