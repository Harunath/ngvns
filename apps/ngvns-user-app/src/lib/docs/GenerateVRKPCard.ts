async function generateCard() {
	const res = await fetch("/api/vrkp/card", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
	});

	if (!res.ok) throw new Error(await res.text());
	const blob = await res.blob();
	const url = URL.createObjectURL(blob);
	// e.g. set <img src={url} /> or trigger download:
	// const a = document.createElement("a");
	// a.href = url;
	// a.download = "vrkp-card.png";
	// a.click();
	return url;
}

export default generateCard;
