import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types'; // Import PropTypes
import AWS from 'aws-sdk';
import YAML from 'js-yaml'; // Import YAML parser library

function Navbar({ handleIndexClick }) {
  const [classNames, setClassNames] = useState([]);
  const [selectedIndexes, setSelectedIndexes] = useState([]);

  useEffect(() => {
    const fetchClassNames = async () => {
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

        const yamlContent = await s3.getObject({ Bucket: 'dataspan.frontend-home-assignment', Key: 'bone-fracture-detection/data.yaml' }).promise();
        const yamlData = yamlContent.Body.toString('utf-8');
        const parsedYaml = YAML.load(yamlData);

        if (parsedYaml.names) {
          setClassNames(parsedYaml.names);
        } else {
          console.error('No class names found in YAML data.');
        }
      } catch (error) {
        console.error('Error fetching class names:', error);
      }
    };

    fetchClassNames();
  }, []);

  const handleCheckboxChange = (index) => {
    const updatedIndexes = [...selectedIndexes];
    const currentIndex = updatedIndexes.indexOf(index);
    if (currentIndex === -1) {
      updatedIndexes.push(index);
    } else {
      updatedIndexes.splice(currentIndex, 1);
    }
    setSelectedIndexes(updatedIndexes);
    handleIndexClick(updatedIndexes);
  };

  return (
    <div>
      {/* Render the fetched class names as checkboxes */}
      {classNames.map((className, index) => (
        <div key={index}>
          <input
            type="checkbox"
            id={`class-${index}`}
            checked={selectedIndexes.includes(index)}
            onChange={() => handleCheckboxChange(index)}
          />
          <label htmlFor={`class-${index}`}>{className}</label>
        </div>
      ))}
    </div>
  );
}

// Add prop validation for handleIndexClick
Navbar.propTypes = {
  handleIndexClick: PropTypes.func.isRequired,
};

export default Navbar;
