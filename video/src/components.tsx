import React from 'react';
import {
	AbsoluteFill,
	Img,
	interpolate,
	random,
	staticFile,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import {C, ease, easeInOut, fmtIN, sans} from './theme';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

export const prog = (frame: number, start: number, dur: number, e = ease) =>
	interpolate(frame, [start, start + dur], [0, 1], {...clamp, easing: e});

/** Full-bleed photo plate with a slow, continuous camera move. */
export const Plate: React.FC<{
	src: string;
	from?: number;
	to?: number;
	panX?: number;
	panY?: number;
	dim?: number;
	tint?: string;
}> = ({src, from = 1.06, to = 1.16, panX = -30, panY = -10, dim = 0.35, tint}) => {
	const frame = useCurrentFrame();
	const {durationInFrames} = useVideoConfig();
	const t = interpolate(frame, [0, durationInFrames], [0, 1], {...clamp, easing: easeInOut});
	const s = from + (to - from) * t;
	return (
		<AbsoluteFill style={{overflow: 'hidden', background: C.navy}}>
			<Img
				src={staticFile(src)}
				style={{
					width: '100%',
					height: '100%',
					objectFit: 'cover',
					transform: `translate(${panX * t}px, ${panY * t}px) scale(${s})`,
					filter: 'saturate(0.9) contrast(1.05)',
				}}
			/>
			<AbsoluteFill style={{background: `rgba(4, 12, 32, ${dim})`}} />
			{tint && <AbsoluteFill style={{background: tint}} />}
		</AbsoluteFill>
	);
};

/** Left-weighted scrim so type always sits on a calm, readable field. */
export const Scrim: React.FC<{strength?: number; width?: number}> = ({strength = 0.85, width = 60}) => (
	<AbsoluteFill
		style={{
			background: `linear-gradient(90deg, rgba(4,12,32,${strength}) 0%, rgba(4,12,32,${strength * 0.75}) ${width * 0.55}%, rgba(4,12,32,0) ${width}%)`,
		}}
	/>
);

/** Deep navy field with a slow-moving glow and faint grid. */
export const NavyField: React.FC = () => {
	const frame = useCurrentFrame();
	const x = 70 + Math.sin(frame / 90) * 8;
	const y = 30 + Math.cos(frame / 110) * 6;
	return (
		<AbsoluteFill
			style={{
				background: `radial-gradient(1200px 800px at ${x}% ${y}%, #12326f 0%, ${C.navy2} 40%, ${C.navy} 100%)`,
			}}
		>
			<AbsoluteFill
				style={{
					backgroundImage: `radial-gradient(rgba(140,190,255,0.10) 1.2px, transparent 1.2px)`,
					backgroundSize: '36px 36px',
					backgroundPosition: `${(frame * 0.15) % 36}px 0px`,
					maskImage: 'radial-gradient(ellipse at 70% 40%, black 0%, transparent 70%)',
					WebkitMaskImage: 'radial-gradient(ellipse at 70% 40%, black 0%, transparent 70%)',
				}}
			/>
		</AbsoluteFill>
	);
};

/** Small tracked-out label with a line that draws in first. */
export const Kicker: React.FC<{text: string; delay?: number; color?: string}> = ({
	text,
	delay = 0,
	color = C.teal,
}) => {
	const frame = useCurrentFrame();
	const line = prog(frame, delay, 18);
	const txt = prog(frame, delay + 6, 22);
	return (
		<div style={{display: 'flex', alignItems: 'center', gap: 18, height: 24}}>
			<div style={{width: 44 * line, height: 2, background: color}} />
			<div
				style={{
					fontFamily: sans,
					fontWeight: 500,
					fontSize: 17,
					letterSpacing: interpolate(txt, [0, 1], [14, 6.5]),
					textTransform: 'uppercase',
					color,
					opacity: txt,
					whiteSpace: 'nowrap',
				}}
			>
				{text}
			</div>
		</div>
	);
};

type Part = string | {t: string; accent?: boolean};

/** Headline that rises word by word out of a mask, sharpening as it lands. */
export const Reveal: React.FC<{
	lines: Part[][];
	delay?: number;
	size?: number;
	weight?: number;
	stagger?: number;
	lineHeight?: number;
	color?: string;
}> = ({lines, delay = 0, size = 76, weight = 500, stagger = 2.5, lineHeight = 1.12, color = C.white}) => {
	const frame = useCurrentFrame();
	let i = 0;
	return (
		<div style={{fontFamily: sans, fontWeight: weight, fontSize: size, lineHeight, color, letterSpacing: -size * 0.02}}>
			{lines.map((parts, li) => (
				<div key={li} style={{display: 'block', whiteSpace: 'nowrap'}}>
					{parts.flatMap((p, pi) => {
						const obj = typeof p === 'string' ? {t: p} : p;
						return obj.t.split(' ').filter(Boolean).map((w, wi) => {
							const p0 = prog(frame, delay + i++ * stagger, 26);
							return (
								<span
									key={`${pi}-${wi}`}
									style={{display: 'inline-block', overflow: 'hidden', verticalAlign: 'top', paddingBottom: size * 0.12, marginBottom: -size * 0.12}}
								>
									<span
										style={{
											display: 'inline-block',
											transform: `translateY(${(1 - p0) * 105}%)`,
											filter: `blur(${(1 - p0) * 8}px)`,
											opacity: Math.min(1, p0 * 1.6),
											color: obj.accent ? C.teal : undefined,
											marginRight: size * 0.26,
										}}
									>
										{w}
									</span>
								</span>
							);
						});
					})}
				</div>
			))}
		</div>
	);
};

export const Fade: React.FC<{delay?: number; dur?: number; y?: number; children: React.ReactNode; style?: React.CSSProperties}> = ({
	delay = 0,
	dur = 24,
	y = 24,
	children,
	style,
}) => {
	const frame = useCurrentFrame();
	const p = prog(frame, delay, dur);
	return <div style={{opacity: p, transform: `translateY(${(1 - p) * y}px)`, filter: `blur(${(1 - p) * 4}px)`, ...style}}>{children}</div>;
};

/** Count-up that decelerates into its final figure. */
export const Counter: React.FC<{
	to: number;
	delay?: number;
	dur?: number;
	decimals?: number;
	prefix?: string;
	suffix?: React.ReactNode;
	size?: number;
	color?: string;
	weight?: number;
}> = ({to, delay = 0, dur = 50, decimals = 0, prefix = '', suffix, size = 64, color = C.white, weight = 500}) => {
	const frame = useCurrentFrame();
	const p = prog(frame, delay, dur, ease);
	const v = to * p;
	const shown = decimals ? v.toFixed(decimals) : fmtIN(v);
	return (
		<span
			style={{
				fontFamily: sans,
				fontWeight: weight,
				fontSize: size,
				color,
				fontVariantNumeric: 'tabular-nums',
				letterSpacing: -size * 0.02,
				opacity: interpolate(frame, [delay, delay + 8], [0, 1], clamp),
			}}
		>
			{prefix}
			{shown}
			{suffix}
		</span>
	);
};

/** Animated film grain + vignette — takes the "digital" edge off everything. */
export const Finish: React.FC = () => {
	const frame = useCurrentFrame();
	const seed = Math.floor(frame / 2) % 8;
	return (
		<AbsoluteFill style={{pointerEvents: 'none'}}>
			<AbsoluteFill style={{background: 'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.55) 100%)'}} />
			<svg width="100%" height="100%" style={{position: 'absolute', opacity: 0.07, mixBlendMode: 'overlay'}}>
				<filter id={`g${seed}`}>
					<feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={seed} stitchTiles="stitch" />
					<feColorMatrix type="saturate" values="0" />
				</filter>
				<rect width="100%" height="100%" filter={`url(#g${seed})`} />
			</svg>
		</AbsoluteFill>
	);
};

/** Diagonal light sweep used to cover scene changes. */
export const LightSweep: React.FC<{at: number; dur?: number}> = ({at, dur = 22}) => {
	const frame = useCurrentFrame();
	const p = interpolate(frame, [at - dur / 2, at + dur / 2], [0, 1], {...clamp, easing: easeInOut});
	if (p <= 0 || p >= 1) return null;
	const x = interpolate(p, [0, 1], [-60, 160]);
	return (
		<AbsoluteFill
			style={{
				pointerEvents: 'none',
				mixBlendMode: 'screen',
				background: `linear-gradient(105deg, transparent ${x - 30}%, rgba(63,208,192,0.10) ${x - 12}%, rgba(200,250,255,0.28) ${x}%, rgba(63,208,192,0.10) ${x + 12}%, transparent ${x + 30}%)`,
			}}
		/>
	);
};

/** Glass panel used for data cards. */
export const Panel: React.FC<{style?: React.CSSProperties; children: React.ReactNode}> = ({style, children}) => (
	<div
		style={{
			background: 'linear-gradient(160deg, rgba(20,48,104,0.72), rgba(8,22,56,0.72))',
			border: `1px solid ${C.line}`,
			borderRadius: 18,
			boxShadow: '0 30px 80px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.06)',
			backdropFilter: 'blur(14px)',
			...style,
		}}
	>
		{children}
	</div>
);

export const Small: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
	<div style={{fontFamily: sans, fontSize: 20, color: C.mute, fontWeight: 400, ...style}}>{children}</div>
);

/** Rising particles — subtle depth on flat navy scenes. */
export const Dust: React.FC<{count?: number}> = ({count = 40}) => {
	const frame = useCurrentFrame();
	return (
		<AbsoluteFill style={{pointerEvents: 'none'}}>
			{new Array(count).fill(0).map((_, i) => {
				const x = random(`x${i}`) * 1920;
				const speed = 0.2 + random(`s${i}`) * 0.5;
				const y = (1080 + 40 - ((random(`y${i}`) * 1200 + frame * speed) % 1200));
				const r = 1 + random(`r${i}`) * 2;
				return (
					<div
						key={i}
						style={{
							position: 'absolute',
							left: x,
							top: y,
							width: r,
							height: r,
							borderRadius: r,
							background: C.teal,
							opacity: 0.15 + random(`o${i}`) * 0.3,
							boxShadow: `0 0 ${r * 4}px ${C.teal}`,
						}}
					/>
				);
			})}
		</AbsoluteFill>
	);
};
