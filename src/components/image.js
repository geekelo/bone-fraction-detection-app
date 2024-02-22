import React from 'react';
import PropTypes from 'prop-types';

function Image({ thumbnail }) {
  // Destructure href from s3.endpoint
  const bucketName = 'dataspan.frontend-home-assignment'; // Replace with your bucket name
  const imageKey = thumbnail; // Replace with the key of your image
  const region = 'eu-central-1'; // Replace with your AWS region
  const s3Endpoint = `https://s3.${region}.amazonaws.com`;
  const imageUrl = `${s3Endpoint}/${bucketName}/${encodeURIComponent(imageKey)}`;
  console.log(imageUrl);

  return (
    <div className="image">
      <img src={imageUrl} alt="dataImage" width="100" />
    </div>
  );
}

Image.propTypes = {
  thumbnail: PropTypes.string.isRequired,
};

export default Image;
