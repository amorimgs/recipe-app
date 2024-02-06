import React from 'react';
import { Link } from 'react-router-dom';
import styles from './recipeCard.module.css';

function RecipeCard({ data }: { data: any }) {
  const [recipes, setRecipes] = React.useState<any>([]);
  const { pathname } = window.location;
  React.useEffect(() => {
    setRecipes(data);
  }, [data, pathname]);
  const keyId = pathname === '/meals' ? 'idMeal' : 'idDrink';
  return (
    <div>
      <div className={ styles.container }>
        {recipes && recipes.length > 0 && recipes.map((recipe:any, index:number) => (
          <Link
            className={ styles.card }
            to={ `${pathname}/${recipe[keyId]}` }
            key={ index }
            data-testid={ `${index}-recipe-card` }
          >
            <img
              className={ styles.image }
              style={ { width: '100px' } }
              src={ recipe.strMealThumb || recipe.strDrinkThumb }
              alt="Recipe"
              data-testid={ `${index}-card-img` }
            />

            <p
              className={ styles.name }
              data-testid={ `${index}-card-name` }
            >
              {recipe.strMeal || recipe.strDrink}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default RecipeCard;
