import React, { useEffect } from 'react';
import BlackHeartIcon from '../../images/blackHeartIcon.svg';
import WhiteHeartIcon from '../../images/whiteHeartIcon.svg';
import { checkFavorite } from '../../FuctionHelpes/FetchFunction';

function FavoriteBtn({ obj }: { obj: any }) {
  const setFavoriteRecipes = () => {
    if (checkFavorite(obj.id)) {
      const favoriteStorage = window.localStorage
        .getItem('favoriteRecipes');
      if (favoriteStorage) {
        const favoriteRecipes = JSON.parse(favoriteStorage);
        const newFavoriteRecipes = favoriteRecipes.filter((el:any) => el.id !== obj.id);
        window.localStorage
          .setItem('favoriteRecipes', JSON.stringify(newFavoriteRecipes));
      }
    } else {
      const reciteFormated = [{
        id: obj.id,
        type: obj.type,
        nationality: obj.nationality,
        category: obj.category,
        alcoholicOrNot: obj.alcoholicOrNot,
        name: obj.name,
        image: obj.image }];
      const favoriteLocalStorage = window.localStorage.getItem('favoriteRecipes');
      if (favoriteLocalStorage) {
        const favoriteRecipes = JSON.parse(favoriteLocalStorage);
        favoriteRecipes.push(reciteFormated[0]);
        window.localStorage.setItem('favoriteRecipes', JSON.stringify(favoriteRecipes));
      } else {
        window.localStorage.setItem('favoriteRecipes', JSON.stringify(reciteFormated));
      }
    }
  };
  useEffect(() => {
    setFavorite(checkFavorite(obj.id));
  }, [obj.id]);
  const [favorite, setFavorite] = React.useState<boolean>(false);
  return (
    <button
      onClick={ () => {
        setFavoriteRecipes();
        setFavorite(checkFavorite(obj.id));
      } }
    >
      <img
        data-testid="favorite-btn"
        src={ favorite ? BlackHeartIcon : WhiteHeartIcon }
        alt="FavoriteIcon"
      />
    </button>
  );
}

export default FavoriteBtn;
