import React from 'react';
import PropTypes from 'prop-types';
import Image from './image';

function Resource({ resource }) {
  // {console.log(resource.thumbnails)}
  const thumbnailsAll = resource.thumbnails;
  const truncatedThumbnails = thumbnailsAll.slice(0, 199);
  // console.log(thumbnailsAll);
  return (
    <div className="image-cont">
      {
        truncatedThumbnails.map((thumbnail, i) => (
          <Image key={0} index={i} thumbnail={thumbnail} />))
      }
    </div>
  );
}

// Define prop types for the Images component
Resource.propTypes = {
  resource: PropTypes.shape({
    directory: PropTypes.string.isRequired,
    images: PropTypes.arrayOf(PropTypes.string).isRequired,
    labels: PropTypes.arrayOf(PropTypes.string).isRequired,
    thumbnails: PropTypes.arrayOf(PropTypes.string).isRequired,
    names: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
};

export default Resource;
