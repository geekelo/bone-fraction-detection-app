import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import AWS from 'aws-sdk';
import Image from './image';

function Resource({ resource, classNames }) {
  const [filteredClassIndexes, setFilteredClassIndexes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const thumbnailsPerPage = 32;

  useEffect(() => {
    const fetchClassIndexes = async () => {
      try {
        AWS.config.update({
          region: 'eu-central-1',
          credentials: new AWS.CognitoIdentityCredentials({
            IdentityPoolId: 'eu-central-1:31ebe2ab-fc9d-4a2c-96a9-9dee9a9db8b9',
          }),
        });

        const s3 = new AWS.S3({
          apiVersion: '2006-03-01',
          params: { Bucket: 'dataspan.frontend-home-assignment' },
        });

        const extractedIndexes = await Promise.all(resource.labels.map(async (label, index) => {
          const labelContent = await s3.getObject({ Bucket: 'dataspan.frontend-home-assignment', Key: label }).promise();
          const labelData = labelContent.Body.toString('utf-8');
          const [classIndex] = labelData.trim().split(' ').map(parseFloat);
          return { classIndex, labelIndex: index };
        }));

        // Filter the class indexes based on classNames
        const filteredIndexes = extractedIndexes
          .filter(({ classIndex }) => classNames.length === 0 || classNames.includes(classIndex));
        setFilteredClassIndexes(filteredIndexes);
      } catch (error) {
        console.error('Error fetching class indexes:', error);
      }
    };

    fetchClassIndexes();
  }, [resource.labels, classNames]);

  // Calculate the index of the first and last thumbnails to display based on the current page
  const indexOfLastThumbnail = currentPage * thumbnailsPerPage;
  const indexOfFirstThumbnail = indexOfLastThumbnail - thumbnailsPerPage;
  const currentThumbnails = filteredClassIndexes.slice(indexOfFirstThumbnail, indexOfLastThumbnail);

  // Calculate the total number of pages
  const totalPages = Math.ceil(filteredClassIndexes.length / thumbnailsPerPage);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="image-cont">
      {currentThumbnails.map(({ classIndex, labelIndex }) => (
        <Image
          key={labelIndex} // Use labelIndex as the key
          thumbnail={resource.thumbnails[labelIndex]}
          // Pass thumbnail corresponding to the original index
          classIndex={classIndex} // Pass the class index
        />
      ))}

      {/* Pagination */}
      <div>
        {Array.from({ length: totalPages }, (_, index) => (
          <button type="button" key={index} onClick={() => handlePageChange(index + 1)}>
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
  classNames: PropTypes.arrayOf(PropTypes.number).isRequired,
};

export default Resource;

//
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
