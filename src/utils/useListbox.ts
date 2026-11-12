import { useCallback, useEffect, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { useDismissOnOutsidePress } from './useDismissOnOutsidePress';

interface ListboxOption {
  id: string;
  name: string;
}

/**
 * Keyboard and pointer behavior for a select-only combobox (WAI-ARIA pattern):
 * arrows, Home and End move, Enter or Space picks, Escape closes, typing a letter jumps to it.
 */
export function useListbox<Option extends ListboxOption>(options: Option[], selectedId: string | null, onSelect: (option: Option) => void) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const selectedIndex = Math.max(0, options.findIndex((option) => option.id === selectedId));

  const close = useCallback(() => setIsOpen(false), []);
  useDismissOnOutsidePress(isOpen, rootRef, close);

  useEffect(() => {
    if (isOpen) listRef.current?.children[activeIndex]?.scrollIntoView({ block: 'nearest' });
  }, [isOpen, activeIndex]);

  const open = (index = selectedIndex) => {
    setActiveIndex(index);
    setIsOpen(true);
  };

  const choose = (index: number) => {
    onSelect(options[index]);
    setIsOpen(false);
  };

  const findByLetter = (letter: string) => {
    const lower = letter.toLowerCase();
    for (let step = 1; step <= options.length; step++) {
      const index = (activeIndex + step) % options.length;
      if (options[index].name.toLowerCase().startsWith(lower)) return index;
    }
    return -1;
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    const lastIndex = options.length - 1;
    const keyActions: Record<string, () => void> = isOpen
      ? {
          ArrowDown: () => setActiveIndex(Math.min(activeIndex + 1, lastIndex)),
          ArrowUp: () => setActiveIndex(Math.max(activeIndex - 1, 0)),
          Home: () => setActiveIndex(0),
          End: () => setActiveIndex(lastIndex),
          Enter: () => choose(activeIndex),
          ' ': () => choose(activeIndex),
          Escape: close,
        }
      : {
          ArrowDown: () => open(),
          ArrowUp: () => open(),
          Enter: () => open(),
          ' ': () => open(),
          Home: () => open(0),
          End: () => open(lastIndex),
        };

    if (event.key === 'Tab') return close();
    const action = keyActions[event.key];
    if (action) {
      event.preventDefault();
      return action();
    }
    if (event.key.length === 1 && /\S/.test(event.key)) {
      const index = findByLetter(event.key);
      if (index >= 0) isOpen ? setActiveIndex(index) : open(index);
    }
  };

  return {
    isOpen, activeIndex, rootRef, listRef, handleKeyDown, choose,
    toggle: () => (isOpen ? close() : open()),
    setActiveIndex,
  };
}
