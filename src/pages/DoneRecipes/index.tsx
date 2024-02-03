import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import shareIcon from '../../images/shareIcon.svg';
import Header from '../../components/Header';
import { RecipeDetailsType } from '../FavoriteRecipes';

function DoneRecipes() {
  const [recipesDone, setRecipesDone] = useState<RecipeDetailsType[]>([]);
  const [filter, setFilter] = useState('all');
  const [RecipeFilter, setRecipeFilter] = useState<string>('all');
  const [shareMessage, setShareMessage] = useState<boolean>(false);

  useEffect(() => {
    const DoneRecipess = JSON.parse(localStorage.getItem('doneRecipes') ?? '[]');
    setRecipesDone(DoneRecipess);
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

  const copyText = (recipe: RecipeDetailsType) => {
    const recipeUrl = `${window.location.origin}/${recipe.type}s/${recipe.id}`;

    navigator.clipboard.writeText(recipeUrl);
    setShareMessage(true);
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
                {shareMessage && <h2>Link copied!</h2>}
              </>
            )}
            <div>
              {recipe.tags
                && recipe.tags.slice(0, 2).map((tag, tagIndex) => (
                  <span key={ tagIndex } data-testid={ `${index}-${tag}-horizontal-tag` }>
                    {tag}
                  </span>
                ))}
            </div>
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
                {shareMessage && <h2>Link copied!</h2>}
              </>
            )}
            <p data-testid={ `${index}-horizontal-done-date` }>{recipe.doneDate}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DoneRecipes;
