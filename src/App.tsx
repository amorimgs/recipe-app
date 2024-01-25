import React from 'react';
import { Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './pages/Login';
import Recipes from './pages/Recipes';
import RecipeDetails from './pages/RecipeDetails';
import RecipeInProgress from './pages/RecipeInProgress';
import DoneRecipes from './pages/DoneRecipes';
import FavoriteRecipes from './pages/FavoritesRecipes';
import Profile from './pages/Profile';
import Provider from './context/Provider';

function App() {
  return (
    <Provider>
      <div className="meals">
        <Routes>
          <Route path="/" element={ <Login /> } />
          <Route path="/meals" element={ <Recipes /> } />
          <Route path="/drinks" element={ <Recipes /> } />
          <Route path="/meals/:id" element={ <RecipeDetails /> } />
          <Route path="/drinks/:id" element={ <RecipeDetails /> } />
          <Route path="/meals/:id/in-progress" element={ <RecipeInProgress /> } />
          <Route path="/drinks/:id/in-progress" element={ <RecipeInProgress /> } />
          <Route path="/done-recipes" element={ <DoneRecipes /> } />
          <Route path="/favorite-recipes" element={ <FavoriteRecipes /> } />
          <Route path="/profile" element={ <Profile /> } />
        </Routes>
      </div>
    </Provider>
  );
}

export default App;
