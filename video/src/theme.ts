import {Easing, continueRender, delayRender, staticFile} from 'remotion';

// Fonts are vendored in public/fonts so renders never depend on the network.
const FACES: [string, string, string, string?][] = [
	['Poppins', 'poppins-latin-300-normal.woff2', '300'],
	['Poppins', 'poppins-latin-400-normal.woff2', '400'],
	['Poppins', 'poppins-latin-500-normal.woff2', '500'],
	['Poppins', 'poppins-latin-600-normal.woff2', '600'],
	// ₹ lives in the Devanagari subset; register per weight so it composites with the Latin faces.
	['Poppins', 'poppins-devanagari-600-normal.woff2', '400', 'U+20B9'],
	['Poppins', 'poppins-devanagari-600-normal.woff2', '500', 'U+20B9'],
	['Poppins', 'poppins-devanagari-600-normal.woff2', '600', 'U+20B9'],
	['Cinzel', 'cinzel-latin-400-normal.woff2', '400'],
];
const fontHandle = delayRender('fonts');
Promise.all(
	FACES.map(([family, file, weight, range]) => {
		const face = new FontFace(family, `url(${staticFile(`fonts/${file}`)}) format('woff2')`, {
			weight,
			...(range ? {unicodeRange: range} : {}),
		});
		document.fonts.add(face);
		return face.load();
	}),
).then(() => continueRender(fontHandle));

export const sans = 'Poppins, sans-serif';
export const serif = 'Cinzel, serif';

export const C = {
	navy: '#050f26',
	navy2: '#0a1d45',
	panel: 'rgba(14, 36, 82, 0.55)',
	line: 'rgba(120, 190, 230, 0.18)',
	teal: '#3fd0c0',
	tealSoft: 'rgba(63, 208, 192, 0.35)',
	white: '#f4f7fb',
	mute: 'rgba(214, 226, 245, 0.62)',
};

export const FPS = 30;
export const W = 1920;
export const H = 1080;
export const PAD = 120;

// Expo-out: fast start, long settle — the "expensive" motion curve.
export const ease = Easing.bezier(0.16, 1, 0.3, 1);
export const easeInOut = Easing.bezier(0.65, 0, 0.35, 1);

export const fmtIN = (n: number) => Math.round(n).toLocaleString('en-IN');
