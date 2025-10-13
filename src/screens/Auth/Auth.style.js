import { Dimensions } from 'react-native';
import { colors } from '../../utils/colors';

const { width  } = Dimensions.get("screen");
const ada = 1

export default {
  containerView: {
    flex: 1,
    paddingTop: 10,

  },
  loginScreenContainer: {
    flex: 1,
    justifyContent: "space-between"
  },
  errorText: {
    marginTop: 5,
    color: "red",
    fontSize: 12,
  },
  loginFormTextInput: {
    borderRadius: 10,
    backgroundColor: "white",
    fontSize: 14,
    color: "#707070",
    paddingVertical: 10,
    height: 40,
    borderColor: colors.lightgray,
    borderWidth: 1,
  },
  loginFormTextIcon: {
    marginTop: 27
  },
  inputLabel: {
    fontSize: 16,
    color: colors.darkGrey,
    marginBottom: 8,
    fontWeight: 'bold',
    borderColor: colors.darkGrey,
  },
  loginButton: {
    alignSelf: "center",
    width: width - 60,
    height: 47,
    borderWidth: 0,
    borderRadius: 10,
    backgroundColor: "#24c38b",
    fontSize: 16,
    fontFamily: 'Poppins_500Medium',
    marginTop: 20,
  },
  textHint: {
    fontFamily: "Poppins_400Regular",
    fontSize: 9,
    fontWeight: "bold",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "left",
    color: "#707070",
  },
  hintContainer: {
    alignItems: "center",
  },
  formContainer: {
  },
  loginLinkContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  loginText: {
    fontSize: 14,
    color: colors.darkGrey,
  },
  loginLink: {
    color: colors.primary,
    fontWeight: 'bold',
    marginLeft: 5,
  },
};
