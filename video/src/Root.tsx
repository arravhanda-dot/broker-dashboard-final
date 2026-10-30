import React from 'react';
import {Composition} from 'remotion';
import {FPS, H, W} from './theme';
import {PromoVideo, TOTAL} from './Video';

export const Root: React.FC = () => (
	<Composition id="PropEquityPromo" component={PromoVideo} durationInFrames={TOTAL} fps={FPS} width={W} height={H} />
);
