import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import iconPerfil from '../../images/profileIcon.svg';
import searchIcon from '../../images/searchIcon.svg';
import SearchBar from '../SearchBar';
import styles from './Header.module.css';
import iconeRecipe from '../../images/iconeRecipe.svg';
import logoText from '../../images/logoTextRecipe.png';

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
    <header className={ styles.header }>
      <div className={ styles.container }>
        <div>
          <img src={ iconeRecipe } alt="IconeRecipe" />
          <img src={ logoText } alt="logoText" />
        </div>
        <div>
          <Link className={ styles.perfilLink } to="/profile">
            <img
              data-testid="profile-top-btn"
              src={ iconPerfil }
              alt="IconePerfil"
            />
          </Link>
          {(location.pathname === '/meals'
            || location.pathname === '/drinks') && (
              <button
                className={ styles.searchBTN }
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
      </div>
      <h1 data-testid="page-title" className={ styles.title }>{title}</h1>
      {search && <SearchBar />}
    </header>
  );
}

export default Header;
