import React from 'react';
import { Link } from 'react-router-dom';

// interface Recipe {
//   idMeal?: string;
//   idDrink?: string;
//   strMealThumb?: string;
//   strDrinkThumb?: string;
//   strMeal?: string;
//   strDrink?: string;
// }

function RecipeCard({ data }: { data: any }) {
  const [recipes, setRecipes] = React.useState<any>([]);
  const { pathname } = window.location;
  React.useEffect(() => {
    setRecipes(data);
  }, [data, pathname]);
  const keyId = pathname === '/meals' ? 'idMeal' : 'idDrink';
  return (
    <div>
      <div>
        {recipes.map((recipe:any, index:number) => (
          <Link
            to={ `${pathname}/${recipe[keyId]}` }
            key={ index }
            data-testid={ `${index}-recipe-card` }
          >
            <img
              style={ { width: '100px' } }
              src={ recipe.strMealThumb || recipe.strDrinkThumb }
              alt="Recipe"
              data-testid={ `${index}-card-img` }
            />

            <p
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
