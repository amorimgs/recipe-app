import React from 'react';
import { MealType, DrinkType } from '../Types/Types';

function InProgressElements({ recipe }: any) {
  console.log(recipe.recipe);
  const [ingredientsAndMeansures, setIngredientesAndMeansures] = React.useState<any>({
    ingredientes: [],
    meansure: [],
  });
  const [ingredientStep, setingredientStep] = React.useState<string[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { target } = e;
    if (target.checked) {
      setingredientStep([...ingredientStep, target.value]);
    } else {
      setingredientStep(ingredientStep.filter((el) => el !== target.value));
    }
  };

  const setIngredientesAndMeansure = (dados: any) => {
    if (dados) {
      const arr = Object.keys(dados);
      const ingredientesValues = arr
        .filter((item) => {
          return item.includes('strIngredient') && dados[item] !== '';
        })
        .map((el) => dados[el])
        .filter((el) => el !== null);
      const meansureValues = arr
        .filter((item) => {
          return item.includes('strMeasure') && dados[item] !== '';
        })
        .map((el) => dados[el]);
      setIngredientesAndMeansures({
        ingredientes: ingredientesValues,
        meansure: meansureValues,
      });
    }
  };
  React.useEffect(() => {
    setIngredientesAndMeansure(recipe);
  }, [recipe]);
  return (
    <div>
      <h2 data-testid="recipe-title">
        {(recipe as MealType).strMeal || (recipe as DrinkType).strDrink}
      </h2>

      <h3>Categoria:</h3>
      <p data-testid="recipe-category">
        {(recipe as MealType).strCategory || (recipe as DrinkType).strCategory}
      </p>

      <img
        src={
          (recipe as MealType).strMealThumb
          || (recipe as DrinkType).strDrinkThumb
        }
        alt={ (recipe as MealType).strMeal || (recipe as DrinkType).strDrink }
        data-testid="recipe-photo"
      />
      <ul>
        {ingredientsAndMeansures.ingredientes.map((el: string, i: number) => {
          return (
            <li
              key={ i }
            >
              <label
                htmlFor={ `${i}` }
                data-testid={ `${i}-ingredient-step` }
                style={ { textDecoration: `${(ingredientStep
                  .find((item) => item === el))
                  ? 'line-through solid rgb(0, 0, 0)' : 'none'}` } }
              >
                <input
                  type="checkbox"
                  name={ `${i}` }
                  id={ `${i}` }
                  value={ el }
                  checked={ ingredientStep.includes(el) }
                  onChange={ handleChange }
                />
                {el}
                {' '}
                {ingredientsAndMeansures.meansure[i]}
              </label>
            </li>
          );
        })}
      </ul>
      <p data-testid="instructions">
        {(recipe as MealType).strInstructions
          || (recipe as DrinkType).strInstructions}
      </p>

      <a
        href={ (recipe as MealType).strYoutube || (recipe as DrinkType).strVideo }
      >
        Assita ao vídeo
      </a>
    </div>
  );
}

export default InProgressElements;
