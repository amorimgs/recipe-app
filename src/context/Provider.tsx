import React from 'react';
import Context from './Context';

type ProviderProps = {
  children: React.ReactNode;
};

function Provider({ children }: ProviderProps) {
  const [recipes, setRecipes] = React.useState([]);

  const dados = {
    recipes,
    setRecipes,
  };

  return (
    <Context.Provider value={ dados }>
      <div>
        { children }
      </div>
    </Context.Provider>
  );
}

export default Provider;
