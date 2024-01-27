export const fetchData = async (url:string) => {
  const response = await fetch(url);
  const rJson = await response.json();
  return rJson;
};

// Função específica para buscar receitas
export const fetchRecipes = async (pathname:string, urlData:string) => {
  const response = await fetchData(urlData);
  const pathnameFormatted = pathname.replace('/', '');
  if (response && response[pathnameFormatted]) {
    return response[pathnameFormatted].slice(0, 12);
  }
};

// Função específica para buscar categorias
export const fetchCategories = async (pathname:string, urlCategories:string) => {
  const response = await fetchData(urlCategories);
  const pathnameFormatted = pathname.replace('/', '');
  if (response && response[pathnameFormatted]) {
    return response[pathnameFormatted].slice(0, 5);
  }
};

// Função espeficica para o search
export const searchRecipes = async (
  searchType: string,
  location: any,
  searchInput: string,
) => {
  let endpoint = '';

  switch (searchType) {
    case 'Ingredient':
      endpoint = `https://www.${
        location.pathname === '/meals' ? 'themealdb' : 'thecocktaildb'
      }.com/api/json/v1/1/filter.php?i=${searchInput}`;
      break;
    case 'Name':
      endpoint = `https://www.${
        location.pathname === '/meals' ? 'themealdb' : 'thecocktaildb'
      }.com/api/json/v1/1/search.php?s=${searchInput}`;
      break;
    case 'First letter':
      if (searchInput.length === 1) {
        endpoint = `https://www.${
          location.pathname === '/meals' ? 'themealdb' : 'thecocktaildb'
        }.com/api/json/v1/1/search.php?f=${searchInput}`;
      } else {
        window.alert('Your search must have only 1 (one) character');
      }
      break;
    // no default
  }

  if (endpoint) {
    const response = await fetch(endpoint);
    const data = await response.json();
    return data;
  }
};

// Função específica para o buscar Details
export const fetchDetails = async (pathname:string, urlDetails:string) => {
  const response = await fetchData(urlDetails);
  if (response && response[pathname]) {
    return response[pathname][0];
  }
};

// Função check localStorage favorite
export const checkFavorite = (idRecipe:string) => {
  const favoriteStorage = window.localStorage
    .getItem('favoriteRecipes');
  if (favoriteStorage) {
    const favoriteRecipes = JSON.parse(favoriteStorage);
    return favoriteRecipes.some((el:any) => el.id === idRecipe);
  }
};

// Função check localStorage progress
export const checkProgress = (idRecipe:string, pathname: string) => {
  const inProgressRecipes = window.localStorage.getItem('inProgressRecipes');
  if (inProgressRecipes) {
    const storage = JSON.parse(inProgressRecipes)[pathname];
    if (storage) {
      const bolean = Object.keys(JSON.parse(inProgressRecipes)[pathname])
        .some((el) => el === idRecipe);
      return bolean;
    }
  }
  return false;
};

// Função check localStorage done
export const doneProgress = (idRecipe:string) => {
  const favoriteStorage = window.localStorage
    .getItem('doneRecipes');
  if (favoriteStorage) {
    const favoriteRecipes = JSON.parse(favoriteStorage);
    return favoriteRecipes.some((el:any) => el.id === idRecipe);
  }
  return false;
};
