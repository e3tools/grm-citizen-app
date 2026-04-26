import { createIssue } from '@/src/services/issueService'
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

function generateTrackingCode(): string {
  const randomWord =
    SAMPLE_WORDS[Math.floor(Math.random() * SAMPLE_WORDS.length)]
  const randomNumber = Math.floor(Math.random() * 10000)
  const code = `${randomWord}${randomNumber}`
  return code
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
  const navigator = useNavigation()
  const [certified, setCertified] = useState(false)
  const [isCaseCreated, setIsCaseCreated] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<unknown>()
  const {session, profile} = useSelector(state => {
    return state.get('authentication').toObject()
  }, shallowEqual)

  const viewModel = useMemo(() => {
    const caseDetails = params.caseDetails ?? {}
    const locationDetails = params.locationDetails ?? {}
    const attachments: Attachment[] = Array.isArray(caseDetails.attachments)
      ? caseDetails.attachments
      : []

    const category =
      caseDetails.case_category ||
      caseDetails.case_sub_component ||
      caseDetails.case_component ||
      caseDetails.case_type ||
      ''

    const date = formatFallbackDate(caseDetails.case_occurrence_date)
    const dateTime = date ? `${date} · 14:30` : ''

    const description = caseDetails.case_description || ''

    const district = locationDetails.case_district
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
      district ? `District ${district}` : undefined,
      wards.length ? `Ward ${wards.join(' / ')}` : undefined,
    ].filter(Boolean)

    return {
      securityTitle: 'Confidential Report',
      securitySubtitle:
        'Your identity will remain hidden from public view but visible to case officers',
      category: category ? String(category) : '—',
      dateTime: dateTime || '—',
      status: 'Draft',
      description: description ? String(description) : '—',
      attachments,
      locationLine: locationLineParts.length
        ? locationLineParts.join(', ')
        : '—',
    }
  }, [params.caseDetails, params.locationDetails])

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
        category: caseDetails.case_category,
        component: caseDetails.case_component,
        issue_type: caseDetails.case_type,
        issue_sub_type: caseDetails.case_sub_type,
        description: caseDetails.case_description,
        intake_date: caseDetails.case_occurrence_date.toISOString(),
        sub_component: caseDetails.case_sub_component,
        location_description: locationDetails.detailed_location_description,
        tracking_code: generateTrackingCode(),
        reporter: session.user_id,
        administrative_region:
          locationDetails[`${ward}`] && locationDetails[`${ward}`].length > 0
            ? locationDetails[`${ward}`]
            : locationDetails.case_district,
        attachments: caseDetails.attachments,
        case_occurrence_frequency:
          caseDetails.case_occurrence_frequency ?? 'one-time-event',
        contact_medium:
          profile.phone_number || profile.email
            ? ('channel-alert' as const)
            : ('anonymous' as const),
        // 'facilitator' When ?
        contact_information: profile.phone_number ?? profile.email ?? '',
        contact_method: profile.phone_number
          ? ('phone_number' as const)
          : profile.email
            ? ('email' as const)
            : 'whatsapp',
        // : ('whatsapp' as const),
        // : ('sms' as const),
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

      await createIssue(payload)
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
        <Text style={styles.stepKicker}>STEP 4: CASE SUMMARY</Text>

        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardHeaderLabel}>SECURITY LEVEL</Text>
            <Pressable hitSlop={10}>
              <Text style={styles.editLink}>EDIT</Text>
            </Pressable>
          </View>

          <View style={styles.securityRow}>
            <View style={styles.securityIcon}>
              <Feather name="shield" size={16} color={colors.primary} />
            </View>
            <View style={{flex: 1}}>
              <Text style={styles.securityTitle}>
                {viewModel.securityTitle}
              </Text>
              <Text style={styles.securitySubtitle}>
                {viewModel.securitySubtitle}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardHeaderLabel}>INFORMATION LEDGER</Text>
            <Pressable hitSlop={10}>
              <Text style={styles.editLink}>EDIT</Text>
            </Pressable>
          </View>

          <View style={styles.table}>
            <View style={styles.tableRow}>
              <View style={styles.tableCell}>
                <Text style={styles.tableLabel}>CATEGORY</Text>
                <Text style={styles.tableValue}>{viewModel.category}</Text>
              </View>
              <View style={styles.tableCell}>
                <Text style={styles.tableLabel}>DATE &amp; TIME</Text>
                <Text style={styles.tableValue}>{viewModel.dateTime}</Text>
              </View>
            </View>

            <View style={styles.tableRowSingle}>
              <Text style={styles.tableLabel}>STATUS</Text>
              <View style={styles.statusRow}>
                <View style={styles.statusDot} />
                <Text style={styles.statusText}>{viewModel.status}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <Text style={styles.sectionLabel}>DESCRIPTION</Text>
            <Text style={styles.bodyText}>{viewModel.description}</Text>

            <View style={styles.divider} />

            <Text style={styles.sectionLabel}>
              ATTACHMENTS ({viewModel.attachments.length})
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
            <Text style={styles.cardHeaderLabel}>GEO-LOCATION</Text>
            <Pressable hitSlop={10}>
              <Text style={styles.editLink}>EDIT</Text>
            </Pressable>
          </View>

          <Text style={styles.geoText}>{viewModel.locationLine}</Text>

          <View style={styles.mapPreview}>
            <View style={styles.mapPin}>
              <Feather name="map-pin" size={18} color={colors.primary} />
            </View>
          </View>
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
            I certify that the information provided is true and accurate to the
            best of my knowledge.
          </Text>
        </Pressable>

        <View style={{marginTop: 10}}>
          <CustomButton
            style={{width: '100%'}}
            borderRadius={24}
            backgroundColor={colors.primary}
            textColor="white"
            color="white"
            label={'Submit Case'}
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
                  Case Created Successfully!
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
                    Ok
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
