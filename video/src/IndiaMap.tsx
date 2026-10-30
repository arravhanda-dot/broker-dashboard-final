import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import india from '@svg-maps/india';
import {C, ease, sans} from './theme';
import {prog} from './components';

// Linear lon/lat -> viewBox fit, calibrated against small UTs (Delhi, Chandigarh, Goa, Sikkim, Tripura).
const px = (lon: number, lat: number) => [20.9 * lon - 1424.7, 863.6 - 22.9 * lat] as const;

type City = {n: string; lon: number; lat: number; label?: boolean; hq?: boolean};
const CITIES: City[] = [
	{n: 'Gurugram HQ', lon: 77.03, lat: 28.46, label: true, hq: true},
	{n: 'Delhi', lon: 77.21, lat: 28.75, label: true},
	{n: 'Chandigarh', lon: 76.78, lat: 30.73, label: true},
	{n: 'Jaipur', lon: 75.79, lat: 26.91, label: true},
	{n: 'Lucknow', lon: 80.95, lat: 26.85, label: true},
	{n: 'Ahmedabad', lon: 72.57, lat: 23.02, label: true},
	{n: 'Mumbai', lon: 72.88, lat: 19.08, label: true},
	{n: 'Pune', lon: 73.86, lat: 18.52, label: true},
	{n: 'Nagpur', lon: 79.09, lat: 21.15, label: true},
	{n: 'Hyderabad', lon: 78.49, lat: 17.39, label: true},
	{n: 'Kolkata', lon: 88.36, lat: 22.57, label: true},
	{n: 'Bengaluru', lon: 77.59, lat: 12.97, label: true},
	{n: 'Chennai', lon: 80.27, lat: 13.08, label: true},
	{n: 'Kochi', lon: 76.27, lat: 9.93, label: true},
	...(
		[
			[75.86, 22.72], [77.41, 23.26], [72.83, 21.17], [73.79, 20.0], [74.0, 15.4], [76.96, 11.0],
			[83.22, 17.69], [85.82, 20.3], [85.14, 25.6], [91.74, 26.14], [78.03, 30.32], [75.86, 30.9],
			[80.33, 26.45], [82.97, 25.32], [73.18, 22.31], [76.64, 12.3], [78.12, 9.93], [80.65, 16.5],
			[81.63, 21.25], [85.31, 23.34], [78.0, 27.18], [77.39, 28.54], [76.94, 8.52], [74.86, 12.91],
			[75.34, 19.88], [70.8, 22.3], [73.02, 26.24], [73.71, 24.58], [74.87, 31.63], [79.0, 22.2],
			[83.0, 21.5], [86.9, 23.7], [77.7, 29.9], [76.0, 28.0], [81.9, 25.4], [79.4, 28.4],
		] as const
	).map(([lon, lat], i) => ({n: `c${i}`, lon, lat})),
];

const SPOKES = ['Mumbai', 'Bengaluru', 'Kolkata', 'Hyderabad', 'Chennai', 'Ahmedabad', 'Lucknow', 'Pune'];

export const IndiaMap: React.FC<{delay?: number}> = ({delay = 0}) => {
	const frame = useCurrentFrame() - delay;
	const draw = prog(frame, 0, 70);
	const fill = prog(frame, 40, 40);
	const hq = px(77.03, 28.46);

	return (
		<svg viewBox="-20 -20 652 736" width={760} height={860} style={{overflow: 'visible'}}>
			<defs>
				<filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
					<feGaussianBlur stdDeviation="5" result="b" />
					<feMerge>
						<feMergeNode in="b" />
						<feMergeNode in="SourceGraphic" />
					</feMerge>
				</filter>
				<radialGradient id="mapfill" cx="40%" cy="35%" r="70%">
					<stop offset="0%" stopColor="#123a7a" />
					<stop offset="100%" stopColor="#0a2152" />
				</radialGradient>
				<radialGradient id="dotglow">
					<stop offset="0%" stopColor={C.teal} stopOpacity="0.9" />
					<stop offset="100%" stopColor={C.teal} stopOpacity="0" />
				</radialGradient>
			</defs>

			{/* outer glow outline, drawn on */}
			<g filter="url(#glow)">
				{india.locations.map((l) => (
					<path
						key={l.id}
						d={l.path}
						pathLength={1}
						fill="none"
						stroke={C.teal}
						strokeWidth={2.6}
						strokeDasharray={1}
						strokeDashoffset={1 - draw}
						strokeLinejoin="round"
					/>
				))}
			</g>
			{/* body fill hides internal edges of the glow stroke */}
			<g opacity={fill}>
				{india.locations.map((l) => (
					<path key={l.id} d={l.path} fill="url(#mapfill)" stroke="rgba(120,200,230,0.10)" strokeWidth={0.7} />
				))}
			</g>

			{/* arcs from HQ */}
			{SPOKES.map((name, i) => {
				const c = CITIES.find((x) => x.n === name)!;
				const [x, y] = px(c.lon, c.lat);
				const mx = (hq[0] + x) / 2 + (y - hq[1]) * 0.18;
				const my = (hq[1] + y) / 2 - Math.abs(x - hq[0]) * 0.25 - 20;
				const p = prog(frame, 95 + i * 6, 40);
				return (
					<path
						key={name}
						d={`M${hq[0]},${hq[1]} Q${mx},${my} ${x},${y}`}
						pathLength={1}
						fill="none"
						stroke={C.teal}
						strokeOpacity={0.55}
						strokeWidth={1.2}
						strokeDasharray={1}
						strokeDashoffset={1 - p}
					/>
				);
			})}

			{CITIES.map((c, i) => {
				const [x, y] = px(c.lon, c.lat);
				const start = 50 + (c.label ? i * 4 : 30 + (i % 36) * 1.6);
				const p = prog(frame, start, 22);
				const ring = ((frame - start) % 60) / 60;
				const r = c.hq ? 5 : c.label ? 3.6 : 2.2;
				return (
					<g key={c.n} opacity={p}>
						<circle cx={x} cy={y} r={r * 5} fill="url(#dotglow)" opacity={0.5} />
						{c.label && frame > start && (
							<circle cx={x} cy={y} r={r + ring * 16} fill="none" stroke={C.teal} strokeOpacity={(1 - ring) * 0.6} strokeWidth={1} />
						)}
						<circle cx={x} cy={y} r={r * interpolate(p, [0, 1], [2.2, 1], {easing: ease})} fill={c.hq ? '#ffffff' : C.teal} />
						{c.label && (
							<text
								x={x + (c.n === 'Delhi' ? 9 : c.n === 'Gurugram HQ' || c.n === 'Ahmedabad' || c.n === 'Mumbai' ? -10 : 9)}
								y={y + (c.n === 'Gurugram HQ' ? 4 : c.n === 'Delhi' ? -4 : 4)}
								textAnchor={c.n === 'Gurugram HQ' || c.n === 'Ahmedabad' || c.n === 'Mumbai' ? 'end' : 'start'}
								fontFamily={sans}
								fontSize={11.5}
								fontWeight={c.hq ? 600 : 500}
								fill={c.hq ? C.teal : 'rgba(230,240,255,0.88)'}
							>
								{c.n}
							</text>
						)}
					</g>
				);
			})}
		</svg>
	);
};
