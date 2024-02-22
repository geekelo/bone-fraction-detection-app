import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import AWS from 'aws-sdk';

function Image({
  thumbnail,
  label,
  classNames,
}) {
  console.log(classNames);
  const [classIndex, setClassIndex] = useState(null);
  const imageNames = [
    'Elbow positive',
    'Fingers positive',
    'Forearm fracture',
    'Humerus fracture',
    'Humerus',
    'Shoulder fracture',
    'Wrist positive',
  ];

  useEffect(() => {
    const fetchClassIndex = async () => {
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

        const labelContent = await s3.getObject({ Bucket: 'dataspan.frontend-home-assignment', Key: label }).promise();
        const labelData = labelContent.Body.toString('utf-8');

        const [classIdx] = labelData.trim().split(' ').map(parseFloat);
        setClassIndex(classIdx);
      } catch (error) {
        console.error('Error fetching class index:', error);
      }
    };

    fetchClassIndex();
  }, [label]);

  const bucketName = 'dataspan.frontend-home-assignment';
  const imageKey = thumbnail;
  const region = 'eu-central-1';
  const s3Endpoint = `https://s3.${region}.amazonaws.com`;
  const imageUrl = `${s3Endpoint}/${bucketName}/${encodeURIComponent(imageKey)}`;

  const isValidIndex = classNames.length > 0 && classNames.includes(classIndex);
  if (isValidIndex) {
    return (
      <div className="image">
        <img src={imageUrl} alt="dataImage" width="100" />
        <p className="annotation">{imageNames[classIndex]}</p>
      </div>
    );
  }
  return (
    <div className="image">
      <img src={imageUrl} alt="dataImage" width="100" />
      <p className="annotation">{imageNames[classIndex]}</p>
    </div>
  );
}

Image.propTypes = {
  thumbnail: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  classNames: PropTypes.arrayOf(PropTypes.number).isRequired,
};

export default Image;
