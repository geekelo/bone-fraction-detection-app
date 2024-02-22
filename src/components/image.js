import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import AWS from 'aws-sdk';

function Image({ thumbnail, label }) {
  const [annotations, setAnnotations] = useState([]);

  useEffect(() => {
    // Fetch label data from AWS S3
    const fetchLabels = async () => {
      try {
        // Configure AWS credentials and region
        AWS.config.update({
          region: 'eu-central-1', // Update with your AWS region
          credentials: new AWS.CognitoIdentityCredentials({
            IdentityPoolId: 'eu-central-1:31ebe2ab-fc9d-4a2c-96a9-9dee9a9db8b9', // Update with your Identity Pool ID
          }),
        });

        const s3 = new AWS.S3({
          apiVersion: '2006-03-01',
          params: { Bucket: 'dataspan.frontend-home-assignment' }, // Update with your bucket name
        });

        // Fetch label file content
        const labelContent = await s3.getObject({ Bucket: 'dataspan.frontend-home-assignment', Key: label }).promise();
        const labelData = labelContent.Body.toString('utf-8');

        // Parse label data
        const annotations = labelData.split('\n').map((line) => {
          const [classIndex, ...bbox] = line.trim().split(' ').map(parseFloat);
          return { classIndex, bbox };
        });

        // Set annotations state
        setAnnotations(annotations);
      } catch (error) {
        console.error('Error fetching labels:', error);
      }
    };

    fetchLabels();
  }, [label]);

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
      <div className="annotation">
        <h4>Annotations:</h4>
        <ul>
          {annotations.map((annotation) => (
            <li key={0}>
              Class Index:
              {annotation.classIndex}
              , Bounding Box:
              {annotation.bbox.join(', ')}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

Image.propTypes = {
  thumbnail: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
};

export default Image;
