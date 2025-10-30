"use client";
import React, { useEffect, useState } from "react";
import CountStatCard from "./CountStatCard";
import PresetRangeButtons from "./PresetRangeButtons";
import DateRangeControls from "./DateRangeControls";
import {
	presetLast7Days,
	presetToday1Day,
	todayIstYmd,
	addDaysIstYmd,
} from "../../lib/time/ist";

type ApiResp = {
	ok: boolean;
	teamId: string;
	rangeUtc: { gte: string; lt: string };
	count: number;
	error?: string;
};

async function fetchCount(
	teamId: string,
	fromIstYmd: string,
	toIstYmd: string
) {
	const url = `/api/manager/join-count?teamId=${encodeURIComponent(
		teamId
	)}&from=${fromIstYmd}&to=${toIstYmd}`;
	const res = await fetch(url, { cache: "no-store" });
	if (!res.ok) throw new Error(`Request failed (${res.status})`);
	const data: ApiResp = await res.json();
	if (!data.ok) throw new Error(data.error || "unknown_error");
	return data.count;
}

export default function MarketingJoinStats({ teamId }: { teamId: string }) {
	// presets state
	const [todayCount, setTodayCount] = useState<number | null>(null);
	const [todayLoading, setTodayLoading] = useState(true);
	const [todayError, setTodayError] = useState<string | null>(null);

	const [w7Count, setW7Count] = useState<number | null>(null);
	const [w7Loading, setW7Loading] = useState(true);
	const [w7Error, setW7Error] = useState<string | null>(null);

	// custom
	const defaultCustomFrom = todayIstYmd();
	const defaultCustomTo = addDaysIstYmd(defaultCustomFrom, 1);

	const [cFrom, setCFrom] = useState(defaultCustomFrom);
	const [cTo, setCTo] = useState(defaultCustomTo);
	const [cCount, setCCount] = useState<number | null>(null);
	const [cLoading, setCLoading] = useState(false);
	const [cError, setCError] = useState<string | null>(null);
	const [cLabel, setCLabel] = useState("Custom Range");

	// Load defaults
	useEffect(() => {
		const load = async () => {
			// Today
			try {
				const { from, to } = presetToday1Day();
				setTodayLoading(true);
				const count = await fetchCount(teamId, from, to);
				setTodayCount(count);
				setTodayError(null);
			} catch (e: any) {
				setTodayError(e.message);
			} finally {
				setTodayLoading(false);
			}

			// Last 7 days
			try {
				const { from, to } = presetLast7Days();
				setW7Loading(true);
				const count = await fetchCount(teamId, from, to);
				setW7Count(count);
				setW7Error(null);
			} catch (e: any) {
				setW7Error(e.message);
			} finally {
				setW7Loading(false);
			}
		};
		load();
	}, [teamId]);

	// handlers
	const handlePreset = async (from: string, to: string, label: string) => {
		setCFrom(from);
		setCTo(to);
		setCLabel(label);
		setCLoading(true);
		setCError(null);
		try {
			const count = await fetchCount(teamId, from, to);
			setCCount(count);
		} catch (e: any) {
			setCError(e.message);
		} finally {
			setCLoading(false);
		}
	};

	const handleCustomFetch = async (from: string, to: string) => {
		setCFrom(from);
		setCTo(to);
		setCLabel("Custom Range");
		setCLoading(true);
		setCError(null);
		try {
			const count = await fetchCount(teamId, from, to);
			setCCount(count);
		} catch (e: any) {
			setCError(e.message);
		} finally {
			setCLoading(false);
		}
	};

	return (
		<div className="space-y-6">
			{/* Presets Row */}
			<div className="flex flex-col gap-4">
				<PresetRangeButtons onSelect={handlePreset} />
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
					{/* Today (1 day) */}
					<CountStatCard
						title="Today"
						count={todayCount}
						loading={todayLoading}
						error={todayError}
						fromIstYmd={presetToday1Day().from}
						toIstYmd={presetToday1Day().to}
					/>

					{/* Last 7 Days */}
					<CountStatCard
						title="Last 7 days"
						count={w7Count}
						loading={w7Loading}
						error={w7Error}
						fromIstYmd={presetLast7Days().from}
						toIstYmd={presetLast7Days().to}
					/>
				</div>
			</div>

			{/* Custom range */}
			<div className="rounded-2xl border bg-white p-4 sm:p-5 shadow-sm">
				<div className="flex items-center justify-between">
					<h3 className="text-base font-semibold text-gray-900">Custom</h3>
				</div>

				<div className="mt-4 flex flex-col gap-4">
					<DateRangeControls
						defaultFromIstYmd={cFrom}
						defaultToIstYmd={cTo}
						onFetch={handleCustomFetch}
					/>

					<CountStatCard
						title={cLabel}
						count={cCount}
						loading={cLoading}
						error={cError}
						fromIstYmd={cFrom}
						toIstYmd={cTo}
					/>
				</div>
			</div>
		</div>
	);
}
