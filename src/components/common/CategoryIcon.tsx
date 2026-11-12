import type { CategoryIconProps } from '../../types';
import { Icon } from './Icon';

export function CategoryIcon({ category, size = 18 }: CategoryIconProps) {
  return (
    <span className={`category-icon cat-${category.id}`}>
      <Icon name={category.icon} size={size} />
    </span>
  );
}
