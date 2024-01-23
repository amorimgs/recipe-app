import { useState, useEffect } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import RecipeCard from '../RecipeCard';

function Recipes() {
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const isMealPage = window.location.pathname === '/meals';
    const endpoint = isMealPage
      ? 'https://www.themealdb.com/api/json/v1/1/list.php?c=list'
      : 'https://www.thecocktaildb.com/api/json/v1/1/list.php?c=list';

    fetch(endpoint)
      .then((response) => response.json())
      .then((data) => {
        const categoryType = isMealPage ? 'meals' : 'drinks';
        const fetchedCategories = data[categoryType] || [];
        setCategories(
          fetchedCategories
            .slice(0, 5).map((category: { strCategory: any }) => category.strCategory),
        );
      })
      .catch((error) => {
        console.error('Erro ao buscar categorias:', error);
      });
  }, []);
  return (
    <div>
      <Header />
      <h1>Receitas</h1>
      <div>
        {categories.map((category, index) => (
          <button
            key={ index }
            data-testid={ `${category}-category-filter` }
            onClick={ () => console.log(`Categoria selecionada: ${category}`) }
          >
            {category}
          </button>
        ))}
      </div>
      <RecipeCard />
      <Footer />
    </div>
  );
}

export default Recipes;
