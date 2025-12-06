import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
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
import { register } from '../../../services/authService';
import { signUp } from '../../../store/ducks/authentication.duck';
import { i18n } from "../../../translations/i18n";
import { colors } from '../../../utils/colors';
import MESSAGES from '../../../utils/formErrorMessages';
import { emailRegex, passwordRegex } from '../../../utils/formUtils';
import styles from './SignUp.style';

const CELL_COUNT = 6;

function SignUp({ route }) {
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
      first_name: '',
      last_name: '',
      username: '',
      email: '',
      phoneNumber: '',
      password: '',
      confirmPassword: '',
    },
    mode: 'onBlur'
  });

  const [value, setValue] = React.useState('');
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({ value, setValue });

  const onSignUp = async (data) => {
    setLoading(true);
    // handle code with backend, check if valid
    const response = await register({ ...data });
    if (response.errors) {
        Object.keys(response.errors).forEach(key => {
            setError(key, {
                type: "custom",
                message: (response.errors[key]).join(". ")
            })
        });
        setLoading(false);
        return;
    }
    setLoading(false);
    setSuccessModal(true);
    setTimeout(() => {
      setSuccessModal(false)
    }, 3000);

    dispatch(signUp(response.data, credentials));
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
        contentContainerStyle={{ flexGrow: 1, paddingTop: 20, paddingBottom: 20 }}
        keyboardShouldPersistTaps="handled"
      >
        
            <View style={styles.loginScreenContainer}>
              <View style={styles.formContainer}>
                <View style={{ borderRadius: 10 }}>

                  {/* First Name Field */}
                  <Controller
                    control={control}
                    formState={formState}
                    render={({ field: { onChange, onBlur, value } }) => {
                      return (
                        <View style={{ marginBottom: 16 }}>
                          <Text style={styles.inputLabel}>{i18n.t('first_name')}</Text>
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
                            placeholder={i18n.t('enter_your_full_name')}
                            placeholderTextColor={colors.secondary}
                            underlineColor={colors.lightgray}
                            activeUnderlineColor={colors.primary}
                            selectionColor={colors.primary}
                            style={styles.loginFormTextInput}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                          />
                        {formState.errors.first_name && <Text style={styles.errorText}>{formState.errors.first_name.message}</Text>}
                        </View>
                      );
                    }}
                    name="first_name"
                    rules={{
                      required: {
                        value: true,
                        message: MESSAGES.required,
                      },
                    }}
                    defaultValue=""
                  />

                  {/* Last Name Field */}
                  <Controller
                    control={control}
                    formState={formState}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <View style={{ marginBottom: 16 }}>
                        <Text style={styles.inputLabel}>{i18n.t('last_name')}</Text>
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
                          placeholder={i18n.t('enter_your_last_name')}
                          placeholderTextColor={colors.secondary}
                          underlineColor={colors.lightgray}
                          activeUnderlineColor={colors.primary}
                          selectionColor={colors.primary}
                          style={styles.loginFormTextInput}
                          onBlur={onBlur}
                          onChangeText={onChange}
                          value={value}
                        />
                        {formState.errors.last_name && <Text style={styles.errorText}>{formState.errors.last_name.message}</Text>}
                      </View>
                    )}
                    name="last_name"
                    rules={{
                      required: {
                        value: true,
                        message: MESSAGES.required,
                      },
                    }}
                    defaultValue=""
                  />

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

                  {/* Email Field (Optional) */}
                  <Controller
                    control={control}
                    formState={formState}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <View style={{ marginBottom: 16 }}>
                        <Text style={styles.inputLabel}>{i18n.t('email')} ({i18n.t('optional')})</Text>
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
                          placeholder={i18n.t('enter_your_email')}
                          placeholderTextColor={colors.secondary}
                          underlineColor={colors.lightgray}
                          activeUnderlineColor={colors.primary}
                          selectionColor={colors.primary}
                          style={styles.loginFormTextInput}
                          onBlur={onBlur}
                          onChangeText={onChange}
                          value={value}
                        />
                        {formState.errors.email && <Text style={styles.errorText}>{formState.errors.email.message}</Text>}
                      </View>
                    )}
                    name="email"
                    rules={{
                      pattern: {
                        value: emailRegex,
                        message: MESSAGES.email,
                      },
                    }}
                    defaultValue=""
                  />

                  {/* Phone Number Field */}
                  <Controller
                    control={control}
                    formState={formState}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <View style={{ marginBottom: 16 }}>
                        <Text style={styles.inputLabel}>{i18n.t('phone_number')}</Text>
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
                          placeholder={i18n.t('enter_your_phone_number')}
                          placeholderTextColor={colors.secondary}
                          underlineColor={colors.lightgray}
                          activeUnderlineColor={colors.primary}
                          selectionColor={colors.primary}
                          style={styles.loginFormTextInput}
                          onBlur={onBlur}
                          onChangeText={onChange}
                          value={value}
                          keyboardType="phone-pad"
                        />
                        {formState.errors.phoneNumber && <Text style={styles.errorText}>{formState.errors.phoneNumber.message}</Text>}
                      </View>
                    )}
                    name="phoneNumber"
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

                  {/* Confirm Password Field */}
                  <Controller
                    control={control}
                    formState={formState}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <View style={{ marginBottom: 16 }}>
                        <Text style={styles.inputLabel}>{i18n.t('confirm_password')}</Text>
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
                          placeholder={i18n.t('confirm_your_password')}
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
                              icon={isPasswordSecure ? 'eye-off-outline' : 'eye-outline'}
                              color={colors.primary}
                            />
                          }
                        />
                        {formState.errors.confirm_password && (
                          <Text style={styles.errorText}>{formState.errors.confirm_password.message}</Text>
                        )}
                      </View>
                    )}
                    name="confirm_password"
                    rules={{
                      required: {
                        value: true,
                        message: MESSAGES.required,
                      },
                      validate: (value) => value === watch('password') || MESSAGES.passwordMatch,
                    }}
                    defaultValue=""
                  />
                </View>

                <View style={styles.hintContainer}>
                  <Text style={styles.textHint}>{i18n.t('password_hint')}</Text>
                </View>
              </View>
              {/* Move login button inside the scroll view and ensure it's not cut off */}
              <Button
                style={styles.loginButton}
                onPress={handleSubmit(onSignUp)}
                color="white"
                labelStyle={{ color: 'white' }}
              >
                {i18n.t('create_account')}
              </Button>
            </View>
          {/* Moved loginLinkContainer outside KeyboardAvoidingView to avoid absolute positioning conflicts */}
          <View style={styles.loginLinkContainer}>
            <Text style={styles.loginText}>
              {i18n.t('already_have_account')}
              <Text
                style={styles.loginLink}
                onPress={() => navigation.navigate('LoginStack')}
              >
                {` ${i18n.t('login')}`}
              </Text>
            </Text>
          </View>
      </ScrollView>
    </Provider>
  );
}

export default SignUp;
