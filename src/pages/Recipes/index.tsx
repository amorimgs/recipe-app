import React from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import RecipeCard from '../../components/RecipeCard';
import { fetchCategories, fetchRecipes } from '../../FuctionHelpes/FetchFunction';

function Recipes() {
  const [categories, setCategories] = React.useState([]);
  const [data, setData] = React.useState([]);
  const [preventButton, setPreventButton] = React.useState<string | null>('');
  const { pathname } = window.location;

  const urlData = pathname === '/meals' ? 'https://www.themealdb.com/api/json/v1/1/search.php?s=' : 'https://www.thecocktaildb.com/api/json/v1/1/search.php?s=';

  React.useEffect(() => {
    const fetchDataAndCategories = async () => {
      setData(await fetchRecipes(pathname, urlData));
      const urlCategory = pathname === '/meals' ? 'https://www.themealdb.com/api/json/v1/1/list.php?c=list' : 'https://www.thecocktaildb.com/api/json/v1/1/list.php?c=list';
      setCategories(await fetchCategories(pathname, urlCategory));
    };
    fetchDataAndCategories();
  }, [pathname, urlData]);

  const handleClick = async (e:React.MouseEvent<HTMLButtonElement>) => {
    const value = e.currentTarget.textContent;
    if (value === preventButton) {
      setData(await fetchRecipes(pathname, urlData));
      setPreventButton(null);
    } else {
      const urlCategory = pathname === '/meals' ? `https://www.themealdb.com/api/json/v1/1/filter.php?c=${value}` : `https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=${value}`;

      setData(await fetchRecipes(pathname, urlCategory));
      setPreventButton(value);
    }
  };
  return (
    <div>
      <Header />
      <h1>Receitas</h1>
      <div>
        {categories && categories.map(({ strCategory }, index) => (
          <button
            key={ index }
            data-testid={ `${strCategory}-category-filter` }
            onClick={ handleClick }
          >
            {strCategory}
          </button>
        ))}
        <button
          data-testid="All-category-filter"
          onClick={ async () => {
            setPreventButton(null);
            setData(await fetchRecipes(pathname, urlData));
          } }
        >
          All
        </button>
      </div>
      <RecipeCard data={ data } />
      <Footer />
    </div>
  );
}

export default Recipes;
