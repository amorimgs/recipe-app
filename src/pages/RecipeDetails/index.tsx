import React from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchData, fetchDetails } from '../../FuctionHelpes/FetchFunction';
import ShareIcon from '../../images/shareIcon.svg';
import BlackHeartIcon from '../../images/blackHeartIcon.svg';
import WhiteHeartIcon from '../../images/whiteHeartIcon.svg';

function RecipeDetails() {
  const [details, setDetails] = React.useState<any>(null);
  const [ingredientsAndMeansures, setIngredientesAndMeansures] = React.useState<any>({
    ingredientes: [],
    meansure: [],
  });
  const [recommendation, setRecommendation] = React.useState<any>(null);
  const [inProgress, setInProgress] = React.useState<boolean>(false);
  const [copy, setCopy] = React.useState<boolean>(false);
  const [done, setDone] = React.useState<boolean>(false);
  const [favorite, setFavorite] = React.useState<boolean>(false);
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

  const checkFavorite = () => {
    const favoriteStorage = window.localStorage
      .getItem('favoriteRecipes');
    if (favoriteStorage) {
      const favoriteRecipes = JSON.parse(favoriteStorage);
      return favoriteRecipes.find((el:any) => el.id === idRecipe);
    }
  };

  React.useEffect(() => {
    const fetchRecipesDetails = async () => {
      const urlDetails = pathname === 'meals' ? `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${idRecipe}` : `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${idRecipe}`;
      const dados = await fetchDetails(pathname, urlDetails);
      setDetails(dados);
      setIngredientesAndMeansure(dados);
      console.log(dados);
    };
    const fetchRecommendation = async () => {
      const urlRecommendation = pathname === 'meals'
        ? 'https://www.thecocktaildb.com/api/json/v1/1/search.php?s='
        : 'https://www.themealdb.com/api/json/v1/1/search.php?s=';
      const data = await fetchData(urlRecommendation);
      setRecommendation(data[pathname === 'meals' ? 'drinks' : 'meals']);
    };
    setFavorite(() => {
      const favoriteStorage = window.localStorage
        .getItem('favoriteRecipes');
      if (favoriteStorage) {
        const favoriteRecipes = JSON.parse(favoriteStorage);
        return favoriteRecipes.find((el:any) => el.id === idRecipe);
      }
    });
    const checkProgress = () => {
      const inProgressRecipes = window.localStorage.getItem('inProgressRecipes');
      if (inProgressRecipes) {
        const bolean = JSON.parse(inProgressRecipes)[pathname][idRecipe];
        setInProgress(bolean);
      }
    };
    const doneProgress = () => {
      const favoriteStorage = window.localStorage
        .getItem('doneRecipes');
      if (favoriteStorage) {
        const favoriteRecipes = JSON.parse(favoriteStorage);
        return favoriteRecipes.find((el:any) => el.id === idRecipe);
        setDone(true);
      }
    };
    doneProgress();
    checkProgress();
    fetchRecommendation();
    fetchRecipesDetails();
  }, [idRecipe, location, pathname]);

  const handleClick = () => {
    const rout = `/${pathname}/${idRecipe}/in-progress`;
    navigate(rout);
  };

  const setFavoriteRecipes = () => {
    if (checkFavorite()) {
      const favoriteStorage = window.localStorage
        .getItem('favoriteRecipes');
      if (favoriteStorage) {
        const favoriteRecipes = JSON.parse(favoriteStorage);
        const newFavoriteRecipes = favoriteRecipes.filter((el:any) => el.id !== idRecipe);
        window.localStorage
          .setItem('favoriteRecipes', JSON.stringify(newFavoriteRecipes));
      }
    } else {
      const reciteFormated = [{
        id: idRecipe,
        type: pathname.replace('s', ''),
        nationality: details.strArea || '',
        category: details.strCategory,
        alcoholicOrNot: details.strAlcoholic || '',
        name: details.strMeal || details.strDrink,
        image: details.strDrinkThumb || details.strMealThumb }];
      window.localStorage.setItem('favoriteRecipes', JSON.stringify(reciteFormated));
    }
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
          <button
            onClick={ () => {
              navigator.clipboard.writeText(window.location.href);
              setCopy(true);
              setTimeout(() => {
                setCopy(false);
              }, 2000);
            } }
          >
            <img data-testid="share-btn" src={ ShareIcon } alt="ShareIcon" />
          </button>
          <button
            onClick={ () => {
              setFavoriteRecipes();
              setFavorite(checkFavorite());
            } }
          >
            <img
              data-testid="favorite-btn"
              src={ favorite ? BlackHeartIcon : WhiteHeartIcon }
              alt="FavoriteIcon"
            />
          </button>
        </div>
        {!done && (
          <button
            style={ { position: 'fixed', bottom: '0' } }
            data-testid="start-recipe-btn"
            onClick={ handleClick }
          >
            {inProgress ? 'Continue Recipe' : 'Start Recipe'}
          </button>)}
        {copy && <h2>Link copied!</h2>}
      </div>

    );
  }
}

export default RecipeDetails;
