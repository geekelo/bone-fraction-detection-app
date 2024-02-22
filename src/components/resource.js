import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Image from './image';

function Resource({ resource, classNames }) {
  const labelsAll = resource.labels;
  const thumbnailsAll = resource.thumbnails;
  const thumbnailsPerPage = 32;
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate the index of the first and last thumbnails to display based on the current page
  const indexOfLastThumbnail = currentPage * thumbnailsPerPage;
  const indexOfFirstThumbnail = indexOfLastThumbnail - thumbnailsPerPage;
  const currentThumbnails = thumbnailsAll.slice(indexOfFirstThumbnail, indexOfLastThumbnail);

  // Calculate the total number of pages
  const totalPages = Math.ceil(thumbnailsAll.length / thumbnailsPerPage);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="image-cont">
      {currentThumbnails.map((thumbnail, index) => (
        <Image
          key={0}
          index={indexOfFirstThumbnail + index}
          thumbnail={thumbnail}
          label={labelsAll[indexOfFirstThumbnail + index]} // Pass the corresponding label
          classNames={classNames}
        />
      ))}

      {/* Pagination */}
      <div>
        {Array.from({ length: totalPages }, (_, index) => (
          <button type="submit" key={0} onClick={() => handlePageChange(index + 1)}>
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

// Define prop types for the Resource component
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

// import React from 'react';
// import PropTypes from 'prop-types';
// import Image from './image';

// function Resource({ resource }) {
//   // {console.log(resource.thumbnails)}
//   const thumbnailsAll = resource.thumbnails;
//   const truncatedThumbnails = thumbnailsAll.slice(0, 199);
//   // console.log(thumbnailsAll);
//   return (
//     <div className="image-cont">
//       {
//         truncatedThumbnails.map((thumbnail, i) => (
//           <Image key={0} index={i} thumbnail={thumbnail} />))
//       }
//     </div>
//   );
// }

// // Define prop types for the Images component
// Resource.propTypes = {
//   resource: PropTypes.shape({
//     directory: PropTypes.string.isRequired,
//     images: PropTypes.arrayOf(PropTypes.string).isRequired,
//     labels: PropTypes.arrayOf(PropTypes.string).isRequired,
//     thumbnails: PropTypes.arrayOf(PropTypes.string).isRequired,
//     names: PropTypes.arrayOf(PropTypes.string).isRequired,
//   }).isRequired,
// };

// export default Resource;
