import { useNewCaseDetails } from '@/src/hooks/useNewCaseDetails'
import { File } from 'expo-file-system'
import { IconSymbol } from '@/components/ui/icon-symbol'
import { Colors } from '@/constants/theme'
import CheckboxCard from '@/src/components/CheckboxCard'
import Dropdown from '@/src/components/Dropdown'
import RecordingCard from '@/src/components/RecordingCard'
import Stepper from '@/src/components/Stepper'
import { useColorScheme } from '@/src/hooks/use-color-scheme'
import {
  isAudioFormat,
  isImageFormat,
  isVideoFormat,
} from '@/src/utils/formUtils'
import RNDateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker'
import { useNavigation } from '@react-navigation/native'
import {
  getRecordingPermissionsAsync,
  RecordingPresets,
  RecordingStatus,
  requestRecordingPermissionsAsync,
  useAudioRecorder,
} from 'expo-audio'
import { CameraCapturedPicture } from 'expo-camera'
import * as DocumentPicker from 'expo-document-picker'
import React, { useCallback, useEffect, useRef, useState } from 'react'
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
import {
  ActivityIndicator,
  Modal,
  Portal,
  Provider,
  TextInput,
} from 'react-native-paper'
import { useDispatch } from 'react-redux'
import CustomButton from '../../../components/CustomButton'
import CustomCamera from '../../../components/CustomCamera'
import { i18n } from '../../../translations/i18n'
import { colors } from '../../../utils/colors'
import MESSAGES from '../../../utils/formErrorMessages'
import globalStyles from '../../../utils/globalStyles'
import styles from '../../Home/NewCaseDetails/NewCaseDetails.style'

type Attachment = {
  name: string
  size: number | undefined
  path: string
  isAudio: boolean
}

function NewCaseDetails({ route }) {
  const theme = useColorScheme() ?? 'light'
  const dispatch = useDispatch()
  const navigation = useNavigation()
  const [selectedDate, setSelectedDate] = useState<Date | undefined>()
  const [isDatePickerOpen, setIsDatePickerOpen] = useState<boolean>(false)
  const scrollViewRef = useRef<ScrollView | null>(null)

  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [isCameraOpen, setIsCameraOpen] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [recorderStatus, setRecorderStatus] = useState<RecordingStatus>()
  const { isLoading, error, data } = useNewCaseDetails()

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

  function onTakeCameraMedia(media: CameraCapturedPicture): void {
    addToAttachments(media)
    console.log('media outside', media)
    setAttachments([
      ...attachments,
      {
        name: getNameFromFilePath(media.uri),
        size: media.height * media.width, // TODO,
        path: media.uri,
        isAudio: false,
      },
    ])
    setIsCameraOpen(false)
  }

  function getNameFromFilePath(filePath: string | null) {
    return filePath?.split('/').reverse()[0] ?? ''
  }

  function addToAttachments(media: any): void {
    setIsCameraOpen(false)
  }

  function openCamera(): void {
    setIsCameraOpen(true)
  }

  const CalendarField = () => {
    return (
      <Controller
        control={control}
        formState={formState}
        render={({ field: { onChange, onBlur, value } }) => {
          return (
            <View style={styles.fieldContainer}>
              <Text style={styles.inputLabel}>
                {i18n.t('when_did_it_happen')}
              </Text>
              <Text style={styles.inputSubLabel}>
                {i18n.t('date_of_occurrence')}
              </Text>

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
                  {selectedDate?.toLocaleDateString() ??
                    i18n.t('select_a_date')}
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

  console.log(data)

  const CaseTypeDropdown = () => (
    <Controller
      control={control}
      formState={formState}
      render={({ field: { onChange, value } }) => (
        <View>
          <Text style={styles.inputLabel}>
            {i18n.t('what_is_this_issue_about')}
          </Text>
          <Text style={[styles.inputSubLabel]}>{i18n.t('case_type')}</Text>
          <Dropdown
            label={''}
            options={data?.types.results}
            value={value}
            onSelect={onChange}
            placeholder={i18n.t('select_case_type')}
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
          <Text style={[styles.inputSubLabel]}>{i18n.t('case_subtype')}</Text>
          <Dropdown
            label={''}
            options={data?.subtypes.results}
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
          <Text style={[styles.inputSubLabel]}>{i18n.t('case_category')}</Text>
          <Dropdown
            label={''}
            value={value}
            options={data?.categories.results}
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
          <Text style={[styles.inputSubLabel]}>{i18n.t('case_component')}</Text>
          <Dropdown
            label={''}
            value={value}
            options={data?.components.results}
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
          <Text style={[styles.inputSubLabel]}>
            {i18n.t('case_sub_component')}
          </Text>
          <Dropdown
            label={''}
            value={value}
            options={data?.subcomponents.results}
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
    <View style={styles.addAttachmentsContainer}>
      <View style={styles.inputLabel}>
        <Text style={styles.inputLabel}>
          {i18n.t('include_attachments_title')}
        </Text>
      </View>
      <View style={styles.addMediaContainer}>
        <TouchableOpacity onPress={openCamera} style={styles.addPhotoButton}>
          <IconSymbol
            style={{ paddingBottom: 10 }}
            name="camera"
            color={colors.primary}
          />
          <Text style={{ color: colors.primary }}>{i18n.t('take_photo')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={toggleRecording}
          style={styles.addPhotoButton}
        >
          <IconSymbol
            style={{ paddingBottom: 6 }}
            name={!isRecording ? 'mic' : 'stop.circle'}
            size={30}
            color={!isRecording ? colors.primary : colors.error}
          />
          <Text style={{ color: colors.primary }}>
            {!isRecording ? i18n.t('record_audio') : i18n.t('press_to_stop')}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.otherFilesContainer}>
        <IconSymbol
          style={{ paddingBottom: 6 }}
          name="cloud"
          size={30}
          color={colors.darkGrey}
        />
        <Text style={styles.addOtherFilesLabel}>
          {i18n.t('attach_other_files')}
        </Text>

        <Text style={{ color: colors.darkGrey }}>
          {i18n.t('attach_other_files_description')}
        </Text>
        <CustomButton
          borderRadius={24}
          minWidth={150}
          label={'Browse Files'}
          color={colors.primary200}
          textColor={colors.primary}
          backgroundColor={colors.primary200}
          iconName={undefined}
          onPress={browseFile}
        />
      </View>
    </View>
  )

  const MediaPreview = () => {
    return (
      <>
        {attachments.map((mediaItem, componentIndex) => {
          let unitConversionDigit, sizeDigit
          let sizeUnit = 'KB'
          if (mediaItem.size) {
            if (mediaItem.size > 6000) {
              sizeUnit = 'MB'
              unitConversionDigit = 1024 * 1024
            } else {
              sizeUnit = 'KB'
              unitConversionDigit = 1024
            }
            sizeDigit = (mediaItem.size / unitConversionDigit).toFixed(2)
          } else {
            sizeDigit = (0).toFixed(2)
          }

          return (
            <View key={componentIndex.toString()}>
              {mediaItem.isAudio ? (
                <RecordingCard
                  cardContainerStyle={{ flex: 1 }}
                  mode="playback"
                  initialURI={mediaItem.path}
                  onRemove={() => removeAttachment(componentIndex)}
                />
              ) : (
                <View style={styles.mediaPreviewCardContainer}>
                  <View style={styles.mediaPreviewCardLeftContent}>
                    <View style={styles.mediaPreviewCardIconContainer}>
                      {isImageFormat(mediaItem.path) ? (
                        <Image width={34} height={34} src={mediaItem.path} />
                      ) : (
                        <IconSymbol
                          name={
                            isVideoFormat(mediaItem.path) ? 'video' : 'document'
                          }
                          color={colors.primary}
                        />
                      )}
                    </View>

                    <View style={{ flex: 1 }}>
                      <Text style={{ fontWeight: 'bold' }}>
                        {mediaItem.name}
                      </Text>
                      <Text style={styles.mediaPreviewCardSubtitle}>
                        {sizeDigit} {sizeUnit}
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    onPress={() => removeAttachment(componentIndex)}
                  >
                    <IconSymbol name={'xmark'} color={colors.secondary} />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )
        })}
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
              {i18n.t('case_description_input_label')}
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
            placeholder={'Please provide as much detail as possible...'}
            placeholderTextColor={colors.secondary}
            underlineColor={colors.lightgray}
            activeUnderlineColor={colors.primary}
            selectionColor={colors.primary}
            contentStyle={styles.descriptionInputContent}
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
        required: { value: true, message: MESSAGES.required },
      }}
    />
  )

  const Separator = () => <View style={styles.lineSeparator} />

  const NextButton = () => (
    <View style={{ marginHorizontal: 30 }}>
      <CustomButton
        style={{ width: '100%' }}
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

  const recorderStatusListener = (status: RecordingStatus) => {
    setRecorderStatus(status)
  }

  useEffect(() => {
    if (!recorderStatus) return
    if (recorderStatus.isFinished) {
      const recordingName = getNameFromFilePath(recorderStatus.url)
      const isAudio = isAudioFormat(recordingName)
      const recordingUrl = recorderStatus.url ?? ''
      const audioFile = new File(recordingUrl)
      setAttachments([
        ...attachments,
        {
          name: recordingName,
          size: audioFile.size,
          path: recordingUrl,
          isAudio,
        },
      ])
      setRecorderStatus(undefined)
    }
  }, [recorderStatus])

  const audioRecorder = useAudioRecorder(
    RecordingPresets.HIGH_QUALITY,
    recorderStatusListener,
  )

  const toggleRecording = async () => {
    if (!isRecording) {
      const permissions = await getRecordingPermissionsAsync()
      if (!permissions.granted) {
        const request = await requestRecordingPermissionsAsync()
        if (!request.granted) return
      }
      setIsRecording(true)
      await audioRecorder.prepareToRecordAsync()
      audioRecorder.record({ atTime: 100 })
    } else {
      setIsRecording(false)
      await audioRecorder.stop()
    }
  }

  const ErrorSnackBar = ({ message }: { message: string }) => {
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
        }}
      >
        <View style={{ flex: 1 }}>
          <Text style={{ color: 'white' }}>{message}</Text>
        </View>
        <TouchableOpacity onPress={() => {}}>
          <Text
            style={{
              color: colors.primary,
              fontWeight: 'bold',
              fontSize: 18,
            }}
          >
            Retry
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  const ErrorView = ({ message }: { message: string }) => {
    return (
      <View
        style={{
          backgroundColor: colors.white,
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 24,
        }}
      >
        <View style={{ alignItems: 'center', marginBottom: 50 }}>
          <Text style={{ color: colors.secondary }}>
            Oops, something went wrong.
          </Text>
          <Text style={{ color: colors.secondary }}>Error Code: {message}</Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack()
          }}
        >
          <Text
            style={{
              color: colors.primary,
              fontWeight: 'bold',
              fontSize: 18,
            }}
          >
            Go back
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  const Loading = () => {
    return (
      <ActivityIndicator style={{ marginTop: 24 }} color={colors.primary} />
    )
  }

  return (
    <Provider>
      {isLoading && <Loading />}
      {error && <ErrorView message={error.message} />}
      {!isLoading && !error && (
        <>
          <Portal>
            <Modal style={styles.cameraModal} visible={isCameraOpen}>
              {isCameraOpen && (
                <CustomCamera onTakeCameraMedia={onTakeCameraMedia} />
              )}
            </Modal>
          </Portal>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'position'}
            style={styles.keyboardAvoidingView}
            contentContainerStyle={styles.keyboardAvoidingViewContentContainer}
          >
            <ScrollView
              ref={scrollViewRef}
              style={styles.mainScrollView}
              contentContainerStyle={styles.scrollableContentContainer}
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
        </>
      )}
    </Provider>
  )

  function removeAttachment(componentIndex: number) {
    const updatedAttachments = attachments.filter(
      (_, index) => componentIndex !== index,
    )
    setAttachments(updatedAttachments)
  }

  async function browseFile() {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        copyToCacheDirectory: true,
        type: '*/*',
        multiple: true,
        base64: true,
      })
      if (!result.canceled) {
        const files = result.assets.map(asset => {
          const isAudio = isAudioFormat(asset.name)
          return {
            name: asset.name,
            size: asset.size,
            path: asset.uri,
            isAudio,
          }
        })
        // setAttachments([...attachments, ...files])
        setAttachments(prev => [...prev, ...files])
      }
    } catch (error) {
      console.error(error)
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

export default NewCaseDetails
