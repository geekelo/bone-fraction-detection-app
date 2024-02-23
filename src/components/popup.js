import React from 'react';
import PropTypes from 'prop-types';

function Popup({
  image,
  classIndex,
  closePopup,
}) {
  const imageNames = [
    'Elbow positive',
    'Fingers positive',
    'Forearm fracture',
    'Humerus fracture',
    'Humerus',
    'Shoulder fracture',
    'Wrist positive',
  ];

  const bucketName = 'dataspan.frontend-home-assignment';
  const imageKey = image;
  const region = 'eu-central-1';
  const s3Endpoint = `https://s3.${region}.amazonaws.com`;
  const imageUrl = `${s3Endpoint}/${bucketName}/${encodeURIComponent(imageKey)}`;

  const handleClosePopup = () => {
    closePopup();
  };

  return (
    <div className="popup-section">
      <div className="popup">
        <button type="submit" className="closeBtn" onClick={handleClosePopup}> X </button>
        <div className="popup-content">
          <p>{image.split('/').pop()}</p>
          <p>Details:</p>
          <p className="annotation image-name">{classIndex}</p>
          <img src={imageUrl} className="pop-image" alt="dataImage" aria-label={imageNames[classIndex]} />
        </div>
      </div>
    </div>
  );
}

Popup.propTypes = {
  image: PropTypes.string.isRequired,
  classIndex: PropTypes.number.isRequired,
  closePopup: PropTypes.func.isRequired,
};

export default Popup;
