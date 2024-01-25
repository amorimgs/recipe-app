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
