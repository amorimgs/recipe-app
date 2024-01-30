import React from 'react';
import ShareIcon from '../../images/shareIcon.svg';

function Share() {
  const [copy, setCopy] = React.useState<boolean>(false);

  return (
    <>
      <button
        onClick={ () => {
          navigator.clipboard.writeText(window.location.href);
          setCopy(true);
        } }
      >
        <img data-testid="share-btn" src={ ShareIcon } alt="ShareIcon" />
      </button>
      {copy && <h2>Link copied!</h2>}
    </>
  );
}

export default Share;
