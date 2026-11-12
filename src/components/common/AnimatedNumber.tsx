import type { AnimatedNumberProps } from '../../types';
import { useAnimatedNumber } from '../../utils/useAnimatedNumber';

export function AnimatedNumber({ value, format, replayKey }: AnimatedNumberProps) {
  return <>{format(useAnimatedNumber(value, replayKey))}</>;
}
