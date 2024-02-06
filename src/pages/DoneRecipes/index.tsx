import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/Header';
import { RecipeDetailsType } from '../FavoriteRecipes';
import Share from '../../components/Share';
import styles from './doneRecipes.module.css';

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
      <div className={ styles.filtersBtn }>
        <button
          className={ styles.filterBtn }
          onClick={ () => {
            setFilter('all');
            setRecipeFilter('all');
          } }
          data-testid="filter-by-all-btn"
        >
          All
        </button>
        <button
          className={ styles.filterBtn }
          onClick={ () => {
            setFilter('meal');
            setRecipeFilter('meals');
          } }
          data-testid="filter-by-meal-btn"
        >
          Meals
        </button>
        <button
          className={ styles.filterBtn }
          onClick={ () => {
            setFilter('drink');
            setRecipeFilter('drinks');
          } }
          data-testid="filter-by-drink-btn"
        >
          Drinks
        </button>
      </div>
      <div className={ styles.cards }>
        {filteredRecipesByType.map((recipe, index) => (
          <div key={ index } className={ styles.card }>
            <div>
              <Link to={ `/${recipe.type}s/${recipe.id}` }>
                <img
                  width="200px"
                  src={ recipe.image }
                  alt={ recipe.name }
                  data-testid={ `${index}-horizontal-image` }
                />
              </Link>
            </div>
            <div className={ styles.info }>
              <Link to={ `/${recipe.type}s/${recipe.id}` }>
                <p
                  className={ styles.title }
                  data-testid={ `${index}-horizontal-name` }
                >
                  {recipe.name}
                </p>
              </Link>
              <div>
                {recipe.tags
                    && recipe.tags.slice(0, 2).map((tag, tagIndex) => (
                      <span
                        key={ tagIndex }
                        data-testid={ `${index}-${tag}-horizontal-tag` }
                      >
                        {tag}
                      </span>
                    ))}
              </div>
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
              <p
                className={ styles.data }
                data-testid={ `${index}-horizontal-done-date` }
              >
                {recipe.doneDate}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DoneRecipes;
