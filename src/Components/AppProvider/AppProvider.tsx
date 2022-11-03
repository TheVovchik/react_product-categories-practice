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
};

export const AppContext = React.createContext<Context>({
  users: usersFromServer,
  categories: categoriesFromServer,
  goods: productsList,
  choosenUser: 'all',
  setChoosenUser: () => {},
  choosenCategories: ['all'],
  setChoosenCategories: () => {},
});

export const AppProvider: React.FC<Props> = ({ children }) => {
  const [visibleGoods, setVisibleGoods] = useState<Good[]>(productsList);
  const [choosenUser, setChoosenUser] = useState('all');
  const [choosenCategories, setChoosenCategories] = useState<string[]>(['all']);

  const filter = () => {
    let currentGoods: Good[];

    if (choosenUser === 'all') {
      if (choosenCategories[0] === 'all') {
        currentGoods = productsList;
      } else {
        currentGoods = productsList
          .filter(good => (good.categorie?.title
          && choosenCategories.includes(good.categorie.title)));
      }

      setVisibleGoods(currentGoods);
    } else if (choosenUser !== 'all') {
      if (choosenCategories[0] === 'all') {
        currentGoods = productsList
          .filter(good => good.owner?.name === choosenUser);
      } else {
        currentGoods = productsList
          .filter(good => (good.categorie?.title
            && choosenCategories.includes(good.categorie.title)))
          .filter(good => good.owner?.name === choosenUser);
      }

      setVisibleGoods(currentGoods);
    }
  };

  useEffect(filter, [choosenUser, choosenCategories]);

  const contextValue = {
    users: usersFromServer,
    categories: categoriesFromServer,
    goods: visibleGoods,
    choosenUser,
    setChoosenUser,
    choosenCategories,
    setChoosenCategories,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};
