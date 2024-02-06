import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import styles from './profile.module.css';

function Profile() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const { email } = user;
  return (
    <div>
      <Header />
      <h3 className={ styles.email } data-testid="profile-email">
        Email:
        { ' ' }
        { email }
      </h3>
      <div className={ styles.links }>
        <Link to="/done-recipes">
          <button
            className={ styles.btn }
            type="button"
            data-testid="profile-done-btn"
          >
            Done Recipes
          </button>
        </Link>
        <Link to="/favorite-recipes">
          <button
            className={ styles.btn }
            type="button"
            data-testid="profile-favorite-btn"
          >
            Favorite Recipes
          </button>
        </Link>
        <Link to="/">
          <button
            className={ styles.btn }
            type="button"
            data-testid="profile-logout-btn"
            onClick={ () => localStorage.clear() }
          >
            Logout
          </button>
        </Link>
      </div>
      <Footer />
    </div>
  );
}

export default Profile;
