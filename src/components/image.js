import React from 'react';
import PropTypes from 'prop-types';

function Image({
  id,
  thumbnail,
  classIndex,
  handleClickedThumbnail,
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
  const imageKey = thumbnail;
  const region = 'eu-central-1';
  const s3Endpoint = `https://s3.${region}.amazonaws.com`;
  const imageUrl = `${s3Endpoint}/${bucketName}/${encodeURIComponent(imageKey)}`;

  const handleClick = () => {
    handleClickedThumbnail(id); // Pass up the key when the image is clicked
  };

  return (
    <div className="image">
      <button type="submit" onClick={handleClick}>
        <img src={imageUrl} alt="dataImage" width="100" aria-label={imageNames[classIndex]} />
      </button>
      <p className="annotation">{imageNames[classIndex]}</p>
    </div>
  );
}

Image.propTypes = {
  id: PropTypes.number.isRequired, // Key prop renamed to id
  thumbnail: PropTypes.string.isRequired,
  classIndex: PropTypes.number.isRequired,
  handleClickedThumbnail: PropTypes.func.isRequired, // Function to handle click event
};

export default Image;
