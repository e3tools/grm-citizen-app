import { useNavigation } from '@react-navigation/native';
import EADLLogo from '../../../../assets/eadl-logo.svg';
import React, { useState } from 'react';
import { login } from '../../../store/ducks/authentication.duck';
import { Controller, useForm } from 'react-hook-form';
import {
  Modal,
  ScrollView,
  Text,
  View
} from 'react-native';
import {
  useBlurOnFulfill,
  useClearByFocusCell
} from 'react-native-confirmation-code-field';
import { ActivityIndicator, Button, Provider, TextInput } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { default as BigCheck } from '../../../../assets/big-check.svg';
import { default as SuccessLogo } from '../../../../assets/success_logo.svg';
import {fetchAuthCredentials } from '../../../services/authService';
import { i18n } from "../../../translations/i18n";
import { colors } from '../../../utils/colors';
import MESSAGES from '../../../utils/formErrorMessages';
import { passwordRegex } from '../../../utils/formUtils';
import styles from './Login.style';

const CELL_COUNT = 6;

function Login({ route }) {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [successModal, setSuccessModal] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [credentials, setCredentials] = React.useState();
  const [isPasswordSecure, setIsPasswordSecure] = useState(true);
  const {
      control,
      handleSubmit,
      errors,
      watch,
      formState,
      getValues,
      setError
  } = useForm({
    criteriaMode: 'all',
    defaultValues: {
      username: '',
      password: '',
    },
    mode: 'onBlur'
  });

  const [value, setValue] = React.useState('');
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({ value, setValue });

  const onLogin = async (data) => {
    setLoading(true);
    // handle code with backend, check if valid
    const response = await fetchAuthCredentials({ ...data });
    console.log(response)
    if (response.error) {
        setError('password', {
                type: "custom",
                message: response.error
        })
        setLoading(false);
        return;
    }
    setLoading(false);
    dispatch(login(response));
  };

  return (
    <Provider>
      {loading && (
        <View
          style={{
            zIndex: 20,
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <ActivityIndicator color={colors.primary} />
        </View>
      )}
      <Modal animationType="slide" visible={successModal}>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'space-evenly',
          }}
        >
          <BigCheck height={82} width={82} />
          <SuccessLogo />
          <Text
            style={{
              fontFamily: 'Poppins_700Bold',
              fontSize: 20,
              fontWeight: 'bold',
              fontStyle: 'normal',
              lineHeight: 21,
              letterSpacing: 0,
              textAlign: 'center',
              color: '#707070',
            }}
          >
            {i18n.t('account_create_success')}
          </Text>
        </View>
      </Modal>

      <ScrollView
        style={{
          backgroundColor: '#f8fafc',
          flex: 1,
          paddingBottom: 30,
          paddingHorizontal: 30,
        }}
        contentContainerStyle={{ flexGrow: 1, paddingTop: 20 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ marginBottom: 50, marginTop: 70, alignItems: 'center' }}>
          <EADLLogo height={90} width={180} />
          <Text
            style={{
              marginBottom: 15,
              fontFamily: 'Poppins_400Regular',
              fontSize: 19,
              fontWeight: 'bold',
              fontStyle: 'normal',
              lineHeight: 23,
              letterSpacing: 0,
              textAlign: 'center',
              color: '#707070',
            }}
          >
            {i18n.t('welcome_login')}
          </Text>
        </View>
            <View style={styles.loginScreenContainer}>
              <View style={styles.formContainer}>
                <View style={{ borderRadius: 10 }}>

                  {/* Username Field */}
                  <Controller
                    control={control}
                    formState={formState}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <View style={{ marginBottom: 16 }}>
                        <Text style={styles.inputLabel}>{i18n.t('username')}</Text>
                        <TextInput
                          theme={{
                            roundness: 10,
                            colors: {
                              primary: colors.primary,
                              placeholder: colors.lightgray,
                              text: colors.darkGrey,
                              onSurface: colors.darkGrey,
                              background: colors.white,
                            },
                          }}
                          mode="flat"
                          placeholder={i18n.t('enter_your_username')}
                          placeholderTextColor={colors.secondary}
                          underlineColor={colors.lightgray}
                          activeUnderlineColor={colors.primary}
                          selectionColor={colors.primary}
                          style={styles.loginFormTextInput}
                          onBlur={onBlur}
                          onChangeText={onChange}
                          value={value}
                        />
                        {formState.errors.username && <Text style={styles.errorText}>{formState.errors.username.message}</Text>}
                      </View>
                    )}
                    name="username"
                    rules={{
                      required: {
                        value: true,
                        message: MESSAGES.required,
                      },
                    }}
                    defaultValue=""
                  />

                  {/* Password Field */}
                  <Controller
                    control={control}
                    formState={formState}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <View style={{ marginBottom: 16 }}>
                        <Text style={styles.inputLabel}>{i18n.t('password')}</Text>
                        <TextInput
                          theme={{
                            roundness: 10,
                            colors: {
                              primary: colors.primary,
                              placeholder: colors.lightgray,
                              text: colors.darkGrey,
                              onSurface: colors.darkGrey,
                              background: colors.white,
                            },
                          }}
                          mode="flat"
                          placeholder={i18n.t('enter_your_password')}
                          placeholderTextColor={colors.secondary}
                          underlineColor={colors.lightgray}
                          activeUnderlineColor={colors.primary}
                          selectionColor={colors.primary}
                          style={styles.loginFormTextInput}
                          onBlur={onBlur}
                          onChangeText={onChange}
                          value={value}
                          secureTextEntry={isPasswordSecure}
                          left={
                            <TextInput.Icon
                              style={styles.loginFormTextIcon}
                              onPress={() => setIsPasswordSecure(!isPasswordSecure)}
                              color={colors.primary}
                              icon={isPasswordSecure ? 'eye-off-outline' : 'eye-outline'}/>
                          }
                        />
                        {formState.errors.password && (
                          <Text style={styles.errorText}>{formState.errors.password.message}</Text>
                        )}
                      </View>
                    )}
                    name="password"
                    rules={{
                      required: {
                        value: true,
                        message: MESSAGES.required,
                      },
                      pattern: {
                        value: passwordRegex,
                        message: MESSAGES.password,
                      },
                      minLength: {
                        value: 8,
                        message: MESSAGES.minLength(8),
                      },
                      maxLength: {
                        value: 16,
                        message: MESSAGES.maxLength(16),
                      },
                    }}
                    defaultValue=""
                  />
                </View>

              </View>
              {/* Move login button inside the scroll view and ensure it's not cut off */}
              <Button
                style={styles.loginButton}
                onPress={handleSubmit(onLogin)}
                color="white"
                labelStyle={{ color: 'white' }}
              >
                {i18n.t('login')}
              </Button>
            </View>
          {/* Moved loginLinkContainer outside KeyboardAvoidingView to avoid absolute positioning conflicts */}
          <View style={styles.loginLinkContainer}>
            <Text style={styles.loginText}>
              {i18n.t('dont_have_account')}
              <Text
                style={styles.loginLink}
                onPress={() => navigation.navigate('AuthStack')}
              >
                {` ${i18n.t('create_account')}`}
              </Text>
            </Text>
          </View>
      </ScrollView>
    </Provider>
  );
}

export default Login;
