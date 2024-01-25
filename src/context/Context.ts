import { createContext } from 'react';

type ContextProps = {
  recipes:any;
  setRecipes:any;
};

const Context = createContext({} as ContextProps);

export default Context;
