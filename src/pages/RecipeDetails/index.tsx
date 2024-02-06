import React from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchData,
  fetchDetails,
  checkProgress, doneProgress } from '../../FuctionHelpes/FetchFunction';
import Share from '../../components/Share';
import FavoriteBtn from '../../components/FavoriteBtn';
import styles from './recipeDetails.module.css';

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
      }).map((el) => dados[el])
        .filter((el) => el !== null);
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

      <div className={ styles.container }>
        <img
          className={ styles.photo }
          style={ { maxWidth: '100%' } }
          data-testid="recipe-photo"
          src={ details.strDrinkThumb || details.strMealThumb }
          alt="img"
        />
        <div className={ styles.titles }>
          <h1 className={ styles.title } data-testid="recipe-title">
            {details.strMeal || details.strDrink}
          </h1>
          <p data-testid="recipe-category">
            {pathname === 'meals' ? details.strCategory : details.strAlcoholic}
          </p>
        </div>
        <h2 className={ styles.title2 }>Ingredients</h2>
        <ol className={ styles.ingredientList }>
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
        <h2 className={ styles.title2 }>Instructions</h2>
        <p className={ styles.instructions } data-testid="instructions">
          {details.strInstructions}
        </p>
        <h2 className={ styles.title2 }>Instructions</h2>
        {pathname === 'meals' && (
          <iframe
            className={ styles.video }
            data-testid="video"
            width="560"
            height="315"
            src={ details.strYoutube }
            title="Youtube video player"
          />
        )}
        <h2 className={ styles.title2 }>Recomendation</h2>
        <div
          style={ {
            display: 'flex',
            flexDirection: 'row',
            overflowX: 'auto',
            paddingBottom: '50px' } }
        >
          {recommendation && recommendation.slice(0, 6).map((el:any, i:number) => {
            return (
              <div
                className={ styles.card }
                style={ { width: '50%', margin: '0 40px' } }
                key={ i }
                data-testid={ `${i}-recommendation-card` }
              >
                <img
                  className={ styles.image }
                  src={ el.strDrinkThumb || el.strMealThumb }
                  alt="RecipeRecomendation"
                />
                <p
                  className={ styles.name }
                  data-testid={ `${i}-recommendation-title` }
                >
                  {el.strMeal || el.strDrink}
                </p>
              </div>
            );
          })}
        </div>
        <div style={ { position: 'fixed', top: 0, right: '0' } }>
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
          <Share idRecipe={ idRecipe } path={ pathname.replace('s', '') } />
        </div>
        {!done && (
          <button
            className={ styles.btn }
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
