//CURRENTLY USING HARD CODED DATA

import { IconSymbol } from '@/components/ui/icon-symbol'
import { Colors } from '@/constants/theme'
import CheckboxCard from '@/src/components/CheckboxCard'
import Dropdown from '@/src/components/Dropdown'
import Stepper from '@/src/components/Stepper'
import { useColorScheme } from '@/src/hooks/use-color-scheme'
import RNDateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker'
import { useNavigation } from '@react-navigation/native'
import React, { useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { Provider, TextInput } from 'react-native-paper'
import { useDispatch } from 'react-redux'
import CustomButton from '../../../components/CustomButton'
import { i18n } from '../../../translations/i18n'
import { colors } from '../../../utils/colors'
import MESSAGES from '../../../utils/formErrorMessages'
import globalStyles from '../../../utils/globalStyles'
import styles from '../DetailsOfCase/DetailsOfCase.style'

function DetailsOfTheCase({ route }) {
  const theme = useColorScheme() ?? 'light'
  const dispatch = useDispatch()
  const navigation = useNavigation()
  const [successModal, setSuccessModal] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>()
  const [isDatePickerOpen, setIsDatePickerOpen] = useState<boolean>(false)
  const scrollViewRef = useRef<ScrollView | null>(null)
  const [attachments, setAttachments] = useState([
    { id: 1, name: 'r23r42csefs.jpg', size: 4354, path: '' },
    { id: 2, name: '3e2rfewvd.mp4', size: 43124324, path: '' },
    { id: 3, name: '4r32r3kmfsfs.jpg', size: 43124324, path: '' },
  ])

  const {
    control,
    handleSubmit,
    errors,
    watch,
    formState,
    getValues,
    setError,
  } = useForm({
    criteriaMode: 'all',
    defaultValues: {
      case_occurrence_date: '',
      case_occurrence_frequency: '',
      case_type: '',
      case_sub_type: '',
      case_category: '',
      case_sub_component: '',
      case_component: '',
      case_description: '',
    },
    mode: 'all',
  })

  const CalendarField = () => {
    return (
      <Controller
        control={control}
        formState={formState}
        render={({ field: { onChange, onBlur, value } }) => {
          return (
            <View style={styles.fieldContainer}>
              <Text style={styles.inputLabel}>When did it happen?</Text>
              <Text style={styles.inputSubLabel}>Date of Occurrence</Text>

              <View
                style={[
                  styles.loginFormTextInput,
                  {
                    height: 60,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingHorizontal: 15,
                  },
                ]}
              >
                <Text style={styles.fieldPlaceholderText}>
                  {selectedDate?.toLocaleDateString() ?? 'Select a Date'}
                </Text>
                <TouchableOpacity onPress={openCalendar}>
                  <IconSymbol
                    name="calendar"
                    size={18}
                    weight="medium"
                    color={
                      theme === 'light' ? Colors.light.icon : Colors.dark.icon
                    }
                  />
                </TouchableOpacity>
              </View>
              {isDatePickerOpen && (
                <RNDateTimePicker
                  value={selectedDate ?? new Date()}
                  mode="date"
                  onChange={(event, date) =>
                    onChangeDate(event, date, onChange)
                  }
                  maximumDate={new Date()}
                />
              )}
              {formState.errors.case_occurrence_date && (
                <Text style={styles.errorText}>
                  {formState.errors.case_occurrence_date.message}
                </Text>
              )}
            </View>
          )
        }}
        name="case_occurrence_date"
        rules={{
          required: {
            value: true,
            message: MESSAGES.required,
          },
        }}
      />
    )
  }

  const CaseFrequencySelector = () => (
    <Controller
      control={control}
      formState={formState}
      render={({ field: { onChange, value } }) => (
        <View style={styles.fieldContainer}>
          <CheckboxCard
            label={'One-time event'}
            currentValue={value}
            controllerValue={'one-time-event'}
            description={''}
            canUncheck={false}
            shadow={false}
            onValueUpdate={onChange}
          />
          <CheckboxCard
            label={'Recurring/Ongoing'}
            currentValue={value}
            controllerValue={'recurring'}
            description={''}
            canUncheck={false}
            shadow={false}
            onValueUpdate={onChange}
          />
          {formState.errors.case_occurrence_frequency && (
            <Text style={styles.errorText}>
              {formState.errors.case_occurrence_frequency.message}
            </Text>
          )}
        </View>
      )}
      name="case_occurrence_frequency"
      rules={{
        required: {
          value: true,
          message: MESSAGES.required,
        },
      }}
    />
  )

  const Dropdowns = () => (
    <>
      <CaseTypeDropdown />
      <CaseSubTypeDropdown />
      <CaseCategoryDropdown />
      <CaseComponentDropdown />
      <CaseSubComponentDropdown />
    </>
  )

  const CaseTypeDropdown = () => (
    <Controller
      control={control}
      formState={formState}
      render={({ field: { onChange, value } }) => (
        <View>
          <Text style={styles.inputLabel}>What is this issue about?</Text>
          <Text style={[styles.inputSubLabel]}>Case Type</Text>
          <Dropdown
            label={''}
            options={[
              { name: 'Case type 1', id: 1 },
              { name: 'Case type 2', id: 2 },
            ]}
            value={value}
            onSelect={onChange}
            placeholder={'Select Case Type'}
            error={formState?.errors?.case_type?.message}
            optional={false}
          />
        </View>
      )}
      name="case_type"
      rules={{
        required: {
          value: true,
          message: MESSAGES.required,
        },
      }}
    />
  )

  const CaseSubTypeDropdown = () => (
    <Controller
      control={control}
      formState={formState}
      render={({ field: { onChange, value } }) => (
        <View>
          <Text style={[styles.inputSubLabel]}>Subtype</Text>
          <Dropdown
            label={''}
            options={[
              { name: 'Case sub type 1', id: 1 },
              { name: 'Case sub type 2', id: 2 },
            ]}
            value={value}
            onSelect={onChange}
            placeholder={'Select Subtype'}
            error={formState?.errors?.case_sub_type?.message}
            optional={false}
          />
        </View>
      )}
      name="case_sub_type"
      rules={{
        required: {
          value: true,
          message: MESSAGES.required,
        },
      }}
    />
  )

  const CaseCategoryDropdown = () => (
    <Controller
      control={control}
      formState={formState}
      render={({ field: { onChange, value } }) => (
        <View>
          <Text style={[styles.inputSubLabel]}>Category</Text>
          <Dropdown
            label={''}
            options={[
              { name: 'Case category 1', id: 1 },
              { name: 'Case category 2', id: 2 },
            ]}
            value={value}
            onSelect={onChange}
            placeholder={'Select Category'}
            error={formState?.errors?.case_category?.message}
            optional={false}
          />
        </View>
      )}
      name="case_category"
      rules={{
        required: {
          value: true,
          message: MESSAGES.required,
        },
      }}
    />
  )

  const CaseComponentDropdown = () => (
    <Controller
      control={control}
      formState={formState}
      render={({ field: { onChange, value } }) => (
        <View>
          <Text style={[styles.inputSubLabel]}>Component</Text>
          <Dropdown
            label={''}
            options={[
              { name: 'Case component 1', id: 1 },
              { name: 'Case component 2', id: 2 },
            ]}
            value={value}
            onSelect={onChange}
            placeholder={'Select Component'}
            error={formState?.errors?.case_component?.message}
            optional={false}
          />
        </View>
      )}
      name="case_component"
      rules={{
        required: {
          value: true,
          message: MESSAGES.required,
        },
      }}
    />
  )

  const CaseSubComponentDropdown = () => (
    <Controller
      control={control}
      formState={formState}
      render={({ field: { onChange, value } }) => (
        <View>
          <Text style={[styles.inputSubLabel]}>Sub Component</Text>
          <Dropdown
            label={''}
            options={[
              { name: 'Case sub component 1', id: 1 },
              { name: 'Case sub component 2', id: 2 },
            ]}
            value={value}
            onSelect={onChange}
            placeholder={'Select Sub-component'}
            error={formState?.errors?.case_sub_component?.message}
            optional={false}
          />
        </View>
      )}
      name="case_sub_component"
      rules={{
        required: {
          value: true,
          message: MESSAGES.required,
        },
      }}
    />
  )

  const AddAttachments = () => (
    <View style={{ marginTop: 36, marginBottom: 38 }}>
      <View style={styles.inputLabel}>
        <Text style={styles.inputLabel}>{'Attach Supporting Evidence'}</Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          width: '100%',
          height: 120,
          justifyContent: 'space-between',
          marginBottom: 25,
        }}
      >
        <TouchableOpacity
          style={{
            borderStyle: 'dashed',
            borderRadius: 5,
            borderWidth: 2,
            borderColor: colors.lightgray,
            width: '46%',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <IconSymbol
            style={{ paddingBottom: 10 }}
            name="camera"
            color={colors.primary}
          />
          <Text style={{ color: colors.primary }}>Take Photo</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            borderStyle: 'dashed',
            borderRadius: 5,
            borderWidth: 2,
            borderColor: colors.lightgray,
            width: '46%',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <IconSymbol
            style={{ paddingBottom: 6 }}
            name="mic"
            size={30}
            color={colors.primary}
          />
          <Text style={{ color: colors.primary }}>Record Audio</Text>
        </TouchableOpacity>
      </View>
      <View
        style={{
          borderStyle: 'dashed',
          borderRadius: 5,
          borderWidth: 2,
          height: 200,
          borderColor: colors.lightgray,
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <IconSymbol
          style={{ paddingBottom: 6 }}
          name="cloud"
          size={30}
          color={colors.darkGrey}
        />
        <Text style={styles.addOtherFilesLabel}>Attach Other Files</Text>

        <Text style={{ color: colors.darkGrey }}>
          Add images, videos, or documents
        </Text>
        <CustomButton
          borderRadius={24}
          minWidth={150}
          label={'Browse Files'}
          color={colors.primary200}
          textColor={colors.primary}
          backgroundColor={colors.primary200}
          iconName={undefined}
          onPress={undefined}
        />
      </View>
    </View>
  )

  const MediaPreview = () => {
    return (
      <>
        {attachments.map((mediaItem, componentIndex) => (
          <View
            key={mediaItem.id.toString()}
            style={{
              backgroundColor: colors.white,
              padding: 16,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderWidth: 1,
              borderRadius: 5,
              borderColor: colors.lightgray,
              marginBottom: 13,
            }}
          >
            <View
              key={mediaItem.id.toString()}
              style={{
                backgroundColor: colors.white,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <View
                style={{
                  backgroundColor: colors.primary200,
                  borderRadius: 5,
                  padding: 5,
                  marginRight: 10,
                }}
              >
                <Image width={34} height={34} src={mediaItem.path} />
              </View>

              <View>
                <Text style={{ fontWeight: 'bold' }}>{mediaItem.name}</Text>
                <Text
                  style={{
                    color: colors.secondary,
                    fontWeight: '500',
                  }}
                >{`${(mediaItem.size / 1000).toFixed(1)} MB`}</Text>
              </View>
            </View>
            <TouchableOpacity onPress={removeAttachment(componentIndex)}>
              <IconSymbol name={'xmark'} color={colors.secondary} />
            </TouchableOpacity>
          </View>
        ))}
      </>
    )
  }

  const DescriptionInput = () => (
    <Controller
      control={control}
      formState={formState}
      render={({ field: { onChange, onBlur, value } }) => (
        <View style={{ marginTop: 16 }}>
          <View style={styles.inputLabel}>
            <Text style={styles.inputLabel}>
              {'Describe the issue in detail'}
            </Text>
          </View>

          <TextInput
            onFocus={e => {
              e.persist()
              // scrollToInputBottom(e)
            }}
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
            placeholder={'Please provide as much detail as possible...'}
            placeholderTextColor={colors.secondary}
            underlineColor={colors.lightgray}
            activeUnderlineColor={colors.primary}
            selectionColor={colors.primary}
            contentStyle={{ height: 160, paddingRight: 35 }}
            style={styles.caseDetailFormTextInput}
            onBlur={() => {
              onBlur()
            }}
            onChangeText={onChange}
            value={value}
          />
          {formState.errors.case_description && (
            <Text style={styles.errorText}>
              {formState.errors.case_description.message}
            </Text>
          )}
        </View>
      )}
      name="case_description"
      rules={{
        maxLength: 1000,
      }}
    />
  )

  const Separator = () => (
    <View
      style={{
        marginTop: 20,
        width: '100%',
        height: 1,
        backgroundColor: colors.lightgray,
      }}
    />
  )

  const NextButton = () => (
    <View style={{ marginHorizontal: 30 }}>
      <CustomButton
        style={{
          width: '100%',
        }}
        borderRadius={24}
        backgroundColor={colors.primary}
        textColor="white"
        color="white"
        label={'Next'}
        iconName={undefined}
        onPress={undefined}
      />
    </View>
  )

  return (
    <Provider>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'position'}
        style={{ flex: 1, backgroundColor: '#f8fafc' }}
        contentContainerStyle={{
          flex: 1,
          backgroundColor: '#f8fafc',
        }}
      >
        <ScrollView
          ref={scrollViewRef}
          style={{
            backgroundColor: '#f8fafc',
            flex: 1,
            paddingBottom: 60,
          }}
          contentContainerStyle={{
            flexGrow: 1,
            paddingTop: 5,
            paddingBottom: 20,
          }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={globalStyles.screenContainer}>
            <View style={styles.formContainer}>
              <View>
                <Stepper currentStep={2} numberOfSteps={4} />
                <View style={{ paddingBottom: 30 }}>
                  <Text style={styles.stepTitle}>
                    {i18n.t('case_details_step_2_title')}
                  </Text>
                </View>
                <CalendarField />
                <CaseFrequencySelector />
                <Dropdowns />
                <DescriptionInput />
                <AddAttachments />
                <MediaPreview />
              </View>
            </View>
          </View>
          <Separator />
          <NextButton />
        </ScrollView>
      </KeyboardAvoidingView>
    </Provider>
  )

  function removeAttachment(componentIndex: number) {
    return () => {
      const updatedAttachments = attachments.filter(
        (item, index) => componentIndex !== index,
      )
      setAttachments(updatedAttachments)
    }
  }

  function onChangeDate(
    event: DateTimePickerEvent,
    date: Date | undefined,
    controllerOnChange,
  ) {
    if (event.type == 'set') {
      controllerOnChange(date)
      setSelectedDate(date)
    }
    setIsDatePickerOpen(false)
  }

  function openCalendar() {
    setIsDatePickerOpen(true)
  }
}

export default DetailsOfTheCase
