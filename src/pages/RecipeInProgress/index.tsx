import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import InProgressElements from '../../components/InProgressElements';
import { fetchData } from '../../FuctionHelpes/FetchFunction';
import Share from '../../components/Share';
import FavoriteBtn from '../../components/FavoriteBtn';

function Recipes() {
  const location = useLocation();
  const [recipes, setRecipes] = useState<any>(null);
  const { pathname } = window.location;
  const mealOrDrink = pathname.split('/')[1];
  const idRecipe = pathname.split('/')[2];

  useEffect(() => {
    const recipeInProgress = async () => {
      const urlFetchRecipe = mealOrDrink === 'meals'
        ? `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${idRecipe}`
        : `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${idRecipe}`;
      const recipeProgress = await fetchData(urlFetchRecipe);
      if (recipeProgress[mealOrDrink] && recipeProgress[mealOrDrink].length > 0) {
        setRecipes(recipeProgress[mealOrDrink][0]);
      }
    };
    recipeInProgress();
  }, [setRecipes, location.pathname, mealOrDrink, idRecipe]);

  if (recipes) {
    return (
      <main>
        <div>
          <InProgressElements recipe={ recipes } />
        </div>
        <FavoriteBtn
          obj={ {
            id: idRecipe,
            type: mealOrDrink.replace('s', ''),
            nationality: recipes.strArea || '',
            category: recipes.strCategory,
            alcoholicOrNot: recipes.strAlcoholic || '',
            name: recipes.strMeal || recipes.strDrink,
            image: recipes.strDrinkThumb || recipes.strMealThumb } }
        />
        <Share idRecipe={ idRecipe } path={ mealOrDrink.replace('s', '') } />
      </main>
    );
  }
}

export default Recipes;
