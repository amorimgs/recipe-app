import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css';
import logoRecipeApp from '../../images/logoRecipesApp.svg';
import tomate from '../../images/tomate.svg';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  const navigate = useNavigate();

  const handleEmailChange = (event: any) => {
    const newEmail = event.target.value;
    setEmail(newEmail);
    validateForm(newEmail, password);
  };

  const handlePasswordChange = (event: any) => {
    const newPassword = event.target.value;
    setPassword(newPassword);
    validateForm(email, newPassword);
  };

  const validateForm = (inputEmail: string, inputPassword:string) => {
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inputEmail);
    const isPasswordValid = inputPassword.length > 6;
    setIsFormValid(isEmailValid && isPasswordValid);
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();

    if (isFormValid) {
      localStorage.setItem('user', JSON.stringify({ email }));
      console.log('Formulário enviado');

      navigate('/meals');
    }
  };

  return (
    <div className={ styles.container }>
      <div className={ styles.containerLogo }>
        <img className={ styles.logo } src={ logoRecipeApp } alt="Logo" />
        <img className={ styles.tomate } src={ tomate } alt="Logo" />
      </div>
      <h1 className={ styles.title }>Login</h1>
      <form className={ styles.form } onSubmit={ handleSubmit }>
        <label className={ styles.label }>
          E-mail:
          <input
            className={ styles.input }
            type="email"
            data-testid="email-input"
            placeholder="Digite seu e-mail"
            value={ email }
            onChange={ handleEmailChange }
          />
        </label>
        <label className={ styles.label }>
          Senha:
          <input
            className={ styles.input }
            type="password"
            data-testid="password-input"
            placeholder="Digite sua senha"
            value={ password }
            onChange={ handlePasswordChange }
          />
        </label>
        <button
          className={ styles.btn }
          data-testid="login-submit-btn"
          type="submit"
          disabled={ !isFormValid }
        >
          Enter
        </button>
      </form>
    </div>
  );
}

export default Login;
