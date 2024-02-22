import React, { useState, useEffect } from 'react';
import AWS from 'aws-sdk';
import YAML from 'js-yaml'; // Import YAML parser library

function Navbar() {
  const [classNames, setClassNames] = useState([]);

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
        const { names } = YAML.safeLoad(yamlData); // Use YAML.safeLoad to parse YAML content
        setClassNames(names);
      } catch (error) {
        console.error('Error fetching class names:', error);
      }
    };

    fetchClassNames();
  }, []);

  return (
    <div>
      {/* Render the fetched class names */}
      {classNames.map((className, index) => (
        <div key={index}>{className}</div>
      ))}
    </div>
  );
}

export default Navbar;
