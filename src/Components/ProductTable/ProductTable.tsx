import { FC, useContext } from 'react';
import classNames from 'classnames';
import { AppContext } from '../AppProvider';

export const ProductTable: FC = () => {
  const { goods } = useContext(AppContext);

  return (
    <table
      data-cy="ProductTable"
      className="table is-striped is-narrow is-fullwidth"
    >
      <thead>
        <tr>
          <th>
            <span className="is-flex is-flex-wrap-nowrap">
              ID

              <a href="#/">
                <span className="icon">
                  <i data-cy="SortIcon" className="fas fa-sort" />
                </span>
              </a>
            </span>
          </th>

          <th>
            <span className="is-flex is-flex-wrap-nowrap">
              Product

              <a href="#/">
                <span className="icon">
                  <i data-cy="SortIcon" className="fas fa-sort-down" />
                </span>
              </a>
            </span>
          </th>

          <th>
            <span className="is-flex is-flex-wrap-nowrap">
              Category

              <a href="#/">
                <span className="icon">
                  <i data-cy="SortIcon" className="fas fa-sort-up" />
                </span>
              </a>
            </span>
          </th>

          <th>
            <span className="is-flex is-flex-wrap-nowrap">
              User

              <a href="#/">
                <span className="icon">
                  <i data-cy="SortIcon" className="fas fa-sort" />
                </span>
              </a>
            </span>
          </th>
        </tr>
      </thead>

      <tbody>
        {goods.map(({
          id, name, categorie, owner,
        }) => (
          <tr key={id} data-cy="Product">
            <td className="has-text-weight-bold" data-cy="ProductId">
              {id}
            </td>

            <td data-cy="ProductName">
              {name}
            </td>
            <td data-cy="ProductCategory">
              {`${categorie?.icon} - ${categorie?.title}`}
            </td>

            <td
              data-cy="ProductUser"
              className={classNames(
                {
                  'has-text-link': owner?.sex === 'm',
                  'has-text-danger': owner?.sex === 'f',
                },
              )}
            >
              {owner?.name}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
