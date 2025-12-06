import baseStyles from '../../Auth/Auth.style';

const styles = {
  ...baseStyles,
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  contentContainer: {
    paddingBottom: 30,
    paddingHorizontal: 30,
  },
  formContainer: {
    marginTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
    fontFamily: 'Poppins_700Bold',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#707070',
    marginBottom: 32,
    fontFamily: 'Poppins_400Regular',
    textAlign: 'center',
  },
  buttonContainer: {
    marginTop: 24,
    gap: 12,
    alignItems: 'center'
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#707070',
    fontFamily: 'Poppins_400Regular',
  },
};

export default styles;

