import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
    <div>
      <h1>Login</h1>
      <form onSubmit={ handleSubmit }>
        <label>
          E-mail:
          <input
            type="email"
            data-testid="email-input"
            placeholder="Digite seu e-mail"
            value={ email }
            onChange={ handleEmailChange }
          />
        </label>
        <label>
          Senha:
          <input
            type="password"
            data-testid="password-input"
            placeholder="Digite sua senha"
            value={ password }
            onChange={ handlePasswordChange }
          />
        </label>
        <button
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
