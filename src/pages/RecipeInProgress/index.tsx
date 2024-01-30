import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import InProgressElements from '../../components/InProgressElements';
import { fetchData } from '../../FuctionHelpes/FetchFunction';

function Recipes() {
  const location = useLocation();
  const [recipes, setRecipes] = useState<any>(null);
  const [favorite, setFavorite] = useState(false);
  const { pathname } = window.location;
  const mealOrDrink = pathname.split('/')[1];
  const idRecipe = pathname.split('/')[2];

  useEffect(() => {
    const recipeInProgress = async () => {
      const urlFetchRecipe = mealOrDrink === 'meals'
        ? `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${idRecipe}`
        : `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${idRecipe}`;
      const recipeProgress = await fetchData(urlFetchRecipe);
      setRecipes(recipeProgress[mealOrDrink][0]);
    };
    recipeInProgress();
  }, [setRecipes, location.pathname, mealOrDrink, idRecipe]);
  if (recipes) {
    return (
      <main>
        <div>
          <InProgressElements recipe={ recipes } />
        </div>
        <button
          type="button"
          data-testid="favorite-btn"
          onClick={ () => setFavorite(!favorite) }
        >
          <img
            { ...(favorite
              ? { src: 'src/images/blackHeartIcon.svg' }
              : { src: 'src/images/whiteHeartIcon.svg' }) }
            alt="favorite icon"
          />
        </button>
        <button type="button" data-testid="share-btn">
          <img src="src/images/shareIcon.svg" alt="share icon" />
        </button>
        <button
          type="button"
          data-testid="finish-recipe-btn"
          onClick={ () => console.log('receita concluída') }
        >
          <img src="src/images/icons8-done.svg" alt="checked icon" />
        </button>
      </main>
    );
  }
}

export default Recipes;
