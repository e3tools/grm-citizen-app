const { StyleSheet } = require("react-native");

export const styles = (colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "white",
    },
    statusTag: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
      minWidth: 80,
      width: 100,
      alignItems: 'center',
    },
    statusText: {
      fontSize: 15,
      fontWeight: '600',
    },
  });
