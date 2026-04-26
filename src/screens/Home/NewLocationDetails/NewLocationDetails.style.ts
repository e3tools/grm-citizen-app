import {StyleSheet} from 'react-native'
import {colors} from '../../../utils/colors'

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
  lineSeparator: {
    marginTop: 20,
    width: '100%',
    height: 1,
    backgroundColor: colors.lightgray,
  },
  keyboardAvoidingViewContentContainer: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  mainScrollView: {
    backgroundColor: '#f8fafc',
    flex: 1,
    paddingBottom: 60,
  },
  scrollableContentContainer: {
    flexGrow: 1,
    paddingTop: 5,
    paddingBottom: 20,
  },
  stepTitle: {
    fontSize: 25,
    fontWeight: 'bold',
  },
  formContainer: {},
  formTextInput: {
    borderRadius: 10,
    backgroundColor: 'white',
    fontSize: 14,
    color: '#707070',
    paddingVertical: 10,
    height: 40,
    borderColor: colors.lightgray,
    borderWidth: 1,
  },
  formTextIcon: {
    marginTop: 27,
  },
  locationDetailFormTextInput: {
    borderRadius: 10,
    backgroundColor: 'white',
    fontSize: 14,
    color: '#707070',
    borderColor: colors.lightgray,
    borderWidth: 1,
  },
  locationDetailFormTextIcon: {
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
  fieldContainer: {marginBottom: 16},
  fieldPlaceholderText: {
    fontWeight: '500',
    color: colors.secondary,
  },
  descriptionInputContent: {height: 160, paddingRight: 35},
  keyboardAvoidingView: {flex: 1, backgroundColor: '#f8fafc'},
})
