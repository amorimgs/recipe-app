import React, { useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { searchRecipes } from '../../FuctionHelpes/FetchFunction';
import Context from '../../context/Context';

function SearchBar() {
  const [searchInput, setSearchInput] = React.useState('');
  const [searchType, setSearchType] = React.useState('Ingredient');
  const location = useLocation();
  const navigate = useNavigate();
  const { recipes, setRecipes } = useContext(Context);

  const handleSearchTypeChange = (event: any) => {
    setSearchType(event.target.value);
  };

  React.useEffect(() => {
    if (recipes) {
      if (recipes.length === 0) {
        window.alert("Sorry, we haven't found any recipes for these filters");
      } else if (recipes.length === 1) {
        const urlNavigate = location.pathname === '/meals'
          ? `${location.pathname}/${recipes[0].idMeal}`
          : `${location.pathname}/${recipes[0].idDrink}`;
        navigate(urlNavigate);
      }
    }
  }, [location.pathname, navigate, recipes]);

  const handleClick = async () => {
    const locationFormated = location.pathname.replace('/', '');
    const data = await searchRecipes(searchType, location, searchInput);
    console.log(data);
    if (data === undefined || data[locationFormated] === null) {
      window.alert('Sorry, we haven\'t found any recipes for these filters');
      setRecipes([]);
      return;
    }
    setRecipes(data[locationFormated]);
  };

  return (
    <div>
      <input
        type="text"
        value={ searchInput }
        onChange={ (e) => setSearchInput(e.target.value) }
        placeholder="Enter search term"
        data-testid="search-input"
      />
      <label>
        <input
          type="radio"
          name="searchType"
          value="Ingredient"
          checked={ searchType === 'Ingredient' }
          onChange={ handleSearchTypeChange }
          data-testid="ingredient-search-radio"
        />
        Ingredient
      </label>
      <label>
        <input
          type="radio"
          name="searchType"
          value="Name"
          checked={ searchType === 'Name' }
          onChange={ handleSearchTypeChange }
          data-testid="name-search-radio"
        />
        Name
      </label>
      <label>
        <input
          type="radio"
          name="searchType"
          value="First letter"
          checked={ searchType === 'First letter' }
          onChange={ handleSearchTypeChange }
          data-testid="first-letter-search-radio"
        />
        First letter
      </label>
      <button type="button" onClick={ handleClick } data-testid="exec-search-btn">
        Search
      </button>
    </div>
  );
}

export default SearchBar;
