import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function SearchBar() {
  const [searchInput, setSearchInput] = React.useState('');
  const [searchType, setSearchType] = React.useState('Ingredient');
  const [searchResults, setSearchResults] = React.useState<any>([]);
  const location = useLocation();
  const navigate = useNavigate();
  const handleSearchTypeChange = (event: any) => {
    setSearchType(event.target.value);
  };

  const searchRecipes = async () => {
    let endpoint = '';

    switch (searchType) {
      case 'Ingredient':
        endpoint = `https://www.${location.pathname === '/meals' ? 'themealdb' : 'thecocktaildb'}.com/api/json/v1/1/filter.php?i=${searchInput}`;
        break;
      case 'Name':
        endpoint = `https://www.${location.pathname === '/meals' ? 'themealdb' : 'thecocktaildb'}.com/api/json/v1/1/search.php?s=${searchInput}`;
        break;
      case 'First letter':
        if (searchInput.length === 1) {
          endpoint = `https://www.${location.pathname === '/meals' ? 'themealdb' : 'thecocktaildb'}.com/api/json/v1/1/search.php?f=${searchInput}`;
        } else {
          window.alert('Your search must have only 1 (one) character');
          return;
        }
        break;
         // no default
    }

    const response = await fetch(endpoint);
    const data = await response.json();
    console.log(data);

    if (data.meals === null || data.drinks === null) {
      setSearchResults(null);
      return;
    }
    setSearchResults(data.meals || data.drinks);
  };

  React.useEffect(() => {
    if (searchResults === null) {
      window.alert("Sorry, we haven't found any recipes for these filters");
    } else if (searchResults.length === 1) {
      navigate(`${location.pathname}/${searchResults[0].idMeal
        || searchResults[0].idDrink}`);
    }
  }, [location.pathname, navigate, searchResults]);

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
      <button type="button" onClick={ searchRecipes } data-testid="exec-search-btn">
        Search
      </button>
    </div>
  );
}

export default SearchBar;
