import React from 'react';
import { useState } from 'react';

function SearchBar() {
  const [searchInput, setSearchInput] = useState('');
  const [searchType, setSearchType] = useState('Ingredient');

  const handleSearchTypeChange = (event: any) => {
    setSearchType(event.target.value);
  };

  const searchRecipes = async () => {
    let endpoint = '';

    switch (searchType) {
      case 'Ingredient':
        endpoint = `https://www.themealdb.com/api/json/v1/1/filter.php?i=${searchInput}`;
        break;
      case 'Name':
        endpoint = `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchInput}`;
        break;
      case 'First letter':
        if (searchInput.length === 1) {
          endpoint = `https://www.themealdb.com/api/json/v1/1/search.php?f=${searchInput}`;
        } else {
          window.alert('Your search must have only 1 (one) character');
          return;
        }
        break;
      default:
        break;
    }

    try {
      const response = await fetch(endpoint);
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error(error);
    }
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
      <button type="button" onClick={ searchRecipes } data-testid="exec-search-btn">
        Search
      </button>
    </div>
  );
}

export default SearchBar;
