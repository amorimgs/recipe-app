import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import Profile from '../pages/Profile';
import App from '../App';

const renderWithRouter = (ui: JSX.Element, { route = '/' } = {}) => {
  window.history.pushState({}, '', route);

  return {
    user: userEvent.setup(),
    ...render(ui, { wrapper: BrowserRouter }),
  };
};

const email = 'email-input';
const password = 'password-input';
const submitBtn = 'login-submit-btn';

describe('Testar a tela inicial de login', () => {
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
  const esb = 'exec-search-btn';
  test('Verificar inputs searchBar meals', async () => {
    const mockValue = {
      meals: null,
    };

    const fetchResovedValue = {
      json: async () => mockValue,
    } as Response;
    vi.spyOn(global, 'fetch')
      .mockResolvedValue(fetchResovedValue);

    const { user } = renderWithRouter(<App />, { route: '/meals' });
    const searchBbtn = screen.getByRole('button', {
      name: /searchicon/i,
    });
    await user.click(searchBbtn);

    const execSearchBTN = screen.getByTestId(esb);
    const ingredientInput = screen.findByRole('radio', {
      name: /ingredient/i,
    });
    await user.click(await ingredientInput);
    await user.click(execSearchBTN);
    const nameInput = screen.findByRole('radio', {
      name: /name/i,
    });
    await user.click(await nameInput);
    await user.click(execSearchBTN);
    const fistLeterInput = screen.findByRole('radio', {
      name: /first letter/i,
    });
    await user.click(await fistLeterInput);
    await user.click(execSearchBTN);
  });

  test('Verificar inputs searchBar drinks', async () => {
    const mockValue = {
      meals: null,
    };

    const fetchResovedValue = {
      json: async () => mockValue,
    } as Response;
    vi.spyOn(global, 'fetch')
      .mockResolvedValue(fetchResovedValue);

    const { user } = renderWithRouter(<App />, { route: '/drinks' });
    const searchBbtn = screen.getByRole('button', {
      name: /searchicon/i,
    });
    await user.click(searchBbtn);

    const execSearchBTN = screen.getByTestId(esb);
    const ingredientInput = screen.findByRole('radio', {
      name: /ingredient/i,
    });
    await user.click(await ingredientInput);
    await user.click(execSearchBTN);
    const nameInput = screen.findByRole('radio', {
      name: /name/i,
    });
    await user.click(await nameInput);
    await user.click(execSearchBTN);
    const fistLeterInput = screen.findByRole('radio', {
      name: /first letter/i,
    });
    await user.click(await fistLeterInput);
    await user.click(execSearchBTN);
  });

  test('Verificar redicionamentos searchBar', async () => {
    const mockValue01 = {
      meals: [{
        idMeal: '52771',
      }],
    };

    const fetchResovedValue = {
      json: async () => mockValue01,
    } as Response;
    vi.spyOn(global, 'fetch')
      .mockResolvedValue(fetchResovedValue)
      .mockResolvedValue(fetchResovedValue);

    const { user } = renderWithRouter(<App />, { route: '/meals' });
    const searchIcon = screen.getByRole('button', {
      name: /searchicon/i,
    });
    await user.click(searchIcon);

    const execSearchBTN = screen.getByTestId(esb);
    const inputText = screen.getByTestId('search-input');
    const fistLeterInput = screen.findByRole('radio', {
      name: /first letter/i,
    });
    const nameInput = screen.findByRole('radio', {
      name: /name/i,
    });

    await user.click(await fistLeterInput);
    await user.type(inputText, 'a');
    await user.click(execSearchBTN);

    await user.type(inputText, 'Arrabiata');
    await user.click(await nameInput);
    const URL = window.location.pathname;
    expect(URL).toEqual('/meals/52771');
  });

  test('Verificar redicionamentos searchBar drinks', async () => {
    const mockValue02 = {
      drinks: [{
        idDrink: '178319',
      }],
    };

    const fetchResovedValue = {
      json: async () => mockValue02,
    } as Response;
    vi.spyOn(global, 'fetch')
      .mockResolvedValue(fetchResovedValue)
      .mockResolvedValue(fetchResovedValue);

    const { user } = renderWithRouter(<App />, { route: '/drinks' });
    const searchIcon = screen.getByRole('button', {
      name: /searchicon/i,
    });
    await user.click(searchIcon);

    const execSearchBTN = screen.getByTestId(esb);
    const inputText = screen.getByTestId('search-input');
    const fistLeterInput = screen.findByRole('radio', {
      name: /first letter/i,
    });
    const nameInput = screen.findByRole('radio', {
      name: /name/i,
    });

    await user.click(await fistLeterInput);
    await user.type(inputText, 'a');
    await user.click(execSearchBTN);

    await user.type(inputText, 'Arrabiata');
    await user.click(await nameInput);

    const URL = window.location.pathname;
    expect(URL).toEqual('/drinks/178319');
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
    // Limpa o localStorage antes de cada teste
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
    // Verifique se a URL mudou para '/done-recipes'
  });

  test('navigates to Favorite Recipes page when Favorite Recipes button is clicked', () => {
    const { getByTestId } = render(<MemoryRouter initialEntries={ ['/'] }><Profile /></MemoryRouter>);
    const favoriteRecipesButton = getByTestId('profile-favorite-btn');
    fireEvent.click(favoriteRecipesButton);
    // Verifique se a URL mudou para '/favorite-recipes'
  });

  test('navigates to Home page when Logout button is clicked', () => {
    const { getByRole } = render(<MemoryRouter initialEntries={ ['/'] }><Profile /></MemoryRouter>);
    const logoutButton = getByRole('button', { name: /logout/i });
    fireEvent.click(logoutButton);
    // Verifique se a URL mudou para '/'
  });
});
