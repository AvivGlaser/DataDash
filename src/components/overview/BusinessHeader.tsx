import type { BusinessHeaderProps } from '../../types';
import { findCategory } from '../../utils/businessProfile';
import { Icon } from '../common/Icon';

export function BusinessHeader({ profile, isSample, onEdit }: BusinessHeaderProps) {
  const category = findCategory(profile.category);
  const isComplete = !!profile.businessName && !!category;

  return (
    <header className="business-header">
      <p className="business-eyebrow">{isSample ? 'Demo business' : 'Your business dashboard'}</p>
      <h1>{profile.businessName || 'Your business'}</h1>
      {(category || onEdit) && (
        <div className="business-meta">
          {category && (
            <span className={`category-badge cat-${category.id}`}>
              <Icon name={category.icon} size={14} />
              {category.name}
            </span>
          )}
          {onEdit && (
            <button className={`btn small ${isComplete && !isSample ? 'ghost' : 'primary'}`} onClick={onEdit}>
              <Icon name="pencil" size={14} />
              {isComplete ? 'Edit details' : 'Add your business details'}
            </button>
          )}
        </div>
      )}
    </header>
  );
}
