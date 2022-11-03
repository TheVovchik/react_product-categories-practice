import React, { useState } from 'react';
import usersFromServer from '../../api/users';
import productsFromServer from '../../api/products';
import categoriesFromServer from '../../api/categories';
import { Product } from '../../Types/Product';
import { User } from '../../Types/User';
import { Category } from '../../Types/Category';
import { Good } from '../../Types/Good';

const getCategory = (categories: Category[], categorieId: number) => {
  return categories.find(categorie => categorie.id === categorieId);
};

const getOwner = (users: User[], current: Category | undefined) => {
  return users.find(user => user.id === current?.ownerId);
};

const connectData = (products: Product[]) => {
  return products.map((product) => {
    const currentCategorie = getCategory(
      categoriesFromServer,
      product.categoryId,
    );
    const currentOwner = getOwner(
      usersFromServer,
      currentCategorie,
    );

    return {
      ...product,
      categorie: currentCategorie,
      owner: currentOwner,
    };
  });
};

const productsList = connectData(productsFromServer);

type Props = {
  children: React.ReactNode;
};

type Context = {
  users: User[],
  categories: Category[],
  goods: Good[],
  filterByUser: (user: string) => void,
  filterByCategory: (categories: string[]) => void,
  choosenUser: string,
  setChoosenUser: (user: string) => void,
  choosenCategories: string[],
  setChoosenCategories: (categories: string[]) => void,
};

export const AppContext = React.createContext<Context>({
  users: usersFromServer,
  categories: categoriesFromServer,
  goods: productsList,
  filterByUser: () => {},
  filterByCategory: () => {},
  choosenUser: 'all',
  setChoosenUser: () => {},
  choosenCategories: ['all'],
  setChoosenCategories: () => {},
});

export const AppProvider: React.FC<Props> = ({ children }) => {
  const [visibleGoods, setVisibleGoods] = useState<Good[]>(productsList);
  const [choosenUser, setChoosenUser] = useState('all');
  const [choosenCategories, setChoosenCategories] = useState<string[]>(['all']);

  const filterByUser = (user: string) => {
    let currentGoods: Good[];

    if (user === 'all') {
      if (choosenCategories[0] === 'all') {
        currentGoods = productsList;
      } else {
        currentGoods = productsList
          .filter(good => (good.categorie?.title
          && choosenCategories.includes(good.categorie.title)));
      }

      setVisibleGoods(currentGoods);
    } else if (user !== 'all') {
      if (choosenCategories[0] === 'all') {
        currentGoods = productsList.filter(good => good.owner?.name === user);
      } else {
        currentGoods = productsList
          .filter(good => (good.categorie?.title
            && choosenCategories.includes(good.categorie.title)))
          .filter(good => good.owner?.name === user);
      }

      setVisibleGoods(currentGoods);
    }
  };

  const filterByCategory = (filterState: string[]) => {
    let currentGoods: Good[];

    if (filterState[0] === 'all') {
      if (choosenUser === 'all') {
        currentGoods = productsList;
      } else {
        currentGoods = productsList
          .filter(good => good.owner?.name === choosenUser);
      }

      setVisibleGoods(currentGoods);
    } else if (filterState[0] !== 'all') {
      if (choosenUser === 'all') {
        currentGoods = productsList
          .filter(good => (good.categorie?.title
            && filterState.includes(good.categorie?.title)));
      } else {
        currentGoods = productsList
          .filter(good => good.owner?.name === choosenUser)
          .filter(good => (good.categorie?.title
            && filterState.includes(good.categorie?.title)));
      }

      setVisibleGoods(currentGoods);
    }
  };

  const contextValue = {
    users: usersFromServer,
    categories: categoriesFromServer,
    goods: visibleGoods,
    filterByUser,
    choosenUser,
    setChoosenUser,
    filterByCategory,
    choosenCategories,
    setChoosenCategories,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};
