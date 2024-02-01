import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import shareIcon from '../../images/shareIcon.svg';
import blackHeartIcon from '../../images/blackHeartIcon.svg';
import Header from '../../components/Header';

type RecipeDetailsType = {
  id: string,
  type: string,
  nationality: string,
  category: string,
  alcoholicOrNot: string,
  name: string,
  image: string,
  doneDate: string,
  tags: string[]
};

function FavoriteRecipes() {
  const [recipesDone, setRecipesDone] = useState<RecipeDetailsType[]>([]);
  const [filter, setFilter] = useState('all');
  const [shareMessage, setShareMessage] = useState<boolean>(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [RecipeFilter, setRecipeFilter] = useState<string>('all');

  useEffect(() => {
    const favoriteRecipes = JSON.parse(localStorage.getItem('favoriteRecipes') ?? '[]');
    setRecipesDone(favoriteRecipes);
    const favoritesArray = favoriteRecipes.map((recipe: RecipeDetailsType) => recipe.id);
    setFavorites(favoritesArray);
  }, []);

  const filteredRecipes = filter === 'all'
    ? recipesDone
    : recipesDone.filter((recipe) => recipe.type === filter);

  const filteredRecipesByType = RecipeFilter === 'all'
    ? filteredRecipes
    : filteredRecipes.filter((recipe) => (
      (RecipeFilter === 'meals' && !recipe.alcoholicOrNot)
        || (RecipeFilter === 'drinks' && recipe.alcoholicOrNot)
    ));

  const copyText = async (recipe: RecipeDetailsType) => {
    const recipeUrl = `${window.location.origin}/${recipe.type}s/${recipe.id}`;

    await navigator.clipboard.writeText(recipeUrl);
    setShareMessage(true);
  };

  const toggleFavorite = (recipe: RecipeDetailsType) => {
    const recipeId = recipe.id;
    const isFavorite = favorites.includes(recipeId);

    if (isFavorite) {
      const updatedFavorites = favorites.filter((fav) => fav !== recipeId);
      setFavorites(updatedFavorites);

      const updatedRecipes = recipesDone.filter((recipes) => recipes.id !== recipeId);
      localStorage.setItem('favoriteRecipes', JSON.stringify(updatedRecipes));
      setRecipesDone(updatedRecipes);
    }
  };

  return (
    <div>
      <Header />
      <button
        onClick={ () => {
          setFilter('all');
          setRecipeFilter('all');
        } }
        data-testid="filter-by-all-btn"
      >
        All
      </button>
      <button
        onClick={ () => {
          setFilter('meal');
          setRecipeFilter('meals');
        } }
        data-testid="filter-by-meal-btn"
      >
        Meals
      </button>
      <button
        onClick={ () => {
          setFilter('drink');
          setRecipeFilter('drinks');
        } }
        data-testid="filter-by-drink-btn"
      >
        Drinks
      </button>
      <div className="recipe-cards">
        {filteredRecipesByType.map((recipe, index) => (
          <div key={ index } className="recipe-card">
            <Link to={ `/${recipe.type}s/${recipe.id}` }>
              <img
                width="200px"
                src={ recipe.image }
                alt={ recipe.name }
                data-testid={ `${index}-horizontal-image` }
              />
              <p data-testid={ `${index}-horizontal-name` }>{recipe.name}</p>
            </Link>
            {recipe.type === 'meal' && (
              <>
                <p data-testid={ `${index}-horizontal-top-text` }>
                  {`${recipe.nationality} - ${recipe.category}`}
                </p>
                <button
                  onClick={ () => copyText(recipe) }
                >
                  <img
                    data-testid={ `${index}-horizontal-share-btn` }
                    src={ shareIcon }
                    alt="ícone do botão compartilhar"
                  />
                </button>
                <button
                  onClick={ () => toggleFavorite(recipe) }
                >
                  <img
                    data-testid={ `${index}-horizontal-favorite-btn` }
                    src={ blackHeartIcon }
                    alt="ícone do botão favoritar"
                  />
                </button>
              </>
            )}
            {recipe.type === 'drink' && (
              <>
                <p data-testid={ `${index}-horizontal-top-text` }>
                  {recipe.alcoholicOrNot ? 'Alcoholic' : 'Non-Alcoholic'}
                </p>
                <button
                  onClick={ () => copyText(recipe) }
                >
                  <img
                    data-testid={ `${index}-horizontal-share-btn` }
                    src={ shareIcon }
                    alt="ícone do botão compartilhar"
                  />
                </button>
                <button
                  onClick={ () => toggleFavorite(recipe) }
                >
                  <img
                    data-testid={ `${index}-horizontal-favorite-btn` }
                    src={ blackHeartIcon }
                    alt="ícone do botão favoritar"
                  />
                </button>
                {shareMessage && <h2>Link copied!</h2>}
              </>
            )}
            <p data-testid={ `${index}-horizontal-done-date` }>{recipe.doneDate}</p>
            <div>
              {recipe.tags
                && recipe.tags.slice(0, 2).map((tag, tagIndex) => (
                  <span key={ tagIndex } data-testid={ `${index}-${tag}-horizontal-tag` }>
                    {tag}
                  </span>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FavoriteRecipes;
