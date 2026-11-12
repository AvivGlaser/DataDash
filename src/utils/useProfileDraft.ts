import { useState } from 'react';
import type { BusinessCategoryId, BusinessProfile, ProfileDraftState } from '../types';
import { cleanBusinessName, EMPTY_PROFILE, getProfileErrors } from './businessProfile';

/**
 * Holds the typed business name and chosen category.
 * `onUsableChange` runs whenever there is a name, so the header can show it before a category is picked.
 */
export function useProfileDraft(initialProfile: BusinessProfile | null, onUsableChange?: (profile: BusinessProfile) => void): ProfileDraftState {
  const [draft, setDraft] = useState<BusinessProfile>(initialProfile ?? EMPTY_PROFILE);

  const update = (nextDraft: BusinessProfile) => {
    setDraft(nextDraft);
    const businessName = cleanBusinessName(nextDraft.businessName);
    if (businessName) onUsableChange?.({ businessName, category: nextDraft.category });
  };

  return {
    businessName: draft.businessName,
    category: draft.category,
    errors: getProfileErrors(draft),
    updateBusinessName: (text: string) => update({ ...draft, businessName: text }),
    updateCategory: (category: BusinessCategoryId) => update({ ...draft, category }),
  };
}
