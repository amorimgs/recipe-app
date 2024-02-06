import { Link } from 'react-router-dom';
import mealIcon from '../../images/mealIcon.svg';
import drinkIcon from '../../images/drinkIcon.svg';
import styles from './Footer.module.css';

function Footer() {
  const footerStyle: React.CSSProperties = {
    position: 'fixed',
    bottom: '0px',
  };

  return (
    <footer className={ styles.footer } data-testid="footer" style={ footerStyle }>
      <Link to="/drinks">
        <img
          data-testid="drinks-bottom-btn"
          src={ drinkIcon }
          alt="DrinkIcon"
        />
      </Link>

      <Link to="/meals">
        <img
          data-testid="meals-bottom-btn"
          src={ mealIcon }
          alt="MealIcon"
        />
      </Link>

    </footer>
  );
}

export default Footer;
