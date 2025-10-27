"use client";
import React from "react";
import { toast } from "react-toastify";

const AddingTL = () => {
	const [userId, setUserId] = React.useState<string>("");
	const [userData, setUserData] = React.useState<any>(null);
	const handleGetUser = async () => {
		try {
			const response = await fetch("/api/manager/user/getuser", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ userId }),
			});
			const data = await response.json();
			setUserData(data);
			toast.success("User data fetched successfully!");
			console.log("User Data:", data);
		} catch (error) {
			toast.error("Error fetching user data.");
			console.error("Error fetching user data:", error);
		}
	};

	const handleAddTeamLeader = async () => {
		try {
			const response = await fetch("/api/manager/team-leaders", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ userId }),
			});
			const data = await response.json();

			if (response.ok) {
				toast.success("Team Leader added successfully!");
			} else {
				toast.error("Failed to add Team Leader.");
			}
			console.log("Add Team Leader Response:", data);
		} catch (error) {
			toast.error("Error adding team leader.");
			console.error("Error adding team leader:", error);
		}
	};
	return (
		<div>
			<h1>Add Team Leader Page</h1>
			<div>
				<label htmlFor="teamLeaderName">User ID</label>
				<input
					type="text"
					placeholder="Team Leader Name"
					value={userId}
					onChange={(e) => setUserId(e.target.value)}
				/>
				<button onClick={handleGetUser}>Get User</button>
			</div>
			{userData && (
				<div>
					<h2>User Data:</h2>
					<div>
						<p>Name : {userData.fullname}</p>
						<p>Phone : {userData.phone}</p>
						<p>VRKP ID : {userData.vrKpId}</p>
					</div>
					<button onClick={handleAddTeamLeader}>Add as Team Leader</button>
					<button onClick={() => setUserData(null)}>Reset User</button>
				</div>
			)}
		</div>
	);
};

export default AddingTL;
