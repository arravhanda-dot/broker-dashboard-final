import React from 'react';
import {AbsoluteFill, Img, interpolate, random, staticFile, useCurrentFrame} from 'remotion';
import {C, PAD, ease, sans, serif} from './theme';
import {Counter, Dust, Fade, Kicker, NavyField, Panel, Plate, Reveal, Scrim, Small, prog} from './components';
import {IndiaMap} from './IndiaMap';

const Left: React.FC<{top?: number; children: React.ReactNode}> = ({top = 250, children}) => (
	<div style={{position: 'absolute', left: PAD, top}}>{children}</div>
);

const Wordmark: React.FC<{size?: number; sub?: boolean; reveal?: number}> = ({size = 34, sub = false, reveal = 1}) => (
	<div style={{color: C.white}}>
		<div
			style={{
				fontFamily: serif,
				fontSize: size,
				letterSpacing: interpolate(reveal, [0, 1], [size * 0.45, size * 0.04]),
				lineHeight: 1,
				opacity: reveal,
				filter: `blur(${(1 - reveal) * 6}px)`,
			}}
		>
			PropEquity
		</div>
		{sub && (
			<div style={{fontFamily: sans, fontSize: size * 0.17, letterSpacing: size * 0.06, marginTop: size * 0.22, color: C.mute, opacity: reveal}}>
				CREATING INVESTOR INTELLIGENCE
			</div>
		)}
	</div>
);

/* 1 — Hook ------------------------------------------------------------- */
export const Hook: React.FC = () => {
	const frame = useCurrentFrame();
	const nodes = new Array(26).fill(0).map((_, i) => ({
		x: 760 + random(`nx${i}`) * 1080,
		y: 120 + random(`ny${i}`) * 820,
		d: 8 + random(`nd${i}`) * 60,
	}));
	const underline = prog(frame, 62, 30);
	return (
		<AbsoluteFill>
			<Plate src="plates/night.jpg" from={1.18} to={1.04} panX={40} panY={10} dim={0.25} />
			<svg width={1920} height={1080} style={{position: 'absolute'}}>
				{nodes.map((a, i) =>
					nodes.slice(i + 1).map((b, j) => {
						const dist = Math.hypot(a.x - b.x, a.y - b.y);
						if (dist > 260) return null;
						const p = prog(frame, Math.max(a.d, b.d) + 10, 30);
						return <line key={`${i}-${j}`} x1={a.x} y1={a.y} x2={a.x + (b.x - a.x) * p} y2={a.y + (b.y - a.y) * p} stroke={C.teal} strokeOpacity={0.28} strokeWidth={1} />;
					}),
				)}
				{nodes.map((n, i) => {
					const p = prog(frame, n.d, 20);
					const pulse = 0.6 + 0.4 * Math.sin((frame + i * 9) / 8);
					return (
						<g key={i} opacity={p}>
							<circle cx={n.x} cy={n.y} r={14 * pulse} fill={C.teal} opacity={0.12} />
							<circle cx={n.x} cy={n.y} r={3.2} fill={C.teal} />
						</g>
					);
				})}
			</svg>
			<Scrim strength={0.8} width={58} />
			<Left top={410}>
				<Reveal lines={[['Every number in Indian'], ['real estate has a', {t: 'source.', accent: true}]]} delay={8} size={84} stagger={3.5} />
				<div style={{marginLeft: 650, marginTop: 6, width: 250 * underline, height: 3, background: C.teal, boxShadow: `0 0 18px ${C.teal}`}} />
			</Left>
		</AbsoluteFill>
	);
};

/* 2 — Heritage --------------------------------------------------------- */
export const Heritage: React.FC = () => {
	const frame = useCurrentFrame();
	const year = Math.round(interpolate(frame, [10, 90], [2008, 2026], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease}));
	return (
		<AbsoluteFill>
			<Plate src="plates/skyline.jpg" from={1.04} to={1.14} panX={-50} dim={0.2} tint="linear-gradient(180deg, rgba(10,30,70,0.25), rgba(4,12,32,0.35))" />
			<Scrim strength={0.82} width={55} />
			<Left top={330}>
				<Kicker text="Since 2008 · Gurugram" delay={4} />
				<div style={{height: 26}} />
				<Reveal lines={[['For 18 years,'], ['it has been', {t: 'us.', accent: true}]]} delay={10} size={84} stagger={3.5} />
				<Fade delay={52} style={{marginTop: 60}}>
					<Wordmark size={56} sub reveal={prog(frame, 52, 36)} />
				</Fade>
			</Left>
			<div style={{position: 'absolute', right: PAD, bottom: 120, textAlign: 'right', opacity: prog(frame, 6, 20)}}>
				<div style={{fontFamily: sans, fontWeight: 300, fontSize: 150, color: 'rgba(255,255,255,0.16)', letterSpacing: -4, fontVariantNumeric: 'tabular-nums', lineHeight: 1}}>{year}</div>
			</div>
		</AbsoluteFill>
	);
};

/* 3 — Map -------------------------------------------------------------- */
const Stat: React.FC<{to: number; decimals?: number; unit?: string; label: string; delay: number}> = ({to, decimals, unit, label, delay}) => (
	<div style={{width: 320}}>
		<Fade delay={delay - 4} dur={14} y={0}>
			<div style={{width: 36, height: 2, background: C.teal, marginBottom: 18}} />
		</Fade>
		<Counter
			to={to}
			decimals={decimals}
			delay={delay}
			dur={150}
			size={60}
			suffix={
				<span style={{fontSize: unit ? 26 : 60, fontWeight: 500, marginLeft: unit ? 8 : 0}}>
					{unit ?? ''}+
				</span>
			}
		/>
		<Fade delay={delay + 6}>
			<Small style={{marginTop: 6}}>{label}</Small>
		</Fade>
	</div>
);

export const MapScene: React.FC = () => {
	const frame = useCurrentFrame();
	const s = interpolate(frame, [0, 320], [0.96, 1.04]);
	return (
		<AbsoluteFill>
			<NavyField />
			<Dust count={30} />
			<Left top={230}>
				<Kicker text="The map" delay={6} />
				<div style={{height: 26}} />
				<Reveal lines={[["India's 50+ biggest"], ['housing markets, mapped'], ['project by project.']]} delay={12} size={64} stagger={2.5} />
				<div style={{display: 'grid', gridTemplateColumns: '320px 320px', rowGap: 50, marginTop: 90}}>
					<Stat to={195000} label="projects tracked" delay={60} />
					<Stat to={70000} label="developers" delay={68} />
					<Stat to={1.41} decimals={2} unit="crore" label="homes covered" delay={76} />
					<Stat to={7400} label="localities" delay={84} />
				</div>
			</Left>
			<div style={{position: 'absolute', left: 1040, top: 110, transform: `scale(${s})`, transformOrigin: '50% 40%'}}>
				<IndiaMap delay={14} />
			</div>
		</AbsoluteFill>
	);
};

/* 4 — Depth ------------------------------------------------------------ */
const FIELDS = [
	['Launch price', 'Current price'],
	['Carpet area', 'Unit configuration'],
	['Construction status', 'Possession date'],
	['Unsold inventory', 'Sales velocity'],
	['RERA registration', 'Developer track record'],
];

const Check: React.FC<{p: number}> = ({p}) => (
	<svg width={22} height={22} viewBox="0 0 22 22">
		<circle cx={11} cy={11} r={10} fill={C.teal} opacity={0.18 + 0.82 * p} />
		<path d="M6.5 11.5 L9.6 14.4 L15.5 8" fill="none" stroke={C.navy} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
	</svg>
);

export const Depth: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<AbsoluteFill>
			<Plate src="plates/towers.jpg" from={1.05} to={1.15} panX={-60} panY={-10} dim={0.25} />
			<Scrim strength={0.88} width={62} />
			<Left top={170}>
				<Kicker text="Depth" delay={4} />
				<div style={{height: 26}} />
				<Reveal lines={[['Over', {t: '1 billion', accent: true}], ['data points.']]} delay={10} size={80} stagger={3} />
				<Fade delay={36} y={40} style={{marginTop: 54}}>
					<Panel style={{width: 760, padding: '34px 40px 30px'}}>
						<div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline'}}>
							<div style={{fontFamily: sans, fontSize: 15, letterSpacing: 4, color: C.mute}}>EVERY HOME, PROFILED</div>
							<Counter to={100} delay={44} dur={110} size={36} color={C.teal} suffix="+" />
						</div>
						<div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: 40, marginTop: 22}}>
							{FIELDS.flat().map((f, i) => {
								const row = Math.floor(i / 2);
								const p = prog(frame, 50 + row * 9 + (i % 2) * 4, 18);
								return (
									<div key={f} style={{display: 'flex', alignItems: 'center', gap: 14, padding: '13px 0', borderBottom: `1px solid ${C.line}`, opacity: 0.25 + 0.75 * p}}>
										<Check p={p} />
										<span style={{fontFamily: sans, fontSize: 19, color: C.white}}>{f}</span>
										<div style={{flex: 1, height: 2, marginLeft: 6, background: `linear-gradient(90deg, ${C.tealSoft} ${p * 100}%, transparent ${p * 100}%)`}} />
									</div>
								);
							})}
						</div>
						<Fade delay={110}>
							<Small style={{fontSize: 17, marginTop: 18}}>…and 90 more fields, for every home, across 18+ years.</Small>
						</Fade>
					</Panel>
				</Fade>
			</Left>
		</AbsoluteFill>
	);
};

/* 5 — Stages ----------------------------------------------------------- */
const STAGES = [
	['Launch', 'Price, units, approvals'],
	['Construction', 'Progress & delays'],
	['Sales', 'Absorption & unsold stock'],
	['Possession', 'Delivery against promise'],
];

export const Stages: React.FC = () => {
	const frame = useCurrentFrame();
	const x0 = PAD + 20;
	const x1 = 1920 - PAD - 20;
	const line = prog(frame, 24, 110);
	return (
		<AbsoluteFill>
			<Plate src="plates/construction.jpg" from={1.04} to={1.14} panX={-40} dim={0.3} tint="linear-gradient(180deg, rgba(4,12,32,0.55) 0%, rgba(4,12,32,0.05) 45%, rgba(4,12,32,0.85) 100%)" />
			<Left top={170}>
				<Kicker text="Launch to possession" delay={4} />
				<div style={{height: 26}} />
				<Reveal lines={[['Tracked at', {t: 'every stage.', accent: true}]]} delay={10} size={80} stagger={3} />
			</Left>
			<div style={{position: 'absolute', left: x0, top: 742, width: x1 - x0, height: 2, background: 'rgba(255,255,255,0.14)'}} />
			<div style={{position: 'absolute', left: x0, top: 741, width: (x1 - x0) * line, height: 4, background: C.teal, boxShadow: `0 0 20px ${C.teal}`, borderRadius: 2}} />
			{STAGES.map(([t, s], i) => {
				const pos = i / (STAGES.length - 1);
				const p = prog(frame, 24 + pos * 110 - 6, 20);
				const left = x0 + (x1 - x0) * pos;
				const align = i === 0 ? 'flex-start' : i === STAGES.length - 1 ? 'flex-end' : 'center';
				return (
					<div key={t} style={{position: 'absolute', left: left - 150, top: 718, width: 300, display: 'flex', flexDirection: 'column', alignItems: align, transform: i === 0 ? 'translateX(127px)' : i === STAGES.length - 1 ? 'translateX(-127px)' : undefined}}>
						<div style={{width: 46, height: 46, borderRadius: 46, border: `2px solid ${C.teal}`, background: p > 0.5 ? C.teal : C.navy, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: sans, fontWeight: 600, fontSize: 18, color: p > 0.5 ? C.navy : C.teal, transform: `scale(${0.4 + 0.6 * p})`, opacity: Math.min(1, p * 2), boxShadow: `0 0 ${30 * p}px ${C.tealSoft}`}}>
							{i + 1}
						</div>
						<div style={{opacity: p, transform: `translateY(${(1 - p) * 16}px)`, textAlign: i === 0 ? 'left' : i === STAGES.length - 1 ? 'right' : 'center', marginTop: 22}}>
							<div style={{fontFamily: sans, fontWeight: 500, fontSize: 28, color: C.white}}>{t}</div>
							<Small style={{marginTop: 4}}>{s}</Small>
						</div>
					</div>
				);
			})}
			<div style={{position: 'absolute', left: PAD, top: 930}}>
				<Fade delay={120}>
					<span style={{fontFamily: sans, fontSize: 24, color: C.white}}>
						Plus <Counter to={6} delay={120} dur={40} size={24} color={C.teal} weight={600} suffix=" million+" /> property registration records.
					</span>
				</Fade>
			</div>
		</AbsoluteFill>
	);
};

/* 6 — Trust ------------------------------------------------------------ */
const DEVS = ['lodha', 'mahindra', 'prestige', 'shriram', 'brookfield', 'dlf'];
const BANKS = ['piramal', 'yes', 'axis', 'hdfc', 'icici', 'idfc'];

const Marquee: React.FC<{logos: string[]; speed: number; delay: number}> = ({logos, speed, delay}) => {
	const frame = useCurrentFrame();
	const item = 300;
	const loop = logos.length * item;
	const off = ((frame * speed) % loop + loop) % loop;
	const mask = 'linear-gradient(90deg, transparent 0%, black 10%, black 90%, transparent 100%)';
	return (
		<div style={{position: 'relative', height: 96, width: 1680, overflow: 'hidden', maskImage: mask, WebkitMaskImage: mask, opacity: prog(frame, delay, 24), borderTop: `1px solid ${C.line}`, borderBottom: `1px solid ${C.line}`, background: 'rgba(10,30,70,0.35)'}}>
			<div style={{position: 'absolute', top: 0, left: -off, display: 'flex', height: 96, alignItems: 'center'}}>
				{[...logos, ...logos, ...logos].map((l, i) => (
					<div key={i} style={{width: item, display: 'flex', justifyContent: 'center'}}>
						<Img src={staticFile(`logos/${l}.png`)} style={{height: 64, opacity: 0.92}} />
					</div>
				))}
			</div>
		</div>
	);
};

export const Trust: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<AbsoluteFill>
			<NavyField />
			<Left top={130}>
				<Kicker text="Trusted by 300+ institutions" delay={4} />
				<div style={{height: 24}} />
				<div style={{display: 'flex', alignItems: 'flex-start'}}>
					<Reveal lines={[[{t: '80%', accent: true}, "of India's top 100"], ['developers run on our data.']]} delay={10} size={68} stagger={2.5} />
				</div>
			</Left>
			{/* 10x10 developer matrix */}
			<div style={{position: 'absolute', right: PAD + 10, top: 110, display: 'grid', gridTemplateColumns: 'repeat(10, 30px)', gap: 8}}>
				{new Array(100).fill(0).map((_, i) => {
					const on = i < 80;
					const p = prog(frame, 20 + (i % 10) * 1.2 + Math.floor(i / 10) * 2.6, 14);
					return (
						<div key={i} style={{width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
							<div style={{width: 13, height: 13, borderRadius: 13, background: on ? C.teal : 'rgba(150,180,230,0.22)', transform: `scale(${p})`, boxShadow: on ? `0 0 ${10 * p}px ${C.tealSoft}` : undefined}} />
						</div>
					);
				})}
				<Fade delay={60} style={{gridColumn: '1 / span 10', textAlign: 'right'}}>
					<Small style={{fontSize: 17, marginTop: 8}}>80 of India's top 100 developers</Small>
				</Fade>
			</div>
			<div style={{position: 'absolute', left: PAD, top: 520}}>
				<Fade delay={34}>
					<div style={{fontFamily: sans, fontSize: 15, letterSpacing: 6, color: C.teal, marginBottom: 14}}>DEVELOPERS</div>
				</Fade>
				<Marquee logos={DEVS} speed={1.6} delay={34} />
				<Fade delay={44}>
					<div style={{fontFamily: sans, fontSize: 15, letterSpacing: 6, color: C.teal, margin: '30px 0 14px'}}>BANKS, LENDERS & INVESTORS</div>
				</Fade>
				<Marquee logos={BANKS} speed={-1.6} delay={44} />
			</div>
			<div style={{position: 'absolute', left: PAD, top: 905, display: 'flex', alignItems: 'baseline', gap: 22}}>
				<Counter to={81} delay={110} dur={60} size={96} color={C.teal} suffix="%" />
				<Fade delay={118}>
					<span style={{fontFamily: sans, fontSize: 32, color: C.white}}>of our clients renew, year after year.</span>
				</Fade>
			</div>
		</AbsoluteFill>
	);
};

/* 7 — Ground ----------------------------------------------------------- */
export const Ground: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<AbsoluteFill>
			<Plate src="plates/road.jpg" from={1.1} to={1.2} panX={-20} panY={-30} dim={0.15} />
			<Scrim strength={0.85} width={55} />
			<AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(4,12,32,0.7) 0%, transparent 25%)'}} />
			<Left top={260}>
				<Kicker text="On the ground" delay={4} />
				<div style={{height: 26}} />
				<div style={{display: 'flex', alignItems: 'baseline', gap: 18}}>
					<Counter to={500} delay={10} dur={60} size={96} color={C.teal} suffix="+" weight={500} />
					<Reveal lines={[['people.']]} delay={16} size={96} />
				</div>
				<div style={{display: 'flex', alignItems: 'baseline', gap: 18, marginTop: 4}}>
					<Counter to={19} delay={24} dur={50} size={96} color={C.teal} />
					<Reveal lines={[['offices.']]} delay={28} size={96} />
				</div>
				<div style={{display: 'flex', gap: 14, marginTop: 40}}>
					{['Gurugram HQ', 'Mumbai', 'Pune'].map((c, i) => (
						<Fade key={c} delay={50 + i * 6} y={14}>
							<div style={{fontFamily: sans, fontSize: 19, color: C.white, padding: '10px 22px', borderRadius: 40, border: `1px solid ${C.tealSoft}`, background: 'rgba(10,30,70,0.5)', display: 'flex', alignItems: 'center', gap: 10}}>
								<span style={{width: 8, height: 8, borderRadius: 8, background: C.teal, boxShadow: `0 0 10px ${C.teal}`}} />
								{c}
							</div>
						</Fade>
					))}
				</div>
				<Fade delay={78} y={30} style={{marginTop: 50}}>
					<Panel style={{width: 640, padding: '26px 32px'}}>
						<div style={{fontFamily: sans, fontWeight: 600, fontSize: 22, color: C.white}}>PropEdge valuations</div>
						<Small style={{marginTop: 8, lineHeight: 1.5}}>Valuing homes for 100+ banks, HFCs and NBFCs across 245+ cities and towns.</Small>
					</Panel>
				</Fade>
			</Left>
		</AbsoluteFill>
	);
};

/* 8 — Listed ----------------------------------------------------------- */
const Seal: React.FC = () => {
	const frame = useCurrentFrame();
	const p = prog(frame, 14, 50);
	const rot = frame * 0.25;
	const ring = 'NSE EMERGE · NATIONAL STOCK EXCHANGE OF INDIA · LISTED SINCE 2022 · ';
	return (
		<svg width={360} height={360} viewBox="0 0 360 360" style={{opacity: Math.min(1, p * 1.5), transform: `scale(${0.85 + 0.15 * p})`}}>
			<defs>
				<path id="ringpath" d="M180,180 m-138,0 a138,138 0 1,1 276,0 a138,138 0 1,1 -276,0" />
				<radialGradient id="sealfill">
					<stop offset="0%" stopColor="#163f86" />
					<stop offset="100%" stopColor="#0a2152" />
				</radialGradient>
			</defs>
			<circle cx={180} cy={180} r={168} fill="none" stroke={C.tealSoft} strokeWidth={1} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
			<g transform={`rotate(${rot} 180 180)`}>
				<text fontFamily={sans} fontSize={15} letterSpacing={4.2} fill={C.mute} fontWeight={500}>
					<textPath href="#ringpath">{ring}</textPath>
				</text>
			</g>
			<circle cx={180} cy={180} r={112} fill="url(#sealfill)" stroke={C.teal} strokeWidth={2} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
			<circle cx={180} cy={180} r={100} fill="none" stroke={C.tealSoft} strokeWidth={1} />
			<text x={180} y={152} textAnchor="middle" fontFamily={sans} fontSize={15} letterSpacing={4} fill={C.teal} fontWeight={600}>NSE</text>
			<text x={180} y={190} textAnchor="middle" fontFamily={sans} fontSize={26} fill={C.white} fontWeight={600} letterSpacing={1}>PROPEQUITY</text>
			<text x={180} y={220} textAnchor="middle" fontFamily={sans} fontSize={13} letterSpacing={3.5} fill={C.mute}>LISTED 2022</text>
		</svg>
	);
};

const Bar: React.FC<{label: string; to: number; max: number; delay: number}> = ({label, to, max, delay}) => {
	const frame = useCurrentFrame();
	const p = prog(frame, delay, 70);
	return (
		<div style={{display: 'flex', alignItems: 'center', gap: 20, marginTop: 18}}>
			<span style={{fontFamily: sans, fontSize: 19, color: C.white, width: 150}}>{label}</span>
			<div style={{flex: 1, height: 6, borderRadius: 6, background: 'rgba(255,255,255,0.1)'}}>
				<div style={{width: `${(to / max) * 100 * p}%`, height: 6, borderRadius: 6, background: `linear-gradient(90deg, ${C.tealSoft}, ${C.teal})`, boxShadow: `0 0 12px ${C.tealSoft}`}} />
			</div>
			<span style={{width: 100, textAlign: 'right'}}>
				<Counter to={to} delay={delay} dur={70} size={26} color={C.teal} weight={600} suffix="×+" />
			</span>
		</div>
	);
};

const Ring: React.FC<{pct: number; delay: number}> = ({pct, delay}) => {
	const frame = useCurrentFrame();
	const p = prog(frame, delay, 70);
	const r = 52;
	const c = 2 * Math.PI * r;
	return (
		<div style={{position: 'relative', width: 130, height: 130}}>
			<svg width={130} height={130} style={{transform: 'rotate(-90deg)'}}>
				<circle cx={65} cy={65} r={r} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth={8} />
				<circle cx={65} cy={65} r={r} fill="none" stroke={C.teal} strokeWidth={8} strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - (pct / 100) * p)} />
			</svg>
			<div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
				<Counter to={pct} delay={delay} dur={70} size={30} weight={600} suffix="%" />
				<div style={{fontFamily: sans, fontSize: 11, letterSpacing: 2, color: C.mute}}>PBT MARGIN</div>
			</div>
		</div>
	);
};

export const Listed: React.FC = () => {
	const frame = useCurrentFrame();
	const partners = ['University of Cambridge', 'Wharton', 'Imperial College London', 'IIM Bangalore', 'HDFC Capital'];
	return (
		<AbsoluteFill>
			<NavyField />
			<Dust count={24} />
			<Left top={150}>
				<Kicker text="Public, and accountable" delay={4} />
				<div style={{height: 26}} />
				<Reveal lines={[['Listed on the National'], ['Stock Exchange.']]} delay={10} size={76} stagger={3} />
				<Fade delay={40}>
					<Small style={{marginTop: 18, fontSize: 22}}>NSE Emerge · Since 4 April 2022</Small>
				</Fade>
			</Left>
			<div style={{position: 'absolute', right: PAD + 30, top: 90}}>
				<Seal />
			</div>
			<div style={{position: 'absolute', left: PAD, top: 560, display: 'flex', gap: 30}}>
				<Fade delay={46} y={40}>
					<Panel style={{width: 790, height: 250, padding: '30px 36px', boxSizing: 'border-box'}}>
						<div style={{fontFamily: sans, fontSize: 15, letterSpacing: 4, color: C.mute}}>IPO SUBSCRIPTION · APRIL 2022</div>
						<Bar label="HNI portion" to={130} max={140} delay={56} />
						<Bar label="Retail portion" to={60} max={140} delay={62} />
						<Small style={{fontSize: 15, marginTop: 22}}>Times oversubscribed, by investor category</Small>
					</Panel>
				</Fade>
				<Fade delay={54} y={40}>
					<Panel style={{width: 840, height: 250, padding: '30px 36px', boxSizing: 'border-box', display: 'flex', alignItems: 'center', gap: 40}}>
						<Ring pct={39} delay={64} />
						<div>
							<div style={{fontFamily: sans, fontSize: 15, letterSpacing: 4, color: C.mute, marginBottom: 10}}>FY26 PERFORMANCE</div>
							<div style={{display: 'flex', alignItems: 'baseline', gap: 12}}>
								<Counter to={53.84} decimals={2} prefix="₹" delay={64} dur={80} size={52} weight={600} suffix=" Cr" />
								<Small>revenue</Small>
							</div>
							<div style={{display: 'flex', alignItems: 'baseline', gap: 12, marginTop: 6}}>
								<Counter to={20.98} decimals={2} prefix="₹" delay={72} dur={80} size={52} color={C.teal} weight={600} suffix=" Cr" />
								<Small>profit before tax</Small>
							</div>
						</div>
					</Panel>
				</Fade>
			</div>
			<div style={{position: 'absolute', left: PAD, top: 880, display: 'flex', alignItems: 'center', gap: 34}}>
				<Fade delay={86}>
					<div style={{fontFamily: sans, fontSize: 14, letterSpacing: 5, color: C.teal}}>PARTNERS & INVESTORS</div>
				</Fade>
				{partners.map((p, i) => (
					<Fade key={p} delay={92 + i * 5} y={10}>
						<span style={{fontFamily: sans, fontSize: 21, color: C.white, fontWeight: 500, opacity: 0.85}}>{p}</span>
					</Fade>
				))}
			</div>
			<div style={{position: 'absolute', left: PAD, right: PAD, top: 860, height: 1, background: C.line, transform: `scaleX(${prog(frame, 80, 40)})`, transformOrigin: 'left'}} />
		</AbsoluteFill>
	);
};

/* 9 — Endcard ---------------------------------------------------------- */
export const Endcard: React.FC = () => {
	const frame = useCurrentFrame();
	const mark = prog(frame, 10, 50);
	const tag = prog(frame, 34, 40);
	const shimmer = interpolate(frame, [50, 110], [-30, 130], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const out = interpolate(frame, [118, 135], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	return (
		<AbsoluteFill>
			<Plate src="plates/tower.jpg" from={1.16} to={1.04} panY={30} dim={0.45} tint="radial-gradient(ellipse at center, rgba(4,12,32,0.35) 0%, rgba(4,12,32,0.8) 75%)" />
			<AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', flexDirection: 'column', opacity: out}}>
				<div style={{fontFamily: serif, fontSize: 120, color: C.white, letterSpacing: interpolate(mark, [0, 1], [60, 4]), opacity: mark, filter: `blur(${(1 - mark) * 10}px)`, textShadow: '0 10px 60px rgba(0,0,0,0.5)'}}>
					PropEquity
				</div>
				<div style={{width: 520 * prog(frame, 26, 40), height: 1, background: `linear-gradient(90deg, transparent, ${C.teal}, transparent)`, margin: '22px 0 30px'}} />
				<div
					style={{
						fontFamily: sans,
						fontWeight: 500,
						fontSize: 76,
						letterSpacing: -1.5,
						opacity: tag,
						transform: `translateY(${(1 - tag) * 24}px)`,
						backgroundImage: `linear-gradient(100deg, ${C.teal} ${shimmer - 20}%, #d8fffa ${shimmer}%, ${C.teal} ${shimmer + 20}%)`,
						WebkitBackgroundClip: 'text',
						backgroundClip: 'text',
						color: 'transparent',
					}}
				>
					The Source of Truth.
				</div>
				<Fade delay={60}>
					<div style={{fontFamily: sans, fontSize: 18, letterSpacing: 5, color: C.mute, marginTop: 34}}>REAL ESTATE DATA & ANALYTICS · NSE: PROPEQUITY</div>
				</Fade>
			</AbsoluteFill>
			<AbsoluteFill style={{background: C.navy, opacity: 1 - out}} />
		</AbsoluteFill>
	);
};

export {Wordmark};
