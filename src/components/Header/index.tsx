import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import iconPerfil from '../../images/profileIcon.svg';
import searchIcon from '../../images/searchIcon.svg';
import SearchBar from '../SearchBar';

function Header() {
  const [search, setSearch] = React.useState(false);
  const [title, setTitle] = React.useState('');
  const location = useLocation();
  React.useEffect(() => {
    switch (location.pathname) {
      case '/drinks':
        setTitle('Drinks');
        break;
      case '/meals':
        setTitle('Meals');
        break;
      case '/profile':
        setTitle('Profile');
        break;
      case '/done-recipes':
        setTitle('Done Recipes');
        break;
      case '/favorite-recipes':
        setTitle('Favorite Recipes');
        break;
      // no default
    }
  }, [location.pathname]);

  return (
    <header>
      <div>
        <Link to="/profile">
          <img
            data-testid="profile-top-btn"
            src={ iconPerfil }
            alt="IconePerfil"
          />
        </Link>
        {(location.pathname === '/meals'
          || location.pathname === '/drinks') && (
            <button
              onClick={ () => {
                setSearch(!search);
              } }
            >
              <img
                data-testid="search-top-btn"
                src={ searchIcon }
                alt="searchIcon"
              />
            </button>
        )}
      </div>
      <h1 data-testid="page-title">{title}</h1>
      {search && <SearchBar />}
    </header>
  );
}

export default Header;
