import type { AnimatedNumberProps } from '../../types';
import { useAnimatedNumber } from '../../utils/useAnimatedNumber';

export function AnimatedNumber({ value, format }: AnimatedNumberProps) {
  return <>{format(useAnimatedNumber(value))}</>;
}
