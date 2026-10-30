import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {C, FPS, PAD, ease, sans} from './theme';
import {Finish, LightSweep, prog} from './components';
import {Depth, Endcard, Ground, Heritage, Hook, Listed, MapScene, Stages, Trust, Wordmark} from './scenes';

// Scene starts (seconds) match the original cut so the existing music bed still lands.
const SCENES = [
	{at: 0, C: Hook, label: ''},
	{at: 5.3, C: Heritage, label: 'Heritage'},
	{at: 10, C: MapScene, label: 'The map'},
	{at: 20.3, C: Depth, label: 'Depth'},
	{at: 26.8, C: Stages, label: 'Coverage'},
	{at: 33, C: Trust, label: 'Trust'},
	{at: 41, C: Ground, label: 'On the ground'},
	{at: 47, C: Listed, label: 'Listed'},
	{at: 54, C: Endcard, label: ''},
];
export const TOTAL = Math.round(58.5 * FPS);
const OV = 14;
const starts = SCENES.map((s) => Math.round(s.at * FPS));

const Enter: React.FC<{first: boolean; children: React.ReactNode}> = ({first, children}) => {
	const frame = useCurrentFrame();
	const p = first ? 1 : prog(frame, 0, OV + 4);
	return (
		<AbsoluteFill style={{opacity: p, transform: `scale(${1.035 - 0.035 * p})`, filter: p < 1 ? `blur(${(1 - p) * 10}px)` : undefined}}>
			{children}
		</AbsoluteFill>
	);
};

const Hud: React.FC = () => {
	const frame = useCurrentFrame();
	const idx = starts.findLastIndex((s) => frame >= s);
	const s = SCENES[idx];
	const show = s.label !== '' && idx !== 1;
	const local = frame - starts[idx];
	const vis = show ? interpolate(local, [0, 16], [0, 1], {extrapolateRight: 'clamp', easing: ease}) : 0;
	const chapter = idx; // 1..7 for labelled scenes
	return (
		<AbsoluteFill style={{pointerEvents: 'none'}}>
			<div style={{position: 'absolute', inset: 0, height: 200, background: 'linear-gradient(180deg, rgba(4,12,32,0.6), transparent)', opacity: vis}} />
			<div style={{position: 'absolute', left: PAD, top: 64, opacity: vis * 0.9}}>
				<Wordmark size={26} />
			</div>
			<div style={{position: 'absolute', right: PAD, top: 66, opacity: vis, display: 'flex', gap: 16, alignItems: 'center', fontFamily: sans, fontSize: 15, letterSpacing: 4, color: C.mute}}>
				<span style={{color: C.teal, fontVariantNumeric: 'tabular-nums'}}>{String(chapter).padStart(2, '0')}</span>
				<span style={{width: 30, height: 1, background: C.mute}} />
				<span>{s.label.toUpperCase()}</span>
			</div>
			<div style={{position: 'absolute', left: 0, bottom: 0, height: 3, width: `${(frame / TOTAL) * 100}%`, background: C.teal, boxShadow: `0 0 12px ${C.teal}`, opacity: 0.85}} />
		</AbsoluteFill>
	);
};

export const PromoVideo: React.FC = () => {
	const frame = useCurrentFrame();
	const vol = interpolate(frame, [0, 10, TOTAL - 45, TOTAL], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	return (
		<AbsoluteFill style={{background: C.navy}}>
			<Audio src={staticFile('music.m4a')} volume={vol} />
			{SCENES.map((s, i) => {
				const end = i + 1 < starts.length ? starts[i + 1] + OV : TOTAL;
				return (
					<Sequence key={i} from={starts[i]} durationInFrames={end - starts[i]}>
						<Enter first={i === 0}>
							<s.C />
						</Enter>
					</Sequence>
				);
			})}
			{starts.slice(1).map((st) => (
				<LightSweep key={st} at={st + OV / 2} dur={26} />
			))}
			<Hud />
			<Finish />
		</AbsoluteFill>
	);
};
