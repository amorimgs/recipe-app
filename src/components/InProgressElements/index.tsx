import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MealType, DrinkType } from '../../Types/Types';

function InProgressElements({ recipe }: any) {
  const { pathname } = window.location;
  const mealOrDrink: string = pathname.split('/')[1];
  const idRecipe: string = pathname.split('/')[2];
  const [ingredientStep, setingredientStep] = React.useState<string[]>([]);
  const [ingredientsAndMeansures, setIngredientesAndMeansures] = React.useState<any>({
    ingredientes: [],
    meansure: [],
  });
  const navigate = useNavigate();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { target } = e;
    if (target.checked) {
      setingredientStep([...ingredientStep, target.value]);
    } else {
      setingredientStep(ingredientStep.filter((el) => el !== target.value));
    }
  };

  useEffect(() => {
    const saveLocalStorage = () => {
      const inProgressLocalStorage = window.localStorage.getItem('inProgressRecipes');
      if (inProgressLocalStorage !== null
        && JSON.parse(inProgressLocalStorage)[mealOrDrink]) {
        const parseJson = JSON.parse(inProgressLocalStorage);
        if (parseJson[mealOrDrink][idRecipe]) {
          setingredientStep(parseJson[mealOrDrink][idRecipe]);
        }
      } else {
        const item = {
          drinks: {},
          meals: {},
        };
        window.localStorage.setItem('inProgressRecipes', JSON.stringify(item));
      }
    };
    saveLocalStorage();
  }, [idRecipe, mealOrDrink]);

  useEffect(() => {
    const setInProgressLocalStorage = () => {
      const inProgressLocalStorage = window.localStorage.getItem('inProgressRecipes');
      if (inProgressLocalStorage !== null) {
        const parseJson = JSON.parse(inProgressLocalStorage);
        parseJson[mealOrDrink][idRecipe] = ingredientStep;
        window.localStorage.setItem('inProgressRecipes', JSON.stringify(parseJson));
      }
    };
    setInProgressLocalStorage();
  }, [idRecipe, ingredientStep, mealOrDrink]);

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

  const DoneRecipe = () => {
    const data = {
      id: idRecipe,
      type: mealOrDrink.replace('s', ''),
      nationality: recipe.strArea || '',
      category: recipe.strCategory,
      alcoholicOrNot: recipe.strAlcoholic || '',
      name: recipe.strMeal || recipe.strDrink,
      image: recipe.strDrinkThumb || recipe.strMealThumb,
      doneDate: new Date(),
      tags: (recipe.strTags && recipe.strTags.split(',')) || [],
    };
    const localStorage = window.localStorage.getItem('doneRecipes');
    if (localStorage && JSON.parse(localStorage).length > 0) {
      const receitasFeitas = JSON.parse(localStorage);
      const boolean = receitasFeitas.some((el:any) => el.id === idRecipe);
      if (!boolean) {
        receitasFeitas.push(data);
        window.localStorage.setItem('doneRecipes', JSON.stringify(receitasFeitas));
      }
    } else {
      window.localStorage.setItem('doneRecipes', JSON.stringify([data]));
    }
  };

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
            <li key={ i }>
              <label
                htmlFor={ `${i}` }
                data-testid={ `${i}-ingredient-step` }
                style={ {
                  textDecoration: `${
                    ingredientStep.find((item) => item === el)
                      ? 'line-through solid rgb(0, 0, 0)'
                      : 'none'
                  }`,
                } }
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
      <button
        type="button"
        data-testid="finish-recipe-btn"
        disabled={ ingredientStep.length !== ingredientsAndMeansures.ingredientes.length }
        onClick={ () => {
          DoneRecipe();
          navigate('/done-recipes');
        } }
      >
        Done
      </button>
    </div>
  );
}

export default InProgressElements;
