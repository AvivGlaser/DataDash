import type { BusinessProfile, ProfileFieldsProps } from '../../types';
import { MAX_BUSINESS_NAME_LENGTH } from '../../utils/businessProfile';
import { useVisitedFields } from '../../utils/useVisitedFields';
import { FormError } from '../common/FormError';
import { CategoryPicker } from './CategoryPicker';

export function ProfileFields({ profileState, showAllErrors }: ProfileFieldsProps) {
  const { businessName, category, errors, updateBusinessName, updateCategory } = profileState;
  const { isShown, visit } = useVisitedFields<keyof BusinessProfile>(showAllErrors);
  const errorFor = (key: keyof BusinessProfile) => (isShown(key) ? errors[key] : undefined);
  const nameError = errorFor('businessName');
  const categoryError = errorFor('category');

  return (
    <div className="answer-fields">
      <div className="answer-field">
        <label htmlFor="profile-businessName">1. What is your business name?</label>
        <div className="answer-input">
          <input
            id="profile-businessName"
            type="text"
            autoComplete="organization"
            placeholder="For example, Sunrise Bakery"
            maxLength={MAX_BUSINESS_NAME_LENGTH}
            aria-invalid={!!nameError}
            value={businessName}
            onChange={(event) => updateBusinessName(event.target.value)}
            onBlur={() => visit('businessName')}
          />
        </div>
        <small>Shown as the title of your dashboard.</small>
        <FormError message={nameError} />
      </div>

      <div className="answer-field">
        <label id="profile-category-label" htmlFor="profile-category">2. What best describes your business?</label>
        <CategoryPicker
          inputId="profile-category"
          labelId="profile-category-label"
          value={category}
          hasError={!!categoryError}
          onChange={updateCategory}
          onBlur={() => visit('category')}
        />
        <small>Pick the closest fit. You can change it later.</small>
        <FormError message={categoryError} />
      </div>
    </div>
  );
}
