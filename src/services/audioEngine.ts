/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AudioPlayer, audioPlayer, EqualizerPreset, PlaybackStatus, ProgressState } from './audioPlayer';

export type { EqualizerPreset, PlaybackStatus, ProgressState };
export { AudioPlayer };

// Re-export audioPlayer singleton as audioEngine for backwards-compatibility
export const audioEngine = audioPlayer;
