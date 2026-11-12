import { useState } from 'react';

/**
 * Errors wait until a field has been left once, so nobody is scolded while still typing.
 * `showAll` reveals every error at once, after a submit attempt or on the dashboard.
 */
export function useVisitedFields<Key extends string>(showAll: boolean) {
  const [visited, setVisited] = useState<Key[]>([]);
  return {
    isShown: (key: Key) => showAll || visited.includes(key),
    visit: (key: Key) => setVisited((current) => (current.includes(key) ? current : [...current, key])),
  };
}
