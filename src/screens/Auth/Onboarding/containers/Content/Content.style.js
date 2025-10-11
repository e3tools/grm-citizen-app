const { StyleSheet } = require("react-native");

export const styles = (colors) =>
  StyleSheet.create({
    content: {
      flex: 1,
      alignItems: "center",
      justifyContent: "space-around",
      paddingBottom: 50,
      backgroundColor: "#F8FAFC",
    },
    button: {
      marginHorizontal: 10,
      backgroundColor: '#26C18B'
    },
  });
