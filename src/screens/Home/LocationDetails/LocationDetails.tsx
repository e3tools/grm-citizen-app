import Dropdown from '@/src/components/Dropdown'
import Stepper from '@/src/components/Stepper'
import {useColorScheme} from '@/src/hooks/use-color-scheme'
import {useLocationDetails} from '@/src/hooks/useLocationDetails'
import {useNavigation} from '@react-navigation/native'
import {useFocusEffect} from '@react-navigation/native'
import React, {useEffect, useRef} from 'react'
import {Controller, useForm} from 'react-hook-form'
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import {ActivityIndicator, Provider, TextInput} from 'react-native-paper'
import {useDispatch} from 'react-redux'
import CustomButton from '../../../components/CustomButton'
import {i18n} from '../../../translations/i18n'
import {colors} from '../../../utils/colors'
import MESSAGES from '../../../utils/formErrorMessages'
import globalStyles from '../../../utils/globalStyles'
import {getEncryptedData, storeEncryptedData} from '../../../utils/storageManager'
import styles from '../LocationDetails/LocationDetails.style'

function LocationDetails({route}) {
  const theme = useColorScheme() ?? 'light'
  const dispatch = useDispatch()
  const navigation = useNavigation()
  const scrollViewRef = useRef<ScrollView | null>(null)
  const {isLoading, error, districts, wards, fetchWards} = useLocationDetails()

  const {control, handleSubmit, errors, watch, formState, getValues, setError, setValue, reset} =
    useForm({
      criteriaMode: 'all',
      defaultValues: {
        case_district: '',
        case_ward: '',
        detailed_location_description: '',
      },
      mode: 'all',
    })

  const watchedDistrict = watch('case_district')

  // Load persisted form data when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      const loadFormData = async () => {
        const savedData = await getEncryptedData('locationFormData')
        if (savedData) {
          reset(savedData)
          // If district is saved, fetch wards
          if (savedData.case_district) {
            fetchWards(savedData.case_district)
          }
        }
      }
      loadFormData()
    }, [reset, fetchWards])
  )

  // Save form data whenever it changes
  useEffect(() => {
    const subscription = watch((value) => {
      storeEncryptedData('locationFormData', value)
    })
    return () => subscription.unsubscribe()
  }, [watch])

  const Dropdowns = () => (
    <>
      <LocationDistrictDropdown />
      {watchedDistrict && <LocationWardDropdown />}
    </>
  )

  const LocationDistrictDropdown = () => {

    return (
      <Controller
        control={control}
        formState={formState}
        render={({field: {onChange, value}}) => (
          <View>
            <Text style={styles.inputLabel}>
              District <Text style={{color: colors.primary}}>*</Text>
            </Text>
            <Dropdown
              label={''}
              options={districts}
              value={value}
              onSelect={(e: any) => {
                console.log(e)
                onChange(e)
                setValue('case_ward', '')
                fetchWards(e)
              }}
              placeholder={i18n.t('select_location_district')}
              error={formState?.errors?.case_district?.message}
              optional={false}
            />
          </View>
        )}
        name="case_district"
        rules={{
          required: {
            value: true,
            message: MESSAGES.required,
          },
        }}
      />
    )
  }

  const LocationWardDropdown = () => (
    <Controller
      control={control}
      formState={formState}
      render={({field: {onChange, value}}) => (
        <View>
          <Text style={styles.inputLabel}>
            {i18n.t('location_ward_dropdown')}{' '}
            <Text style={{color: colors.primary}}>*</Text>
          </Text>
          <Dropdown
            label={''}
            options={wards}
            value={value}
            onSelect={onChange}
            placeholder={i18n.t('location_ward_dropdown_placeholder')}
            error={formState?.errors?.case_ward?.message}
            optional={false}
            enableSearch={false}
          />
        </View>
      )}
      name="case_ward"
      rules={{
        required: {
          value: true,
          message: MESSAGES.required,
        },
      }}
    />
  )

  const DescriptionInput = () => (
    <Controller
      control={control}
      formState={formState}
      render={({field: {onChange, onBlur, value}}) => (
        <View style={{marginTop: 16}}>
          <View style={styles.inputLabel}>
            <Text style={styles.inputLabel}>
              {i18n.t('location_description_title')}
            </Text>
          </View>
          <TextInput
            multiline={true}
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
            numberOfLines={6}
            placeholder={i18n.t('location_details_text_input_placeholder')}
            placeholderTextColor={colors.secondary}
            underlineColor={colors.lightgray}
            activeUnderlineColor={colors.primary}
            selectionColor={colors.primary}
            contentStyle={styles.descriptionInputContent}
            style={styles.locationDetailFormTextInput}
            onBlur={() => {
              onBlur()
            }}
            onChangeText={onChange}
            value={value}
          />
          {formState.errors.detailed_location_description && (
            <Text style={styles.errorText}>
              {formState.errors.detailed_location_description.message}
            </Text>
          )}
        </View>
      )}
      name="detailed_location_description"
      rules={{
        maxLength: 1000,
        required: {value: false, message: MESSAGES.required},
      }}
    />
  )

  const Separator = () => <View style={styles.lineSeparator} />

  const onSubmit = e => {
    console.log('Successfully captured data: ', e)
    navigation.navigate('location_details')
  }

  const onInvalid = e => {
    console.error('Invalid data. Reason: ', e)
  }

  const NextButton = () => (
    <View style={{marginHorizontal: 30}}>
      <CustomButton
        style={{width: '100%'}}
        borderRadius={24}
        backgroundColor={colors.primary}
        textColor="white"
        color="white"
        label={'Next'}
        iconName={undefined}
        onPress={handleSubmit(onSubmit, onInvalid)}
      />
    </View>
  )

  const ErrorSnackBar = ({message}: {message: string}) => {
    return (
      <View
        style={{
          backgroundColor: colors.darkGrey,
          flexDirection: 'row',
          maxHeight: 150,
          minHeight: 50,
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 24,
        }}>
        <View style={{flex: 1}}>
          <Text style={{color: 'white'}}>{message}</Text>
        </View>
        <TouchableOpacity onPress={() => {}}>
          <Text
            style={{
              color: colors.primary,
              fontWeight: 'bold',
              fontSize: 18,
            }}>
            Retry
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  const ErrorView = ({message}: {message: string}) => {
    return (
      <View
        style={{
          backgroundColor: colors.white,
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 24,
        }}>
        <View style={{alignItems: 'center', marginBottom: 50}}>
          <Text style={{color: colors.secondary}}>
            Oops, something went wrong.
          </Text>
          <Text style={{color: colors.secondary}}>Error Code: {message}</Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack()
          }}>
          <Text
            style={{
              color: colors.primary,
              fontWeight: 'bold',
              fontSize: 18,
            }}>
            Go back
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  const Loading = () => {
    return <ActivityIndicator style={{marginTop: 24}} color={colors.primary} />
  }

  return (
    <Provider>
      {isLoading && <Loading />}
      {error && <ErrorView message={error.message} />}
      {!isLoading && !error && (
        <>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'position'}
            style={styles.keyboardAvoidingView}
            contentContainerStyle={styles.keyboardAvoidingViewContentContainer}>
            <ScrollView
              ref={scrollViewRef}
              style={styles.mainScrollView}
              contentContainerStyle={styles.scrollableContentContainer}
              keyboardShouldPersistTaps="handled">
              <View style={globalStyles.screenContainer}>
                <View style={styles.formContainer}>
                  <View>
                    <Stepper currentStep={3} numberOfSteps={4} />
                    <View style={{paddingBottom: 30}}>
                      <Text style={styles.stepTitle}>
                        {i18n.t('case_details_step_3_title')}
                      </Text>
                      <Text>{i18n.t('case_details_step_3_subtitle')}</Text>
                    </View>
                    <Dropdowns />
                    <DescriptionInput />
                  </View>
                </View>
              </View>
              <Separator />
              <NextButton />
            </ScrollView>
          </KeyboardAvoidingView>
        </>
      )}
    </Provider>
  )
}

export default LocationDetails
