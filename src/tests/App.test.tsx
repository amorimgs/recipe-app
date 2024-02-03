import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import Profile from '../pages/Profile';
import FavoriteRecipes from '../pages/FavoriteRecipes';
import App from '../App';
import * as api from '../FuctionHelpes/FetchFunction';
import DoneRecipes from '../pages/DoneRecipes';

const renderWithRouter = (ui: JSX.Element, { route = '/' } = {}) => {
  window.history.pushState({}, '', route);

  return {
    user: userEvent.setup(),
    ...render(ui, { wrapper: BrowserRouter }),
  };
};

describe('Testar a tela inicial de login', () => {
  const email = 'email-input';
  const password = 'password-input';
  const submitBtn = 'login-submit-btn';

  test('Verificar se existem os campos de email, senha e botão', () => {
    renderWithRouter(<App />);

    const getEmail = screen.getByTestId(email);
    const getPassword = screen.getByTestId(password);
    const getSubmitBtn = screen.getByTestId(submitBtn);

    expect(getEmail).toBeInTheDocument();
    expect(getPassword).toBeInTheDocument();
    expect(getSubmitBtn).toBeInTheDocument();
  });

  test('Verificar se o botão "Enter" é habilitado após validação do email e senha', async () => {
    const { user } = renderWithRouter(<App />);

    const getEmail = screen.getByTestId(email);
    const getPassword = screen.getByTestId(password);
    const getSubmitBtn = screen.getByTestId(submitBtn);

    await user.type(getEmail, 'email@test.com');
    await user.type(getPassword, '1234567');

    expect(getSubmitBtn).toBeEnabled();
  });

  test('Verificar se após clicar o botão submit o email é salvo no localstorage e redirecionado para página meals', async () => {
    const { user } = renderWithRouter(<App />);

    const getEmail = screen.getByTestId(email);
    const getPassword = screen.getByTestId(password);
    const getSubmitBtn = screen.getByTestId(submitBtn);
    const emailTest = 'teste@teste.com';

    await user.type(getEmail, emailTest);
    await user.type(getPassword, '123456789');
    await user.click(getSubmitBtn);

    const userLS = {
      email: emailTest,
    };

    expect(window.localStorage.getItem('user')).toEqual(JSON.stringify(userLS));
  });
});

describe('Testar Header', () => {
  renderWithRouter(<App />, { route: '/meals' });
  test('Verificar se o botão de perfil está funcionndo corretamente', async () => {
    const { user } = renderWithRouter(<App />, { route: '/meals' });
    screen.findByRole('heading', {
      name: /meals/i,
    });
    const profileBbtn = screen.getAllByRole('link', {
      name: /iconeperfil/i,
    });
    await user.click(profileBbtn[0]);
    screen.findByRole('heading', {
      name: /profile/i,
    });
  });
  test('Verificar se o botão de search está funcionndo corretamente', async () => {
    const { user } = renderWithRouter(<App />, { route: '/meals' });

    const searchBbtn = screen.getByRole('button', {
      name: /searchicon/i,
    });
    await user.click(searchBbtn);
    screen.getByRole('textbox');
  });
  test('Verifica Title Done Recipes', async () => {
    renderWithRouter(<App />, { route: '/done-recipes' });
    screen.findByRole('heading', {
      name: /Done Recipes/i,
    });
  });
  test('Verifica Title Favorite Recipes', async () => {
    renderWithRouter(<App />, { route: '/favorite-recipes' });
    screen.findByRole('heading', {
      name: /Favorite Recipes/i,
    });
  });
  test('Verifica Title Drinks', async () => {
    renderWithRouter(<App />, { route: '/drinks' });
    screen.findByRole('heading', {
      name: /Drinks/i,
    });
  });
});

describe('Testar SearchBar', () => {
  const searchInput = 'search-input';
  const searchTopBtn = 'search-top-btn';
  const execSearchBtn = 'exec-search-btn';
  const NameSearchRadio = 'name-search-radio';
  beforeEach(() => {
    vi.resetAllMocks();
  });
  test('Verificar se o input de search está funcionando corretamente', async () => {
    vi.spyOn(api, 'searchRecipes').mockResolvedValueOnce({ meals: [
      { idMeal: '52977', strMeal: 'Corba', strMealThumb: 'https://www.themealdb.com/images/media/meals/58oia6156491652.jpg' },
    ] }).mockResolvedValueOnce({ meals: null }).mockResolvedValueOnce({ meals: [
      { idMeal: '52885', strMeal: 'Bubble & Squeak', strMealThumb: 'https://www.themealdb.com/images/media/meals/xusqvw1511638311.jpg' },
    ] });

    const { user } = renderWithRouter(<App />, { route: '/meals' });
    await user.click(screen.getByTestId(searchTopBtn));
    const RadioIngredientes = await screen.findByTestId('ingredient-search-radio');
    const RadioName = await screen.findByTestId(NameSearchRadio);
    const input = await screen.findByTestId(searchInput);
    const execSearchBTN = await screen.findByTestId(execSearchBtn);
    expect(execSearchBTN).toBeInTheDocument();
    await user.click(RadioName);
    await user.click(RadioIngredientes);
    await user.type(input, 'lkajsdl');
    await user.click(execSearchBTN);
  });

  test('Verificar alert search', async () => {
    const { user } = renderWithRouter(<App />, { route: '/meals' });

    await user.click(screen.getByTestId(searchTopBtn));

    const RadioName = await screen.findByTestId(NameSearchRadio);
    await user.click(RadioName);

    const input = await screen.findByTestId(searchInput);
    await user.type(input, 'Xablauzao');

    const execSearchBTN = await screen.findByTestId(execSearchBtn);
    await user.click(execSearchBTN);
  });

  test('Verificar redirecionamento', async () => {
    vi.spyOn(api, 'searchRecipes').mockResolvedValueOnce({ drinks: [
      { idDrink: '17222', strDrink: 'A1', strDrinkThumb: 'https://www.thecocktaildb.com/images/media/drink/2x8thr150481692.jpg' },
    ] });

    const { user } = renderWithRouter(<App />, { route: '/drinks' });

    await user.click(screen.getByTestId(searchTopBtn));

    const RadioName = await screen.findByTestId(NameSearchRadio);
    await user.click(RadioName);

    const input = await screen.findByTestId(searchInput);
    await user.type(input, 'A1');
    expect(input).toHaveValue('A1');
    const execSearchBTN = await screen.findByTestId(execSearchBtn);
    await user.click(execSearchBTN);

    expect(window.location.pathname).toBe('/drinks/17222');
  });
});

describe('Testar Footer', () => {
  test('Verificar se o botão de drinks redireciona para a página correta', async () => {
    const { user } = renderWithRouter(<App />, { route: '/meals' });

    const drinksButton = screen.getByTestId('drinks-bottom-btn');
    await user.click(drinksButton);

    expect(window.location.pathname).toBe('/drinks');
  });

  test('Verificar se o botão de meals redireciona para a página correta', async () => {
    const { user } = renderWithRouter(<App />, { route: '/drinks' });

    const mealsButton = screen.getByTestId('meals-bottom-btn');
    await user.click(mealsButton);

    expect(window.location.pathname).toBe('/meals');
  });
});

describe('Componente Profile', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('renders user email', () => {
    localStorage.setItem('user', JSON.stringify({ email: 'test@example.com' }));
    const { getByTestId } = render(<BrowserRouter><Profile /></BrowserRouter>);
    expect(getByTestId('profile-email')).toHaveTextContent('Email: test@example.com');
  });

  test('renderiza o botão Receitas Favoritas', () => {
    const { getByTestId } = render(<BrowserRouter><Profile /></BrowserRouter>);
    expect(getByTestId('profile-favorite-btn')).toBeInTheDocument();
  });

  test('renderiza o botão Receitas Concluídas', () => {
    const { getByTestId } = render(<BrowserRouter><Profile /></BrowserRouter>);
    expect(getByTestId('profile-done-btn')).toBeInTheDocument();
  });

  test('renderiza o botão Logout', () => {
    const { getByTestId } = render(<BrowserRouter><Profile /></BrowserRouter>);
    expect(getByTestId('profile-logout-btn')).toBeInTheDocument();
  });

  test('limpa localStorage ao sair', () => {
    localStorage.setItem('user', JSON.stringify({ email: 'test@example.com' }));
    const { getByTestId } = render(<BrowserRouter><Profile /></BrowserRouter>);
    const logoutButton = getByTestId('profile-logout-btn');
    fireEvent.click(logoutButton);
    expect(localStorage.getItem('user')).toBeNull();
  });

  test('navigates to Done Recipes page when Done Recipes button is clicked', () => {
    const { getByTestId } = render(<MemoryRouter initialEntries={ ['/'] }><Profile /></MemoryRouter>);
    const doneRecipesButton = getByTestId('profile-done-btn');
    fireEvent.click(doneRecipesButton);
  });

  test('navigates to Favorite Recipes page when Favorite Recipes button is clicked', () => {
    const { getByTestId } = render(<MemoryRouter initialEntries={ ['/'] }><Profile /></MemoryRouter>);
    const favoriteRecipesButton = getByTestId('profile-favorite-btn');
    fireEvent.click(favoriteRecipesButton);
  });

  test('navigates to Home page when Logout button is clicked', () => {
    const { getByRole } = render(<MemoryRouter initialEntries={ ['/'] }><Profile /></MemoryRouter>);
    const logoutButton = getByRole('button', { name: /logout/i });
    fireEvent.click(logoutButton);
  });
});

describe('Testando Recipes - Tela principal', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });
  test('Verifica a tela principal com meals está funcionando.', async () => {
    const fetchurl = 'https://www.themealdb.com/images/media/meals/58oia61564916529.jpg';
    vi.spyOn(api, 'fetchRecipes').mockResolvedValueOnce([
      { idMeal: '52977', strMeal: 'Corba', strMealThumb: fetchurl },
    ]).mockResolvedValueOnce([
      { idMeal: '52874', strMeal: 'Beef and Mustard Pie', strMealThumb: 'https://www.themealdb.com/images/media/meals/sytuqu1511553755.jpg' },
    ]).mockResolvedValueOnce([
      { idMeal: '52977', strMeal: 'Corba', strMealThumb: fetchurl },
    ])
      .mockResolvedValueOnce([
        { idMeal: '52874', strMeal: 'Beef and Mustard Pie', strMealThumb: 'https://www.themealdb.com/images/media/meals/sytuqu1511553755.jpg' },
      ])
      .mockResolvedValueOnce([
        { idMeal: '52977', strMeal: 'Corba', strMealThumb: fetchurl },
      ]);

    vi.spyOn(api, 'fetchCategories').mockResolvedValue([
      { strCategory: 'Beef' },
    ]);
    const { user } = renderWithRouter(<App />, { route: '/meals' });

    const link = await screen.findByTestId('0-recipe-card');
    const btnBeef = await screen.findByTestId('Beef-category-filter');
    const btnClearFilter = await screen.findByTestId('All-category-filter');
    const href = '/meals/52977';
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', href);
    await user.click(btnBeef);
    expect(link).toHaveAttribute('href', '/meals/52874');
    await user.click(btnBeef);
    expect(link).toHaveAttribute('href', href);
    await user.click(btnBeef);
    expect(link).toHaveAttribute('href', '/meals/52874');
    await user.click(btnClearFilter);
    expect(link).toHaveAttribute('href', href);
    await user.click(link);
    expect(window.location.pathname).toBe(href);
  });

  test('Verifica a tela principal com drinks está funcionando.', async () => {
    const fetchurl = 'https://www.thecocktaildb.com/images/media/drink/2x8thr1504816928.jpg';
    vi.spyOn(api, 'fetchRecipes').mockResolvedValueOnce([
      { idDrink: '17222', strDrink: 'A1', strDrinkThumb: fetchurl },
    ]).mockResolvedValueOnce([
      { idDrink: '15997', strDrink: 'GG', strDrinkThumb: 'https://www.thecocktaildb.com/images/media/drink/vyxwut1468875960.jpg' },
    ]).mockResolvedValueOnce([
      { idDrink: '17222', strDrink: 'A1', strDrinkThumb: fetchurl },
    ])
      .mockResolvedValueOnce([
        { idDrink: '15997', strDrink: 'GG', strDrinkThumb: 'https://www.thecocktaildb.com/images/media/drink/vyxwut1468875960.jpg' },
      ])
      .mockResolvedValueOnce([
        { idDrink: '17222', strDrink: 'A1', strDrinkThumb: fetchurl },
      ]);

    vi.spyOn(api, 'fetchCategories').mockResolvedValue([
      { strCategory: 'Ordinary Drink' },
    ]);
    const { user } = renderWithRouter(<App />, { route: '/drinks' });

    const link = await screen.findByTestId('0-recipe-card');
    const btnordinary = await screen.findByTestId('Ordinary Drink-category-filter');
    const btnClearFilter = await screen.findByTestId('All-category-filter');
    const href = '/drinks/17222';
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', href);
    await user.click(btnordinary);
    expect(link).toHaveAttribute('href', '/drinks/15997');
    await user.click(btnordinary);
    expect(link).toHaveAttribute('href', href);
    await user.click(btnordinary);
    expect(link).toHaveAttribute('href', '/drinks/15997');
    await user.click(btnClearFilter);
    expect(link).toHaveAttribute('href', href);
    await user.click(link);
    expect(window.location.pathname).toBe(href);
  });
});

describe('Componente de Receitas Favoritas', () => {
  const mockRecipes = [
    {
      id: '52771',
      type: 'meal',
      nationality: 'Italian',
      category: 'Vegetarian',
      alcoholicOrNot: '',
      name: 'Spicy Arrabiata Penne',
      image: 'https://www.themealdb.com/images/media/meals/ustsqw1468250014.jpg',
    },
    {
      id: '178319',
      type: 'drink',
      nationality: '',
      category: 'Cocktail',
      alcoholicOrNot: 'Alcoholic',
      name: 'Aquamarine',
      image: 'https://www.thecocktaildb.com/images/media/drink/zvsre31572902738.jpg',
    },
  ];
  beforeEach(() => {
    localStorage.clear();
  });
  test('deve exibir todas as receitas quando o filtro "All" é selecionado', async () => {
    localStorage.setItem('favoriteRecipes', JSON.stringify(mockRecipes));
    const { getByTestId, queryAllByTestId } = render(<BrowserRouter><FavoriteRecipes /></BrowserRouter>);
    await userEvent.click(getByTestId('filter-by-all-btn'));
    const recipeCards = queryAllByTestId(/-horizontal-name/i);

    expect(recipeCards.length).toBeGreaterThan(0);
  });
  test('deve exibir as receitas quando o filtro "Meals" é selecionado', async () => {
    localStorage.setItem('favoriteRecipes', JSON.stringify(mockRecipes));

    const { getByTestId, queryAllByTestId } = render(<BrowserRouter><FavoriteRecipes /></BrowserRouter>);

    await userEvent.click(getByTestId('filter-by-meal-btn'));

    const recipeCards = queryAllByTestId(/-horizontal-name/i);

    expect(recipeCards.length).toBeGreaterThan(0);
  });

  test('deve desfavoritar uma receita corretamente', async () => {
    localStorage.setItem('favoriteRecipes', JSON.stringify(mockRecipes));
    vi.resetAllMocks();

    const { getByTestId, queryAllByTestId } = render(<BrowserRouter><FavoriteRecipes /></BrowserRouter>);

    const favoriteButton = getByTestId('0-horizontal-favorite-btn');
    const recipeCardsBefore = queryAllByTestId(/-horizontal-name/i);

    expect(recipeCardsBefore.length).toBe(2);

    fireEvent.click(favoriteButton);

    const recipeCardsAfter = queryAllByTestId(/-horizontal-name/i);

    expect(recipeCardsAfter.length).toBe(1);
  });
  test('deve filtrar receitas por tipo corretamente', async () => {
    localStorage.setItem('favoriteRecipes', JSON.stringify(mockRecipes));

    const { getByTestId, queryAllByTestId } = render(<BrowserRouter><FavoriteRecipes /></BrowserRouter>);

    await userEvent.click(getByTestId('filter-by-drink-btn'));

    const recipeCards = queryAllByTestId(/-horizontal-name/i);
    const shareButton = getByTestId('0-horizontal-share-btn');

    expect(recipeCards.length).toBe(1);
    fireEvent.click(shareButton);

    const linkCopiedText = await screen.findByText('Link copied!');
    expect(linkCopiedText).toBeInTheDocument();
  });
  test('notAcolic', async () => {
    localStorage.setItem('favoriteRecipes', JSON.stringify([
      {
        id: '178319',
        type: 'drink',
        nationality: '',
        category: 'Cocktail',
        alcoholicOrNot: '',
        name: 'Aquamarine',
        image: 'https://www.thecocktaildb.com/images/media/drink/zvsre31572902738.jpg',
      },
    ]));
    render(<BrowserRouter><FavoriteRecipes /></BrowserRouter>);

    expect(screen.getByText(/alcoholic/i)).toHaveTextContent('Non-Alcoholic');
  });

  test('deve redefinir o estado de mensagem compartilhada após copiar o texto', async () => {
    localStorage.setItem('favoriteRecipes', JSON.stringify(mockRecipes));

    const { getByTestId } = render(<BrowserRouter><FavoriteRecipes /></BrowserRouter>);

    const shareButton = getByTestId('0-horizontal-share-btn');
    fireEvent.click(shareButton);

    const linkCopiedText = await screen.findByText('Link copied!');
    expect(linkCopiedText).toBeInTheDocument();
  });
});

describe('Testando Recipes - Tela de detalhes', () => {
  const mockDetails = {
    strMeal: 'Test Meal',
    strCategory: 'Test Category',
    strInstructions: 'Test Instructions',
    strMealThumb: 'test-meal.jpg',
    strYoutube: 'https://www.youtube.com/embed/test-video',
    strIngredient1: 'Test Ingredient 1',
    strMeasure1: 'Test Measure 1',
  };
  const startRecipeBtn = 'start-recipe-btn';
  const rota = '/meals/52799';
  beforeEach(() => {
    // Limpa os mocks antes de cada teste
    vi.resetAllMocks();
  });
  test('Testar Elementos da tela', async () => {
    vi.spyOn(api, 'fetchDetails').mockResolvedValue(mockDetails);
    vi.spyOn(api, 'fetchData').mockResolvedValue({ drinks: [{ strDrink: 'A1' }] });
    const { user } = renderWithRouter(<App />, { route: rota });

    expect(await screen.findByRole('img', {
      name: /img/i,
    })).toBeInTheDocument();
    expect(await screen.findByRole('heading', {
      name: /Test Meal/i,
    })).toBeInTheDocument();
    expect(await screen.findByTestId('recipe-category')).toBeInTheDocument();
    expect(await screen.findByTestId('instructions')).toBeInTheDocument();
    expect(await screen.findByTestId('video')).toBeInTheDocument();
    expect(await screen.findByTestId('0-ingredient-name-and-measure')).toBeInTheDocument();
    expect(await screen.findByTestId('0-recommendation-title')).toHaveTextContent('A1');
    // Testar botão de favoritar
    const favoriteBTN = await screen.findByTestId('favorite-btn');
    expect(favoriteBTN).toHaveAttribute('src', '/src/images/whiteHeartIcon.svg');
    await user.click(favoriteBTN);
    expect(favoriteBTN).toHaveAttribute('src', '/src/images/blackHeartIcon.svg');
    await user.click(favoriteBTN);
    expect(favoriteBTN).toHaveAttribute('src', '/src/images/whiteHeartIcon.svg');
    // Testar ShareButton
    const share = await screen.findByTestId('share-btn');
    await user.click(share);
    const textCopy = await screen.findByText(/link copied!/i);
    expect(textCopy).toBeInTheDocument();

    // Testar redirecionamento
    const StartRecipe = await screen.findByTestId(startRecipeBtn);
    expect(StartRecipe).toHaveTextContent('Start Recipe');
    await user.click(StartRecipe);
    expect(window.location.pathname).toBe('/meals/52799/in-progress');
  });
  test('Testar elementos tela drink', async () => {
    vi.spyOn(api, 'fetchDetails').mockResolvedValue({ strDrink: 'testDrink', strDrinkThumb: 'testDrink.jpg' });
    renderWithRouter(<App />, { route: '/drinks/52799' });
    expect(await screen.findByTestId('recipe-photo')).toBeInTheDocument();
    expect(await screen.findByTestId('recipe-title')).toBeInTheDocument();
  });
  test('Testar redirecionamento para tela de receita em andamento', async () => {
    const recipeProgress = { meals: { 52799: [] } };
    localStorage.setItem('inProgressRecipes', JSON.stringify(recipeProgress));
    vi.spyOn(api, 'fetchDetails').mockResolvedValue(mockDetails);
    renderWithRouter(<App />, { route: rota });
    const StartRecipe = await screen.findByTestId(startRecipeBtn);
    expect(StartRecipe).toHaveTextContent('Continue Recipe');
  });
  test('Testar redirecionamento para tela de receita ja concluida', async () => {
    const doneRecipe = [{ id: '52799' }];
    localStorage.setItem('doneRecipes', JSON.stringify(doneRecipe));
    vi.spyOn(api, 'fetchDetails').mockResolvedValue(mockDetails);
    renderWithRouter(<App />, { route: rota });
    const StartRecipe = screen.queryByTestId(startRecipeBtn);
    expect(StartRecipe).not.toBeInTheDocument();
  });
  test('Testando para drinks', async () => {
    vi.spyOn(api, 'fetchDetails').mockResolvedValue(mockDetails);
    vi.spyOn(api, 'fetchData').mockResolvedValue({ meals: [{ strMeal: 'A1' }] });
    renderWithRouter(<App />, { route: '/drinks/1722' });

    expect(await screen.findByTestId('recipe-photo')).toBeInTheDocument();
    expect(await screen.findByTestId('recipe-title')).toBeInTheDocument();
    expect(await screen.findByTestId('recipe-category')).toBeInTheDocument();
    expect(await screen.findByTestId('instructions')).toBeInTheDocument();
    expect(await screen.findByTestId('0-ingredient-name-and-measure')).toBeInTheDocument();
    expect(await screen.findByTestId('0-recommendation-title')).toHaveTextContent('A1');
  });
});

describe('Testando Recipes - Tela de In Progress', () => {
  const mockResulted = { meals: [{
    strMeal: 'Test Meal',
    strCategory: 'Test Category',
    strInstructions: 'Test Instructions',
    strMealThumb: 'test-meal.jpg',
    strIngredient1: 'Test Ingredient 1',
    strMeasure1: 'Test Measure 1',
  }] };
  beforeEach(() => {
    // Limpa os mocks antes de cada teste
    vi.resetAllMocks();
  });
  test('Testando elementos da tela', async () => {
    vi.spyOn(api, 'fetchData').mockResolvedValueOnce(mockResulted);
    renderWithRouter(<App />, { route: '/meals/0001/in-progress' });
    expect(await screen.findByRole('img', {
      name: /Test Meal/i,
    })).toBeInTheDocument();
    expect(await screen.findByRole('heading', {
      name: /Test Meal/i,
    })).toBeInTheDocument();
    expect(await screen.findByText(/Test Category/i)).toBeInTheDocument();
    expect(await screen.findByTestId('instructions')).toBeInTheDocument();
    expect(await screen.findByTestId('0-ingredient-step')).toBeInTheDocument();
  });
  test('Testando elementos da tela drink', async () => {
    vi.spyOn(api, 'fetchData').mockResolvedValueOnce({ drinks: [{
      strDrink: 'Drink',
      strCategory: 'Category',
      strInstructions: 'Instructions',
      strIngredient1: 'Ingredient 1',
      strMeasure1: 'Measure 1',
      strAlcoholic: 'Test Alcoholic',
      strMealThumb: 'imgTest.jog',
    }] });
    renderWithRouter(<App />, { route: '/drinks/0001/in-progress' });
    expect(await screen.findByTestId('favorite-btn')).toBeInTheDocument();
  });
});

describe('Testando Recipes - Tela de Done', () => {
  const mockRecipes = [
    {
      id: '52977',
      type: 'meal',
      nationality: 'Turkish',
      category: 'Side',
      alcoholicOrNot: '',
      name: 'Corba',
      image: 'https://www.themealdb.com/images/media/meals/58oia61564916529.jpg',
      doneDate: '2024-02-03T03:28:01.129Z',
      tags: ['Soup'],
    },
    {
      id: '17222',
      type: 'drink',
      nationality: '',
      category: 'Cocktail',
      alcoholicOrNot: 'Alcoholic',
      name: 'A1',
      image: 'https://www.thecocktaildb.com/images/media/drink/2x8thr1504816928.jpg',
      doneDate: '2024-02-03T04:03:04.323Z',
      tags: [],
    },
  ];
  beforeEach(() => {
    localStorage.clear();
  });
  test('Testando Filtros', async () => {
    localStorage.setItem('doneRecipes', JSON.stringify(mockRecipes));
    const { getByTestId, queryAllByTestId } = render(<BrowserRouter><DoneRecipes /></BrowserRouter>);
    await userEvent.click(getByTestId('filter-by-all-btn'));
    const recipeCards = queryAllByTestId(/-horizontal-name/i);

    expect(recipeCards.length).toBeGreaterThan(1);
    await userEvent.click(getByTestId('filter-by-meal-btn'));
    screen.getByText(/corba/i);
    await userEvent.click(getByTestId('filter-by-drink-btn'));
    screen.getByTestId('0-horizontal-top-text');
  });
  test('Testando acolic or not', async () => {
    localStorage.setItem('doneRecipes', JSON.stringify([
      {
        id: '1',
        type: 'drink',
        nationality: '',
        category: 'test',
        alcoholicOrNot: 'Alcoholic',
        name: 'A1',
        image: 't.jpg',
      }, {
        id: '2',
        type: 'drink',
        nationality: '',
        category: 'test',
        alcoholicOrNot: '',
        name: 'test2',
        image: 't.jpg',
      }]));
    const { getByTestId } = render(<BrowserRouter><DoneRecipes /></BrowserRouter>);
    expect(getByTestId('0-horizontal-top-text')).toHaveTextContent('Alcoholic');
    expect(getByTestId('1-horizontal-top-text')).toHaveTextContent('Non-Alcoholic');
  });
});
