import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
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
  test('Verificar se o butão de perfil está funcionndo corretamente', async () => {
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
  test('Verificar se o butão de search está funcionndo corretamente', async () => {
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
