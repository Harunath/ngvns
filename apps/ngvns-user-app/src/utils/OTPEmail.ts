import { SendMailClient } from "zeptomail";

export const SentEmailOtp = async (
	token: string,
	code: string,
	email: string
) => {
	const url = "api.zeptomail.in/v1.1/email/template";
	console.log("token ", token);
	console.log("code ", code);
	console.log("sending email");
	let client = new SendMailClient({ url, token });

	client
		.sendMailWithTemplate({
			mail_template_key:
				"2518b.2dc9118dcf91c792.k1.2a67ed00-66f5-11f0-8d58-8e9a6c33ddc2.198320cdfd0",
			from: {
				address: "noreply@navagrameen.org",
				name: "noreply",
			},
			to: [
				{
					email_address: {
						address: email,
						name: "NGVNS",
					},
				},
			],
			merge_info: { OTP: code },
		})
		.then((resp) => {
			console.log("success", resp);
			return "success";
		})
		.catch((error) => {
			console.log(error, "error");
			return "error";
		});
};
