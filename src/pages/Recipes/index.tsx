import React from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import RecipeCard from '../../components/RecipeCard';

function Recipes() {
  const [categories, setCategories] = React.useState([]);
  const [data, setData] = React.useState([]);
  const [preventButton, setPreventButton] = React.useState<string | null>('');
  const { pathname } = window.location;

  const urlData = pathname === '/meals' ? 'https://www.themealdb.com/api/json/v1/1/search.php?s=' : 'https://www.thecocktaildb.com/api/json/v1/1/search.php?s=';

  React.useEffect(() => {
    const fetchData = async (param:string) => {
      const response = await fetch(param);
      const d = await response.json();
      const pathnameFormated = pathname.replace('/', '');
      const dataFormated = d[pathnameFormated].slice(0, 12);
      setData(dataFormated);
    };
    const fetchCategories = async (param:string) => {
      const response = await fetch(param);
      const d = await response.json();
      const pathnameFormated = pathname.replace('/', '');
      const dataFormated = d[pathnameFormated].slice(0, 5);
      setCategories(dataFormated);
    };
    if (pathname === '/meals') {
      fetchData(urlData);
      fetchCategories('https://www.themealdb.com/api/json/v1/1/list.php?c=list');
    } else if (pathname === '/drinks') {
      fetchData(urlData);
      fetchCategories('https://www.thecocktaildb.com/api/json/v1/1/list.php?c=list');
    }
  }, [pathname, urlData]);

  const handleClick = async (e:React.MouseEvent<HTMLButtonElement>) => {
    const value = e.currentTarget.textContent;
    if (value === preventButton) {
      const response = await fetch(urlData);
      const d = await response.json();
      const pathnameFormated = pathname.replace('/', '');
      const dataFormated = d[pathnameFormated].slice(0, 12);
      setData(dataFormated);
    } else {
      const urlCategory = pathname === '/meals' ? `https://www.themealdb.com/api/json/v1/1/filter.php?c=${value}` : `https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=${value}`;

      const response = await fetch(urlCategory);
      const d = await response.json();
      const pathnameFormated = pathname.replace('/', '');
      const dataFormated = d[pathnameFormated].slice(0, 12);
      setData(dataFormated);
    }
    console.log(value);
    if (value === preventButton) {
      setPreventButton(null);
    } else {
      setPreventButton(value);
    }
  };
  return (
    <div>
      <Header />
      <h1>Receitas</h1>
      <div>
        {categories.length > 0 && categories.map(({ strCategory }, index) => (
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
            const response = await fetch(urlData);
            const d = await response.json();
            const pathnameFormated = pathname.replace('/', '');
            const dataFormated = d[pathnameFormated].slice(0, 12);
            setData(dataFormated);
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
