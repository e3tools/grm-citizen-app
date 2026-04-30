import { addIssueAttachment, createIssue } from '@/src/services/issueService'
import { i18n } from '@/src/translations/i18n'
import { Feather } from '@expo/vector-icons'
import { useNavigation, useRoute } from '@react-navigation/native'
import React, { useMemo, useState } from 'react'
import {
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { shallowEqual, useSelector } from 'react-redux'
import CustomButton from '../../../components/CustomButton'
import { colors } from '../../../utils/colors'
import styles from './NewCaseSummary.style'

const SAMPLE_WORDS = ['lac', 'plaine', 'savane', 'colline']

type Attachment = {
  name: string
  size?: number
  path: string
  isAudio?: boolean
}

type NewCaseSummaryRouteParams = {
  caseDetails?: Record<string, any> & {attachments?: Attachment[]}
  locationDetails?: Record<string, any>
  securityLevelDetails?: Record<string, any>
}

function guessMimeType(filename: string) {
  const lower = (filename || '').toLowerCase()
  if (lower.endsWith('.jpg') || lower.endsWith('.jpeg')) return 'image/jpeg'
  if (lower.endsWith('.png')) return 'image/png'
  if (lower.endsWith('.gif')) return 'image/gif'
  if (lower.endsWith('.webp')) return 'image/webp'
  if (lower.endsWith('.heic')) return 'image/heic'
  if (lower.endsWith('.mp4')) return 'video/mp4'
  if (lower.endsWith('.mov')) return 'video/quicktime'
  if (lower.endsWith('.m4a')) return 'audio/mp4'
  if (lower.endsWith('.mp3')) return 'audio/mpeg'
  if (lower.endsWith('.wav')) return 'audio/wav'
  if (lower.endsWith('.pdf')) return 'application/pdf'
  return 'application/octet-stream'
}

function filenameFromPath(path: string) {
  const parts = (path || '').split('/')
  return parts[parts.length - 1] || 'attachment'
}

function formatFallbackDate(input: any) {
  if (!input) return ''
  if (typeof input === 'string') return input
  try {
    const d = new Date(input)
    if (Number.isNaN(d.getTime())) return String(input)
    return d.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    })
  } catch {
    return String(input)
  }
}

export default function NewCaseSummary() {
  const route = useRoute<any>()
  const params = (route?.params ?? {}) as NewCaseSummaryRouteParams
  const navigator = useNavigation<any>()
  const [certified, setCertified] = useState(false)
  const [isCaseCreated, setIsCaseCreated] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<unknown>()
  const [trackingCode, setTrackingCode] = useState('')
  const {session, profile} = useSelector((state: any) => {
    return state.get('authentication').toObject()
  }, shallowEqual)

  const viewModel = useMemo(() => {
    const caseDetails = params.caseDetails ?? {}
    const locationDetails = params.locationDetails ?? {}
    const attachments: Attachment[] = Array.isArray(caseDetails.attachments)
      ? caseDetails.attachments
      : []

    const category =
      caseDetails.case_category?.name ||
      caseDetails.case_sub_component?.name ||
      caseDetails.case_component?.name ||
      caseDetails.case_type?.name ||
      ''

    const date = formatFallbackDate(caseDetails.case_occurrence_date)
    const dateTime = date ? `${date} · 14:30` : ''

    const description = caseDetails.case_description || ''

    const district = locationDetails.case_district.name
    const wards = Object.keys(locationDetails)
      .filter(k => k.startsWith('case_ward_'))
      .sort(
        (a, b) =>
          Number(a.replace('case_ward_', '')) -
          Number(b.replace('case_ward_', '')),
      )
      .map(k => locationDetails[k])
      .filter(Boolean)

    const locationLineParts = [
      locationDetails.detailed_location_description,
      district ? `${district}` : undefined,
      wards.length ? `${wards.map(i => i.name).join(', ')}` : undefined,
    ].filter(Boolean)

    return {
      securityTitle: 'Confidential Report',
      securitySubtitle:
        'Your identity will remain hidden from public view but visible to case officers',
      category: category ? String(category) : '—',
      dateTime: dateTime || '—',
      status: i18n.t('draft'),
      description: description ? String(description) : '—',
      attachments,
      locationLine: locationLineParts.length
        ? locationLineParts.join(', ')
        : '—',
    }
  }, [params.caseDetails, params.locationDetails])

  const generateTrackingCode = () => {
    const randomWord =
      SAMPLE_WORDS[Math.floor(Math.random() * SAMPLE_WORDS.length)]
    const randomNumber = Math.floor(Math.random() * 10000)
    const code = `${randomWord}${randomNumber}`
    setTrackingCode(code)
    return code
  }

  const createCase = async () => {
    setSubmitting(true)

    try {
      const caseDetails = params.caseDetails ?? {}
      const locationDetails = params.locationDetails ?? {}
      const securityLevelDetails = params.securityLevelDetails ?? {}
      const ward = Object.keys(locationDetails)
        .filter(k => k.startsWith('case_ward_'))
        .sort(
          (a, b) =>
            Number(a.replace('case_ward_', '')) -
            Number(b.replace('case_ward_', '')),
        )
        .reverse()[0]

      const payload = {
        category: caseDetails.case_category.id,
        component: caseDetails.case_component.id,
        issue_type: caseDetails.case_type.id,
        issue_sub_type: caseDetails.case_sub_type.id,
        status: 1, // Initial status
        description: caseDetails.case_description,
        intake_date: caseDetails.case_occurrence_date.toISOString(),
        sub_component: caseDetails.case_sub_component.id,
        location_description: locationDetails.detailed_location_description,
        tracking_code: generateTrackingCode(),
        reporter: session.user_id,
        administrative_region:
          locationDetails[`_id_${ward}`] && locationDetails[`_id_${ward}`] > 0
            ? locationDetails[`_id_${ward}`]
            : locationDetails.case_district.id,
        attachments: caseDetails.attachments,
        case_occurrence_frequency:
          caseDetails.case_occurrence_frequency ?? 'one-time-event',
        contact_medium:
          profile.phone_number || profile.email
            ? ('channel-alert' as const)
            : ('anonymous' as const),
        contact_information: profile.phone_number ?? profile.email ?? '',
        contact_method: profile.phone_number
          ? ('phone_number' as const)
          : ('email' as const),
        citizen: {
          name: securityLevelDetails.name
            ? `${profile.first_name} ${profile.last_name}`
            : 'Anonymous',
          age_group: securityLevelDetails.age
            ? (profile.age_group?.id ?? '')
            : '',
          type: securityLevelDetails.type ?? 'keep_name_confidential',
          group: securityLevelDetails.citizen_group_1
            ? (profile.group?.id ?? '')
            : '',
          group_2: securityLevelDetails.citizen_group_2
            ? (profile.group_2?.id ?? '')
            : '',
        },
      }

      const createdIssue = await createIssue({
        ...payload,
        // Files are uploaded after creation via /add-attachment
        attachments: undefined,
      })

      const createdIssueId = createdIssue?.data?.id ?? null
      if (!createdIssueId) {
        throw new Error('Issue created but no id returned')
      }

      const attachments: Attachment[] = Array.isArray(caseDetails.attachments)
        ? caseDetails.attachments
        : []

      for (const attachment of attachments) {
        const uri = attachment.path
        const name = attachment.name || filenameFromPath(uri)
        const type = guessMimeType(name)

        const formData = new FormData()
        // Most DRF backends expect "file"; adjust if API expects a different key.
        formData.append('file', {uri, name, type} as any)

        await addIssueAttachment(createdIssueId, formData)
      }

      setIsCaseCreated(true)
    } catch (error) {
      console.error('Error creating case: ', error)

      setError(error)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        <Text style={styles.stepKicker}>{i18n.t('step_4_case_summary')}</Text>

        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardHeaderLabel}>
              {i18n.t('security_level')}
            </Text>
          </View>

          <View style={styles.securityRow}>
            <View style={styles.securityIcon}>
              <Feather name="shield" size={16} color={colors.primary} />
            </View>
            <View style={{flex: 1}}>
              <Text style={styles.securityTitle}>
                {i18n.t('confidential_report')}
              </Text>
              <Text style={styles.securitySubtitle}>
                {i18n.t('confidential_report_subtitle')}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardHeaderLabel}>
              {i18n.t('information_ledger')}
            </Text>
          </View>

          <View style={styles.table}>
            <View style={styles.tableRow}>
              <View style={styles.tableCell}>
                <Text style={styles.tableLabel}>{i18n.t('category')}</Text>
                <Text style={styles.tableValue}>{viewModel.category}</Text>
              </View>
              <View style={styles.tableCell}>
                <Text style={styles.tableLabel}>{i18n.t('date_and_time')}</Text>
                <Text style={styles.tableValue}>{viewModel.dateTime}</Text>
              </View>
            </View>

            <View style={styles.tableRowSingle}>
              <Text style={styles.tableLabel}>
                {i18n.t('status').toLocaleUpperCase()}
              </Text>
              <View style={styles.statusRow}>
                <View style={styles.statusDot} />
                <Text style={styles.statusText}>{viewModel.status}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <Text style={styles.sectionLabel}>
              {i18n.t('description').toUpperCase()}
            </Text>
            <Text style={styles.bodyText}>{viewModel.description}</Text>

            <View style={styles.divider} />

            <Text style={styles.sectionLabel}>
              {i18n.t('attachments').toUpperCase()} (
              {viewModel.attachments.length})
            </Text>
            <View style={styles.attachmentsRow}>
              {viewModel.attachments.slice(0, 2).map((a, idx) => (
                <View key={`${a.path}-${idx}`} style={styles.attachmentThumb}>
                  <Feather name="image" size={18} color="#9ca3af" />
                </View>
              ))}
              {viewModel.attachments.length === 0 && (
                <Text style={styles.muted}>—</Text>
              )}
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardHeaderLabel}>{i18n.t('geo_location')}</Text>
          </View>

          <Text style={styles.geoText}>{viewModel.locationLine}</Text>
          {/* <View style={styles.mapPreview}>
            <StaticMap
              regionName={viewModel.locationLine || 'Your Default Region'}
            /> 
            <View style={styles.mapPin}>
              <Feather name="map-pin" size={18} color={colors.primary} />
            </View>
          </View> */}
        </View>

        <Pressable
          style={styles.certRow}
          onPress={() => setCertified(v => !v)}
          hitSlop={10}>
          <View style={[styles.checkbox, certified && styles.checkboxChecked]}>
            {certified && (
              <Feather name="check" size={14} color={colors.white} />
            )}
          </View>
          <Text style={styles.certText}>
            {i18n.t('certify_information_true')}
          </Text>
        </Pressable>

        <View style={{marginTop: 10}}>
          <CustomButton
            style={{width: '100%'}}
            borderRadius={24}
            backgroundColor={colors.primary}
            loading={submitting}
            disabled={submitting}
            textColor="white"
            color="white"
            label={i18n.t('submit_case')}
            iconName={'send'}
            onPress={() => {
              if (!certified) return
              createCase()
            }}
          />
        </View>
        {isCaseCreated && (
          <Modal
            transparent
            animationType="fade"
            visible={isCaseCreated}
            onRequestClose={() => {
              navigator.navigate('GRM')
            }}>
            <View
              style={{
                flex: 1,
                backgroundColor: 'rgba(0,0,0,0.4)',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <View
                style={{
                  backgroundColor: colors.white,
                  padding: 32,
                  borderRadius: 20,
                  alignItems: 'center',
                  shadowColor: '#000',
                  shadowOffset: {width: 0, height: 2},
                  shadowOpacity: 0.2,
                  shadowRadius: 4,
                  elevation: 5,
                  minWidth: 240,
                }}>
                <Feather
                  name="check-circle"
                  size={48}
                  color={colors.primary}
                  style={{marginBottom: 16}}
                />
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: '600',
                    color: colors.primary,
                    marginBottom: 12,
                    textAlign: 'center',
                  }}>
                  {i18n.t('case_created_successfully')}
                </Text>
                {/* Add tracking code display here */}
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '400',
                    color: colors.secondary,
                    marginBottom: 8,
                    textAlign: 'center',
                  }}>
                  {i18n.t('tracking_code')}:{' '}
                  <Text style={{fontWeight: '700'}}>{trackingCode}</Text>
                </Text>
                <TouchableOpacity
                  style={{
                    marginTop: 20,
                    backgroundColor: colors.primary,
                    borderRadius: 20,
                    paddingHorizontal: 36,
                    paddingVertical: 12,
                  }}
                  onPress={() => {
                    navigator.reset({
                      index: 0,
                      routes: [{name: 'Main'}],
                    })
                  }}>
                  <Text
                    style={{
                      color: 'white',
                      fontWeight: '700',
                      fontSize: 16,
                    }}>
                    {i18n.t('ok')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}
