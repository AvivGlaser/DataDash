import type { BusinessCategory, BusinessCategoryId, BusinessProfile, ProfileErrors } from '../types';

/** Deliberately broad, so any kind of business finds a fit without picking a subcategory. */
export const BUSINESS_CATEGORIES: BusinessCategory[] = [
  {
    id: 'food', name: 'Food & Beverage', examples: 'Restaurants, cafés, catering, bakeries', icon: 'cup',
    typicalCosts: 'ingredients, staff hours and food waste', winBackIdea: 'Bring regulars back with a loyalty card or a weekly special.',
  },
  {
    id: 'retail', name: 'Retail & E-commerce', examples: 'Physical stores, online shops, clothing brands', icon: 'bag',
    typicalCosts: 'stock, shipping and returns', winBackIdea: 'Give past buyers a reason to return, such as new arrivals or a bundle offer.',
  },
  {
    id: 'services', name: 'Professional & Local Services', examples: 'Consulting, cleaning, repairs, marketing agencies', icon: 'briefcase',
    typicalCosts: 'unbilled hours, tools and subcontractors', winBackIdea: 'Check in with past clients and ask happy ones for referrals.',
  },
  {
    id: 'wellness', name: 'Health, Beauty & Wellness', examples: 'Gyms, salons, clinics, personal trainers', icon: 'heartPulse',
    typicalCosts: 'rent, staff and supplies', winBackIdea: 'Reach out to clients who have not booked lately with a return offer.',
  },
  {
    id: 'technology', name: 'Technology & Other Industries', examples: 'SaaS, education, manufacturing, construction, hospitality', icon: 'laptop',
    typicalCosts: 'software, contractors and materials', winBackIdea: 'Talk to customers who left or cut back, and ask what would have kept them.',
  },
  {
    id: 'other', name: 'Other', examples: 'Anything that does not fit above', icon: 'shapes',
    typicalCosts: 'your three biggest regular costs', winBackIdea: 'Contact your best past customers and ask what would bring them back.',
  },
];

export const MAX_BUSINESS_NAME_LENGTH = 60;

export const EMPTY_PROFILE: BusinessProfile = { businessName: '', category: null };

export const DEMO_PROFILE: BusinessProfile = { businessName: 'Sunrise Bakery', category: 'food' };

export const findCategory = (id: BusinessCategoryId | null) => BUSINESS_CATEGORIES.find((category) => category.id === id) ?? null;

/** Trims the ends and collapses repeated spaces. */
export const cleanBusinessName = (text: string) => text.trim().replace(/\s+/g, ' ');

export function getProfileErrors(profile: BusinessProfile): ProfileErrors {
  const errors: ProfileErrors = {};
  if (!cleanBusinessName(profile.businessName)) errors.businessName = 'Enter your business name.';
  if (!findCategory(profile.category)) errors.category = 'Choose the category that fits best.';
  return errors;
}

/** Returns a complete, cleaned profile, or null while anything is missing. */
export function parseProfile(profile: BusinessProfile): BusinessProfile | null {
  if (Object.keys(getProfileErrors(profile)).length) return null;
  return { businessName: cleanBusinessName(profile.businessName), category: profile.category };
}

/** Keeps whatever part of a stored profile is still usable, so older saves without one still load. */
export function readSavedProfile(candidate: unknown): BusinessProfile {
  const saved = candidate as Partial<BusinessProfile> | null;
  const businessName = typeof saved?.businessName === 'string' ? cleanBusinessName(saved.businessName).slice(0, MAX_BUSINESS_NAME_LENGTH) : '';
  return { businessName, category: findCategory(saved?.category ?? null)?.id ?? null };
}
