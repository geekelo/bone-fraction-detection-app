import React, { useState, useEffect } from 'react';
import AWS from 'aws-sdk'; // Make sure you've installed and configured AWS SDK
// import YAML from 'yaml';
import Resource from './resource';
import Navbar from './navbar';

const MainPane = () => {
  const [selectedTab, setSelectedTab] = useState('all');
  const [resources, setResources] = useState([]);
  const [classNames, setClassNames] = useState([]);
  let allResource = [];

  const fetchResources = async () => {
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

      // Specify the folder path within the bucket
      const prefix = 'bone-fracture-detection/';

      // Fetch directories inside the selected tab
      let selectedFolders = [];
      if (selectedTab === 'all') {
        selectedFolders = ['valid', 'train', 'test'];
      } else {
        selectedFolders = [selectedTab];
      }

      const directoryPrefixes = await Promise.all(
        selectedFolders.map(async (folder) => {
          const folderPrefix = `${prefix}${folder}/`;
          return folderPrefix;
        }),
      ).then((directories) => directories.flat());

      // Fetch resources for each directory type
      const resourcesData = await Promise.all(
        directoryPrefixes.map(async (directory) => {
          // Fetch images, labels, and thumbnails for the current directory
          const [imagesData, labelsData, thumbnailsData] = await Promise.all([
            s3.listObjectsV2({ Prefix: `${directory}images/` }).promise(),
            s3.listObjectsV2({ Prefix: `${directory}labels/` }).promise(),
            s3.listObjectsV2({ Prefix: `${directory}thumbnails/` }).promise(),
          ]);
          // Extract keys from the fetched data
          const images = imagesData.Contents.map((image) => image.Key);
          const labels = labelsData.Contents.map((label) => label.Key);
          const thumbnails = thumbnailsData.Contents.map(
            (thumbnail) => thumbnail.Key,
          );

          // Return the resources data for the directory
          return {
            directory,
            images,
            labels,
            thumbnails,
          };
        }),
      );

      // Set the fetched resources in the state
      setResources(resourcesData);
    } catch (error) {
      console.error('Error fetching resources:', error);
    }
  };

  useEffect(() => {
    fetchResources();
  }, [selectedTab]); // Run fetchResources whenever selectedTab changes

  const handleTabChange = (tab) => {
    setSelectedTab(tab);
  };

  if (resources.length > 1) {
    const img = [...resources[0].images, resources[1].images, resources[2].images];
    const lab = [...resources[0].labels, resources[1].labels, resources[2].labels];
    const thumb = [...resources[0].thumbnails, resources[1].thumbnails, resources[2].thumbnails];

    const truncImg = img.slice(0, 199);
    const truncLab = lab.slice(0, 199);
    const truncThumb = thumb.slice(0, 199);
    allResource = [
      {
        images: truncImg,
        labels: truncLab,
        thumbnails: truncThumb,
      },
    ];
  } else if (resources.length === 1) {
    const truncImg = resources[0].images.slice(0, 199);
    const truncLab = resources[0].labels.slice(0, 199);
    const truncThumb = resources[0].thumbnails.slice(0, 199);
    allResource = [
      {
        images: truncImg,
        labels: truncLab,
        thumbnails: truncThumb,
      },
    ];
  }

  const handleIndexClick = (params) => {
    setClassNames(params);
  };

  return (
    <div className="main-cont">
      <div className="navbar">
        <Navbar handleIndexClick={handleIndexClick} />
      </div>
      {/* Tabs */}
      <div className="home">
        <div>
          <button type="submit" onClick={() => handleTabChange('all')}>
            All Groups
          </button>
          <button type="submit" onClick={() => handleTabChange('train')}>
            Train
          </button>
          <button type="submit" onClick={() => handleTabChange('valid')}>
            Valid
          </button>
          <button type="submit" onClick={() => handleTabChange('test')}>
            Test
          </button>
        </div>
        {/* Image Grid */}
        <div>
          {allResource.map((resource, i) => (
            <Resource key={0} index={i} resource={resource} classNames={classNames} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MainPane;
