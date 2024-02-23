import React from 'react';
import PropTypes from 'prop-types';

function Image({ thumbnail, classIndex }) {
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

  return (
    <div className="image">
      <img src={imageUrl} alt="dataImage" width="100" aria-label={imageNames[classIndex]} />
      <p className="annotation">{imageNames[classIndex]}</p>
    </div>
  );
}

Image.propTypes = {
  thumbnail: PropTypes.string.isRequired,
  classIndex: PropTypes.number.isRequired,
};

export default Image;
