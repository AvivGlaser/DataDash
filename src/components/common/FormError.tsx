import type { FormErrorProps } from '../../types';
import { Icon } from './Icon';

export function FormError({ message }: FormErrorProps) {
  if (!message) return null;
  return <p className="form-error" role="alert"><Icon name="alert" size={14} /> {message}</p>;
}
