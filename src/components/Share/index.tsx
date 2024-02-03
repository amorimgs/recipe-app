import React from 'react';
import ShareIcon from '../../images/shareIcon.svg';

function Share({ idRecipe, path, test }: any) {
  const [copy, setCopy] = React.useState<boolean>(false);
  const url = `${window.location.origin}/${path}s/${idRecipe}`;
  return (
    <>
      <button
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
