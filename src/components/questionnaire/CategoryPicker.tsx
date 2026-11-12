import { useId } from 'react';
import type { CategoryPickerProps } from '../../types';
import { BUSINESS_CATEGORIES, findCategory } from '../../utils/businessProfile';
import { useListbox } from '../../utils/useListbox';
import { CategoryIcon } from '../common/CategoryIcon';
import { Icon } from '../common/Icon';

export function CategoryPicker({ inputId, labelId, value, hasError, onChange, onBlur }: CategoryPickerProps) {
  const listId = useId();
  const optionId = (index: number) => `${listId}-option-${index}`;
  const selected = findCategory(value);
  const listbox = useListbox(BUSINESS_CATEGORIES, value, (category) => onChange(category.id));

  return (
    <div className="category-picker" ref={listbox.rootRef}>
      <button
        type="button"
        id={inputId}
        className="category-trigger"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={listbox.isOpen}
        aria-controls={listId}
        aria-labelledby={labelId}
        aria-activedescendant={listbox.isOpen ? optionId(listbox.activeIndex) : undefined}
        aria-invalid={hasError}
        onClick={listbox.toggle}
        onKeyDown={listbox.handleKeyDown}
        onBlur={onBlur}
      >
        {selected ? (
          <>
            <CategoryIcon category={selected} />
            <span className="category-text">
              <strong>{selected.name}</strong>
              <small>{selected.examples}</small>
            </span>
          </>
        ) : (
          <span className="category-placeholder">Choose a category</span>
        )}
        <Icon name="chevronDown" />
      </button>

      {listbox.isOpen && (
        // Keeps focus on the button while an option is clicked
        <ul id={listId} role="listbox" aria-labelledby={labelId} className="category-list" ref={listbox.listRef} onMouseDown={(event) => event.preventDefault()}>
          {BUSINESS_CATEGORIES.map((category, index) => (
            <li
              key={category.id}
              id={optionId(index)}
              role="option"
              aria-selected={category.id === value}
              className={index === listbox.activeIndex ? 'active' : undefined}
              onPointerMove={() => listbox.setActiveIndex(index)}
              onClick={() => listbox.choose(index)}
            >
              <CategoryIcon category={category} />
              <span className="category-text">
                <strong>{category.name}</strong>
                <small>{category.examples}</small>
              </span>
              {category.id === value && <Icon name="check" />}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
