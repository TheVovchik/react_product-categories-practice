import { FC } from 'react';
import { CategorySerch } from '../CategorySearch';
import { UserFilters } from '../UserFilters';

export const Navigation: FC = () => {
  return (
    <nav className="panel">
      <p className="panel-heading">Filters</p>

      <UserFilters />

      {/* #region search bar */}
      <div className="panel-block">
        <p className="control has-icons-left has-icons-right">
          <input
            data-cy="SearchField"
            type="text"
            className="input"
            placeholder="Search"
            // value="qwe"
          />

          <span className="icon is-left">
            <i className="fas fa-search" aria-hidden="true" />
          </span>

          <span className="icon is-right">
            {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
            <button
              data-cy="ClearButton"
              type="button"
              className="delete"
            />
          </span>
        </p>
      </div>

      <CategorySerch />

      <div className="panel-block">
        <a
          data-cy="ResetAllButton"
          href="#/"
          className="button is-link is-outlined is-fullwidth"

        >
          Reset all filters
        </a>
      </div>
    </nav>
  );
};
