import React from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchData,
  fetchDetails,
  checkProgress, doneProgress } from '../../FuctionHelpes/FetchFunction';
import Share from '../../components/Share';
import FavoriteBtn from '../../components/FavoriteBtn';

function RecipeDetails() {
  const [details, setDetails] = React.useState<any>(null);
  const [ingredientsAndMeansures, setIngredientesAndMeansures] = React.useState<any>({
    ingredientes: [],
    meansure: [],
  });
  const [recommendation, setRecommendation] = React.useState<any>(null);
  const [inProgress, setInProgress] = React.useState<boolean>(false);
  const [done, setDone] = React.useState<boolean>(false);
  const navigate = useNavigate();
  const location = window.location.pathname;
  const pathname = location.split('/')[1];
  const idRecipe = location.split('/')[2];

  const setIngredientesAndMeansure = (dados:any) => {
    if (dados) {
      const arr = Object.keys(dados);
      const ingredientesValues = arr.filter((item) => {
        return (
          item.includes('strIngredient') && dados[item] !== ''
        );
      }).map((el) => dados[el]);
      const meansureValues = arr.filter((item) => {
        return (
          item.includes('strMeasure') && dados[item] !== ''
        );
      }).map((el) => dados[el]);
      setIngredientesAndMeansures({
        ingredientes: ingredientesValues,
        meansure: meansureValues,
      });
    }
  };

  React.useEffect(() => {
    const fetchRecipesDetails = async () => {
      const urlDetails = pathname === 'meals' ? `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${idRecipe}` : `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${idRecipe}`;
      const dados = await fetchDetails(pathname, urlDetails);
      setDetails(dados);
      setIngredientesAndMeansure(dados);
    };
    const fetchRecommendation = async () => {
      const urlRecommendation = pathname === 'meals'
        ? 'https://www.thecocktaildb.com/api/json/v1/1/search.php?s='
        : 'https://www.themealdb.com/api/json/v1/1/search.php?s=';
      const data = await fetchData(urlRecommendation);
      if (data) {
        setRecommendation(data[pathname === 'meals' ? 'drinks' : 'meals']);
      }
    };
    setInProgress(checkProgress(idRecipe, pathname));
    setDone(doneProgress(idRecipe));
    fetchRecommendation();
    fetchRecipesDetails();
  }, [idRecipe, location, pathname]);

  const handleClick = () => {
    const rout = `/${pathname}/${idRecipe}/in-progress`;
    navigate(rout);
  };

  if (details) {
    return (

      <div>
        <img
          style={ { maxWidth: '100%' } }
          data-testid="recipe-photo"
          src={ details.strDrinkThumb || details.strMealThumb }
          alt="img"
        />
        <h1 data-testid="recipe-title">
          {details.strMeal || details.strDrink}
        </h1>
        <p data-testid="recipe-category">
          {pathname === 'meals' ? details.strCategory : details.strAlcoholic}
        </p>
        <ol>
          {ingredientsAndMeansures.ingredientes.map((el:string, i:number) => {
            return (
              <li
                key={ i }
                data-testid={ `${i}-ingredient-name-and-measure` }
              >
                {el}
                {' '}
                {ingredientsAndMeansures.meansure[i]}
              </li>
            );
          })}
        </ol>
        <p data-testid="instructions">
          {details.strInstructions}
        </p>
        {pathname === 'meals' && (
          <iframe
            data-testid="video"
            width="560"
            height="315"
            src={ details.strYoutube }
            title="Youtube video player"
          />
        )}
        <div
          style={ { display: 'flex', flexDirection: 'row', overflowX: 'auto' } }
        >
          {recommendation && recommendation.slice(0, 6).map((el:any, i:number) => {
            return (
              <div
                style={ { width: '50%', marginRight: '250px' } }
                key={ i }
                data-testid={ `${i}-recommendation-card` }
              >
                <p
                  data-testid={ `${i}-recommendation-title` }
                >
                  {el.strMeal || el.strDrink}
                </p>
              </div>
            );
          })}
        </div>
        <div style={ { position: 'fixed', top: 0, right: '0' } }>
          <Share />
          <FavoriteBtn
            obj={ {
              id: idRecipe,
              type: pathname.replace('s', ''),
              nationality: details.strArea || '',
              category: details.strCategory,
              alcoholicOrNot: details.strAlcoholic || '',
              name: details.strMeal || details.strDrink,
              image: details.strDrinkThumb || details.strMealThumb } }
          />
        </div>
        {!done && (
          <button
            style={ { position: 'fixed', bottom: '0' } }
            data-testid="start-recipe-btn"
            onClick={ handleClick }
          >
            {inProgress ? 'Continue Recipe' : 'Start Recipe'}
          </button>)}
      </div>

    );
  }
}

export default RecipeDetails;
