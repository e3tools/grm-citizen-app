import { colors } from '../../../utils/colors'
import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  containerView: {
    flex: 1,
    paddingTop: 10,
  },
  errorText: {
    marginTop: 5,
    color: '#DC2626',
    fontSize: 12,
  },
  stepTitle: {
    fontSize: 25,
    fontWeight: 'bold',
  },
  loginFormTextInput: {
    borderRadius: 10,
    backgroundColor: 'white',
    fontSize: 14,
    color: '#707070',
    paddingVertical: 10,
    height: 40,
    borderColor: colors.lightgray,
    borderWidth: 1,
  },
  loginFormTextIcon: {
    marginTop: 27,
  },
  caseDetailFormTextInput: {
    borderRadius: 10,
    backgroundColor: 'white',
    fontSize: 14,
    color: '#707070',
    borderColor: colors.lightgray,
    borderWidth: 1,
  },
  caseDetailFormTextIcon: {
    marginTop: 27,
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 15,
    fontWeight: 'bold',
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputSubLabel: {
    paddingBottom: 10,
  },
  textHint: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 9,
    fontWeight: 'bold',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'left',
    color: '#707070',
  },
  hintContainer: {
    alignItems: 'center',
  },
  formContainer: {},
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

  fieldContainer: { marginBottom: 16 },
  fieldPlaceholderText: {
    fontWeight: '500',
    color: colors.secondary,
  },
  addOtherFilesLabel: {
    fontSize: 16,
    color: colors.darkGrey,
    marginBottom: 8,
    fontWeight: 'bold',
  },
})
