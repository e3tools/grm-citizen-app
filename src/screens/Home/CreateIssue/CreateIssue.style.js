import baseStyles from '../../Auth/Auth.style'
import {colors} from '../../../utils/colors'

const styles = {
  ...baseStyles,
  card: {
    backgroundColor: colors.white,
    borderRadius: 12,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    padding: 20,
  },
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  contentContainer: {
    paddingBottom: 30,
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333333',
    fontFamily: 'Poppins_700Bold',
    textAlign: 'left',
  },
  subtitle: {
    fontSize: 16,
    color: '#707070',
    marginTop: 14,
    marginBottom: 15,
    fontFamily: 'Poppins_400Regular',
    textAlign: 'left',
  },
  buttonContainer: {
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  sharedInfoContainer: {
    flex: 1,
    flexDirection: 'row',
    gap: 10,
    marginBottom: 5,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#707070',
    fontFamily: 'Poppins_400Regular',
  },
}

export default styles
