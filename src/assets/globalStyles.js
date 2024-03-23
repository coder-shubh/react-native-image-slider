const globalStyles = (StyleSheet) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    scrollContainer: {
      height: 300,
      alignItems: "center",
      justifyContent: "center",
    },
    card: {
      flex: 1,
      marginVertical: 4,
      marginHorizontal: 16,
      borderRadius: 5,
      overflow: "hidden",
      alignItems: "center",
      justifyContent: "center",
    },
    textContainer: {
      backgroundColor: "rgba(0,0,0, 0.7)",
      paddingHorizontal: 24,
      paddingVertical: 8,
      borderRadius: 5,
    },
    infoText: {
      color: "white",
      fontSize: 16,
      fontWeight: "bold",
    },
    normalDot: {
      height: 8,
      borderRadius: 4,
      marginHorizontal: 4,
    },
    indicatorContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },
    navigationContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingHorizontal: 20,
      position: "absolute",
      width: "100%",
      bottom: "53%",
    },
    navigationText: {
      color: "blue",
      fontSize: 16,
    },
    closeIcon: {
      width: "100%",
      height: "100%",
      color: "#E3E3E3",
    },
  });
};
export default globalStyles;
