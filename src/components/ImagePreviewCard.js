import React from 'react';
import { ImageBackground, StyleSheet } from 'react-native';

const ImagePreviewCard = ({ uri, id }) => {
  if (!uri) return null;
  return (
    <ImageBackground
      key={id}
      source={{ uri }}
      style={styles.image}
    >
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  image: {
    height: 100,
    width: 100,
    margin: 5,
    marginTop: 20,
    alignSelf: 'center',
    justifyContent: 'flex-end',
  },
  removeButton: {
    alignItems: 'center',
    padding: 5,
    backgroundColor: 'rgba(36, 195, 139, 1)',
  },
});

export default ImagePreviewCard; 