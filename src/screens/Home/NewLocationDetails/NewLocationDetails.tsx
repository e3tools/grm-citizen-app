import Dropdown from '@/src/components/Dropdown'
import Stepper from '@/src/components/Stepper'
import { useColorScheme } from '@/src/hooks/use-color-scheme'
import { useLocationDetails } from '@/src/hooks/useLocationDetails'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import React, { useEffect, useRef } from 'react'
import { Controller, useForm } from 'react-hook-form'
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native'
import { Provider, TextInput } from 'react-native-paper'
import { useDispatch } from 'react-redux'
import CustomButton from '../../../components/CustomButton'
import { i18n } from '../../../translations/i18n'
import { colors } from '../../../utils/colors'
import MESSAGES from '../../../utils/formErrorMessages'
import globalStyles from '../../../utils/globalStyles'
import {
  getEncryptedData,
  removeEncryptedValue,
  storeEncryptedData,
} from '../../../utils/storageManager'
import styles from '../NewLocationDetails/NewLocationDetails.style'

type LocationDetailsFormValues = {
  case_district: string
  detailed_location_description: string
  [field: string]: any
}

function NewLocationDetails({route}: {route?: any}) {
  const theme = useColorScheme() ?? 'light'
  const dispatch = useDispatch()
  const navigation = useNavigation<any>()
  const scrollViewRef = useRef<ScrollView | null>(null)
  const {
    areDistrictsLoading,
    areWardsLoading,
    areWardChildrenLoading,
    error,
    districts,
    wardLevels,
    fetchWards,
    fetchWardChildren,
    clearWardLevelsFrom,
  } = useLocationDetails()

  const {
    control,
    handleSubmit,
    watch,
    formState,
    getValues,
    setError,
    setValue,
    reset,
  } = useForm<LocationDetailsFormValues>({
    criteriaMode: 'all',
    defaultValues: {
      case_district: '',
      detailed_location_description: '',
    },
    mode: 'all',
  })

  const watchedDistrict = watch('case_district')

  const clearWardFieldsAfter = (level: number) => {
    const values = getValues()
    Object.keys(values)
      .filter(key => key.startsWith('case_ward_'))
      .forEach(key => {
        const index = Number(key.replace('case_ward_', ''))
        if (!Number.isNaN(index) && index > level) {
          setValue(key, '')
        }
      })
  }

  const loadSavedWardLevels = async (savedData: LocationDetailsFormValues) => {
    if (!savedData?.case_district) {
      return
    }

    await fetchWards(Number(savedData.case_district))

    let level = 0
    while (savedData[`case_ward_${level}`]) {
      const selectedId = Number(savedData[`case_ward_${level}`])
      if (Number.isNaN(selectedId)) {
        break
      }
      await fetchWardChildren(selectedId, level)
      level += 1
    }
  }

  // Load persisted form data when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      const loadFormData = async () => {
        const savedData = await getEncryptedData('locationFormData')
        if (savedData) {
          reset(savedData)
          await loadSavedWardLevels(savedData)
        }
      }
      loadFormData()
    }, [reset, fetchWards, fetchWardChildren]),
  )

  // Save form data whenever it changes
  useEffect(() => {
    const subscription = watch(value => {
      storeEncryptedData('locationFormData', value)
    })
    return () => subscription.unsubscribe()
  }, [watch])

  const Dropdowns = () => (
    <>
      <LocationDistrictDropdown />
      {wardLevels.map((options, index) => (
        <LocationWardDropdown key={index} level={index} options={options} />
      ))}
    </>
  )

  const LocationDistrictDropdown = () => {
    return (
      <Controller
        control={control}
        render={({field: {onChange, value}}) => (
          <View>
            <Text style={styles.inputLabel}>
              District <Text style={{color: colors.primary}}>*</Text>
            </Text>

            <Dropdown
              label={''}
              loading={areDistrictsLoading}
              options={districts as any}
              customOptionLabel={'hierarchical_name'}
              value={value}
              onSelect={(e: any) => {
                console.log(e)
                onChange(e)
                clearWardFieldsAfter(-1)
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

  const LocationWardDropdown = ({
    level,
    options,
  }: {
    level: number
    options: any[]
  }) => {
    const fieldName = `case_ward_${level}`
    return (
      <Controller
        control={control}
        render={({field: {onChange, value}}) => (
          <View>
            <Text style={styles.inputLabel}>
              {i18n.t('location_ward_dropdown')}{' '}
              <Text style={{color: colors.primary}}>*</Text>
            </Text>
            <Dropdown
              label={''}
              options={options as any}
              value={value}
              customOptionLabel="hierarchical_name"
              loading={level === 0 ? areWardsLoading : areWardChildrenLoading}
              onSelect={(e: any) => {
                onChange(e)
                clearWardFieldsAfter(level)
                fetchWardChildren(Number(e), level)
              }}
              placeholder={i18n.t('location_ward_dropdown_placeholder')}
              error={formState?.errors?.[fieldName]?.message}
              optional={false}
              enableSearch={false}
            />
          </View>
        )}
        name={fieldName}
        rules={{
          required: {
            value: false,
            message: MESSAGES.required,
          },
        }}
      />
    )
  }

  const DescriptionInput = () => (
    <Controller
      control={control}
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

  const onSubmit = (capturedData: LocationDetailsFormValues) => {
    console.log('Successfully captured data: ', capturedData)
    removeEncryptedValue('locationFormData')
    navigation.navigate('new_case_summary', {
      caseDetails: route?.params?.caseDetails ?? {},
      securityLevelDetails: route?.params?.securityLevelDetails ?? {},
      locationDetails: capturedData,
    })
  }

  const onInvalid = (e: any) => {
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

  console.log(error)

  return (
    <Provider>
      {error && <ErrorView message={error.message} />}
      {!error && (
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
              <View style={globalStyles.screenContainer as ViewStyle}>
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

export default NewLocationDetails
