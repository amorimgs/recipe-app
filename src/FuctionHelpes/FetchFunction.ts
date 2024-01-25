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
