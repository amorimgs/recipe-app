import React from 'react';
import ShareIcon from '../../images/shareIcon.svg';
import styles from './share.module.css';

function Share({ idRecipe, path, test }: any) {
  const [copy, setCopy] = React.useState<boolean>(false);
  const url = `${window.location.origin}/${path}s/${idRecipe}`;
  return (
    <>
      <button
        className={ styles.btn }
        onClick={ () => {
          navigator.clipboard.writeText(url);
          setCopy(true);
        } }
      >
        <img data-testid={ test || 'share-btn' } src={ ShareIcon } alt="ShareIcon" />
      </button>
      {copy && <h2>Link copied!</h2>}
    </>
  );
}

export default Share;
