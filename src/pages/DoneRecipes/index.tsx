import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import shareIcon from '../../images/shareIcon.svg';
import Header from '../../components/Header';
import { RecipeDetailsType } from '../FavoriteRecipes';
import Share from '../../components/Share';

function DoneRecipes() {
  const [recipesDone, setRecipesDone] = useState<RecipeDetailsType[]>([]);
  const [filter, setFilter] = useState('all');
  const [RecipeFilter, setRecipeFilter] = useState<string>('all');

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
                <Share
                  idRecipe={ recipe.id }
                  path={ recipe.type.replace('s', '') }
                  test={ `${index}-horizontal-share-btn` }
                />
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
                <Share
                  idRecipe={ recipe.id }
                  path={ recipe.type.replace('s', '') }
                  test={ `${index}-horizontal-share-btn` }
                />

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
