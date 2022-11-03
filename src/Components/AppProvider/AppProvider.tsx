import React, { useState, useEffect } from 'react';
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
  choosenUser: string,
  setChoosenUser: (user: string) => void,
  choosenCategories: string[],
  setChoosenCategories: (categories: string[]) => void,
  query: string,
  setQuery: (newQuery: string) => void,
};

export const AppContext = React.createContext<Context>({
  users: usersFromServer,
  categories: categoriesFromServer,
  goods: productsList,
  choosenUser: 'all',
  setChoosenUser: () => {},
  choosenCategories: ['all'],
  setChoosenCategories: () => {},
  query: '',
  setQuery: () => {},
});

export const AppProvider: React.FC<Props> = ({ children }) => {
  const [visibleGoods, setVisibleGoods] = useState<Good[]>(productsList);
  const [choosenUser, setChoosenUser] = useState('all');
  const [choosenCategories, setChoosenCategories] = useState<string[]>(['all']);
  const [query, setQuery] = useState('');

  const filter = () => {
    let currentGoods: Good[];

    if (choosenUser === 'all') {
      if (choosenCategories[0] === 'all') {
        currentGoods = productsList;

        if (query !== '') {
          currentGoods = currentGoods
            .filter(good => (
              good.name.toLowerCase().includes(query.toLowerCase())));
        }
      } else {
        currentGoods = productsList
          .filter(good => (good.categorie?.title
          && choosenCategories.includes(good.categorie.title)));

        if (query !== '') {
          currentGoods = currentGoods
            .filter(good => (
              good.name.toLowerCase().includes(query.toLowerCase())));
        }
      }

      setVisibleGoods(currentGoods);
    } else if (choosenUser !== 'all') {
      if (choosenCategories[0] === 'all') {
        currentGoods = productsList
          .filter(good => good.owner?.name === choosenUser);

        if (query !== '') {
          currentGoods = currentGoods
            .filter(good => (
              good.name.toLowerCase().includes(query.toLowerCase())));
        }
      } else {
        currentGoods = productsList
          .filter(good => (good.categorie?.title
            && choosenCategories.includes(good.categorie.title)))
          .filter(good => good.owner?.name === choosenUser);

        if (query !== '') {
          currentGoods = currentGoods
            .filter(good => (
              good.name.toLowerCase().includes(query.toLowerCase())));
        }
      }

      setVisibleGoods(currentGoods);
    }
  };

  useEffect(filter, [choosenUser, choosenCategories, query]);

  const contextValue = {
    users: usersFromServer,
    categories: categoriesFromServer,
    goods: visibleGoods,
    choosenUser,
    setChoosenUser,
    choosenCategories,
    setChoosenCategories,
    query,
    setQuery,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};
