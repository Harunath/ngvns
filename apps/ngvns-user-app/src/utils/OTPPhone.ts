export const OTPURI = ({
	username,
	apikey,
	senderid,
	mobile,
	message,
	templateid,
}: {
	username: string;
	apikey: string;
	senderid: string;
	mobile: string;
	message: string;
	templateid: string;
}) => {
	const params = `username=${username}&apikey=${apikey}&senderid=${senderid}&mobile=${mobile}&message=${message}&templateid=${templateid}`;
	console.log(
		"SMS API URL params:",
		`https://smslogin.co/v3/api.php?${params}`
	);
	return `https://smslogin.co/v3/api.php?${params}`;
};

export const verifyOTPURI = ({
	username,
	apikey,
	camid,
}: {
	username: string;
	apikey: string;
	camid: string;
}) => {
	const params = JSON.stringify({
		username: username,
		apikey: apikey,
		camid: camid,
	});
	console.log(
		"SMS API URL params:",
		`https://smslogin.co/v3/verify.php?${params}`
	);
	return `https://smslogin.co/v3/verify.php?${params}`;
};
