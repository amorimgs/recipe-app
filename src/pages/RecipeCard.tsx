import { useState, useEffect } from 'react';

interface Recipe {
  idMeal?: string;
  idDrink?: string;
  strMealThumb?: string;
  strDrinkThumb?: string;
  strMeal?: string;
  strDrink?: string;
}

function RecipeCard() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    const isMealPage = window.location.pathname === '/meals';
    const endpoint = isMealPage
      ? 'https://www.themealdb.com/api/json/v1/1/search.php?s='
      : 'https://www.thecocktaildb.com/api/json/v1/1/search.php?s=';

    fetch(endpoint)
      .then((response) => response.json())
      .then((data) => {
        const recipeType = isMealPage ? 'meals' : 'drinks';
        const fetchedRecipes = data[recipeType] || [];
        setRecipes(fetchedRecipes.slice(0, 12));
      })
      .catch((error) => {
        console.error('Erro ao buscar receitas:', error);
      });
  }, []);

  return (
    <div>
      {recipes.map((recipe, index) => (
        <div key={ index } data-testid={ `${index}-recipe-card` }>
          {recipe && (
            <>
              <img
                src={ recipe.strMealThumb || recipe.strDrinkThumb }
                alt="Recipe"
                data-testid={ `${index}-card-img` }
              />
              <p
                data-testid={ `${index}-card-name` }
              >
                {recipe.strMeal || recipe.strDrink}
              </p>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default RecipeCard;
