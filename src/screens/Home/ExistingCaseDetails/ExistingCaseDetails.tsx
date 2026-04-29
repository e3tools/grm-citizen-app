import { i18n } from '@/src/translations/i18n'
import { Feather } from '@expo/vector-icons'
import { useNavigation, useRoute } from '@react-navigation/native'
import React, { useEffect, useMemo, useState } from 'react'
import {
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native'
import {
  addIssueComment,
  getIssueDetail,
  listIssueAttachments,
  listIssueComments,
} from '../../../services/issueService'
import { colors } from '../../../utils/colors'
import styles from './ExistingCaseDetails.style'

export default function ExistingCaseDetails() {
  const navigation = useNavigation<any>()
  const route = useRoute<any>()
  const issueId = route?.params?.id
  const [comment, setComment] = useState('')
  const s = styles as any
  const [loading, setLoading] = useState(false)
  const [issue, setIssue] = useState<any>(null)
  const [attachments, setAttachments] = useState<any[]>([])
  const [comments, setComments] = useState<any[]>([])
  const [appealModalVisible, setAppealModalVisible] = useState(false)
  const [appealReason, setAppealReason] = useState('')
  const [rateModalVisible, setRateModalVisible] = useState(false)
  const [rate, setRate] = useState(5)

  const data = useMemo(
    () => ({
      status: issue?.status ?? '—',
      title: issue?.title ?? issue?.issue_type?.name ?? '—',
      caseNumberLabel: 'Case #',
      caseNumber: issue?.id ? String(issue.id) : '—',
      dateOfSubmission: issue?.intake_date
        ? new Date(issue.intake_date).toLocaleDateString()
        : '—',
      caseType: issue?.issue_type?.name ?? '—',
      description: issue?.description ?? '—',
      progress: [
        {
          key: 'resolved',
          title: 'Resolved',
          subtitle: 'Maintenance crew repaired the site.',
          date: 'Nov 02',
          icon: 'check-circle',
          active: issue?.status?.final_status ?? true,
        },
        {
          key: 'under_review',
          title: 'Under Review',
          subtitle: 'Assigned to Road Maintenance Dept.',
          date: 'Oct 26',
          icon: 'clipboard',
          active: issue?.status?.open_status ?? false,
        },
        {
          key: 'reported',
          title: 'Reported',
          subtitle: 'Case successfully submitted.',
          date: 'Oct 24',
          icon: 'flag',
          active: issue?.status?.initial_status ?? false,
        },
      ],
      attachmentsCount: attachments?.length ?? 0,
      updates: (comments || []).map((c: any) => {
        const isMine = Boolean(c?.is_mine)
        const author =
          c?.author_name || (isMine ? 'You' : c?.author || 'Officer')
        return {
          key: String(c?.id ?? `${author}-${c?.created_date ?? Math.random()}`),
          author,
          role: isMine ? 'You' : 'Officer',
          text: String(c?.comment ?? c?.text ?? ''),
          when: c?.created_date
            ? new Date(c.created_date).toLocaleDateString()
            : '',
          side: isMine ? 'right' : 'left',
        }
      }),
    }),
    [issue, attachments, comments],
  )

  // function getStatus() {
  //   let a
  //   for (const key in data.status) {
  //     if (Object.prototype.hasOwnProperty.call(data.status, key)) {
  //       const element = data.status[key]
  //       if (element == true) a = key
  //       break
  //     }
  //   }
  // }

  useEffect(() => {
    const run = async () => {
      if (!issueId) return
      setLoading(true)
      try {
        const [issueRes, attachmentsRes, commentsRes] = await Promise.all([
          getIssueDetail(issueId),
          listIssueAttachments(issueId),
          listIssueComments(issueId),
        ])

        setIssue(issueRes)
        setAttachments(attachmentsRes?.results ?? attachmentsRes ?? [])
        setComments(commentsRes?.results ?? commentsRes ?? [])
      } finally {
        setLoading(false)
      }
    }
    run()
  }, [issueId])

  const sendComment = async () => {
    const text = comment.trim()
    if (!text || !issueId) return
    setComment('')
    try {
      await addIssueComment(issueId, {comment: text})
      const commentsRes = await listIssueComments(issueId)
      setComments(commentsRes?.results ?? commentsRes ?? [])
    } catch {
      setComment(text)
    }
  }

  async function updateIssueService(arg0: {
    rate?: number
    appealReason?: string
  }) {
    if (!rate && !appealReason) return
    console.log(rate)
    console.log(appealReason)

    // throw new Error('Function not implemented.')
  }

  return (
    <SafeAreaView style={s.screen}>
      {loading && (
        <View
          style={{
            zIndex: 20,
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.2)',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={{color: '#111827'}}>Loading…</Text>
        </View>
      )}
      <ScrollView
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={s.card}>
          <View style={s.cardHeaderRow}>
            <View style={s.statusPill}>
              <Text style={s.statusPillText}>{data.status?.name ?? ''}</Text>
            </View>
            <Pressable hitSlop={12} style={s.moreIconBtn}>
              <Feather
                name="more-vertical"
                size={18}
                color={colors.secondary}
              />
            </Pressable>
          </View>

          <View style={s.titleRow}>
            <Text style={s.caseTitle}>{data.title}</Text>
            <Text style={s.caseNumber}>
              <Text style={s.caseNumberLabel}>{data.caseNumberLabel}</Text>
              {data.caseNumber}
            </Text>
          </View>

          <View style={s.metaGrid}>
            <View style={s.metaCell}>
              <Text style={s.metaLabel}>{i18n.t('date_of_submission')}</Text>
              <Text style={s.metaValue}>{data.dateOfSubmission}</Text>
            </View>
            <View style={s.metaCell}>
              <Text style={s.metaLabel}>CASE TYPE</Text>
              <Text style={s.metaValue}>{data.caseType}</Text>
            </View>
          </View>

          <View style={s.divider} />

          <Text style={s.sectionLabel}>DESCRIPTION</Text>
          <Text style={s.description}>{data.description}</Text>
        </View>

        <View style={s.card}>
          <View style={s.sectionHeaderRow}>
            <View style={s.sectionHeaderLeft}>
              <Feather name="activity" size={16} color={colors.primary} />
              <Text style={s.sectionHeaderTitle}>Case Progress</Text>
            </View>
          </View>

          <View style={s.timeline}>
            {data.progress.map((item, idx) => {
              const isLast = idx === data.progress.length - 1
              return (
                <View key={item.key} style={s.timelineRow}>
                  <View style={s.timelineLeft}>
                    <View
                      style={[
                        s.timelineDot,
                        item.active && s.timelineDotActive,
                      ]}>
                      <Feather
                        name={item.icon as any}
                        size={14}
                        color={item.active ? colors.white : colors.secondary}
                      />
                    </View>
                    {!isLast && <View style={s.timelineLine} />}
                  </View>
                  <View style={s.timelineBody}>
                    <View style={s.timelineTitleRow}>
                      <Text style={s.timelineTitle}>{item.title}</Text>
                      <Text style={s.timelineDate}>{item.date}</Text>
                    </View>
                    <Text style={s.timelineSubtitle}>{item.subtitle}</Text>
                  </View>
                </View>
              )
            })}
          </View>
        </View>

        <View style={s.card}>
          <View style={s.sectionHeaderRow}>
            <Text style={s.sectionHeaderTitlePlain}>
              Attachments ({data.attachmentsCount})
            </Text>
            <Pressable
              disabled={!issueId}
              hitSlop={10}
              onPress={() => {
                // Keep navigation optional; if route isn't wired yet, this is a no-op.
                try {
                  navigation.navigate('All issue attachments', {id: issueId})
                } catch {}
              }}>
              <Text style={s.viewAllLink}>View All</Text>
            </Pressable>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={s.attachmentsRow}>
            {(attachments || []).slice(0, 6).map((a, idx) => (
              <View key={a?.id ?? idx} style={s.attachmentThumb}>
                <View style={s.attachmentThumbInner}>
                  <Feather name="image" size={18} color={colors.secondary} />
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={s.card}>
          <Text style={s.sectionHeaderTitlePlain}>Updates &amp; Comments</Text>

          <View style={s.chatList}>
            {data.updates.map(msg => {
              const isRight = msg.side === 'right'
              return (
                <View
                  key={msg.key}
                  style={[s.chatRow, isRight ? s.chatRowRight : s.chatRowLeft]}>
                  {!isRight && (
                    <View style={s.avatar}>
                      <Feather name="shield" size={16} color={colors.primary} />
                    </View>
                  )}

                  <View
                    style={[
                      s.chatBubble,
                      isRight ? s.chatBubbleRight : s.chatBubbleLeft,
                    ]}>
                    <View
                      style={[
                        s.chatMetaRow,
                        isRight ? {flexDirection: 'row-reverse'} : {},
                      ]}>
                      <Text
                        style={[
                          s.chatAuthor,
                          isRight ? {color: colors.primary} : {},
                        ]}>
                        {msg.author}
                      </Text>
                      <Text style={s.chatWhen}>{msg.when}</Text>
                    </View>
                    <Text style={s.chatText}>{msg.text}</Text>
                  </View>

                  {isRight && (
                    <View style={[s.avatar, s.avatarRight]}>
                      <Feather name="user" size={16} color={colors.primary} />
                    </View>
                  )}
                </View>
              )
            })}
          </View>

          <View style={s.commentComposer}>
            <TextInput
              placeholder="Add a comment..."
              placeholderTextColor="#9ca3af"
              value={comment}
              onChangeText={setComment}
              style={s.commentInput}
              multiline
            />
            <Pressable onPress={sendComment} style={s.sendBtn} hitSlop={10}>
              <Feather name="send" size={18} color={colors.white} />
            </Pressable>
          </View>
        </View>
      </ScrollView>

      <View style={s.bottomBar}>
        {/* Rate Button */}
        <Pressable
          onPress={() => setRateModalVisible(true)}
          style={[s.bottomBtn, s.bottomBtnPrimary]}>
          <Feather name="star" size={18} color={colors.white} />
          <Text style={[s.bottomBtnText, s.bottomBtnTextPrimary]}>Rate</Text>
        </Pressable>
        {/* Appeal Button */}
        <Pressable
          onPress={() => setAppealModalVisible(true)}
          style={[s.bottomBtn, s.bottomBtnDangerOutline]}>
          <Feather name="flag" size={18} color={'#9d3224'} />
          <Text style={[s.bottomBtnText, s.bottomBtnTextDanger]}>Appeal</Text>
        </Pressable>

        {/* Rate Modal */}
        <Modal
          transparent
          visible={rateModalVisible}
          animationType="fade"
          onRequestClose={() => setRateModalVisible(false)}>
          <View style={s.modalBackdrop}>
            <View style={s.modalContent}>
              <Text style={s.modalTitle}>Rate your experience</Text>
              {/* Simple integer rating, e.g., from 1 to 5 */}
              <View style={s.rateStarsRow}>
                {[1, 2, 3, 4, 5].map(val => (
                  <Pressable key={val} onPress={() => setRate(val)}>
                    <Feather
                      name={rate >= val ? 'star' : 'star'}
                      size={32}
                      color={rate >= val ? colors.primary : '#ccc'}
                      style={{marginHorizontal: 4}}
                      solid={rate >= val}
                    />
                  </Pressable>
                ))}
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                  marginTop: 24,
                }}>
                <Pressable
                  onPress={() => setRateModalVisible(false)}
                  style={s.modalCancelBtn}>
                  <Text style={s.modalCancelText}>Cancel</Text>
                </Pressable>
                <Pressable
                  onPress={async () => {
                    await updateIssueService({rate}) // Call your update method here
                    setRateModalVisible(false)
                  }}
                  style={[
                    s.modalConfirmBtn,
                    {marginLeft: 12, opacity: rate ? 1 : 0.5},
                  ]}
                  disabled={!rate}>
                  <Text style={s.modalConfirmText}>Confirm</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>

        {/* Appeal Modal */}
        <Modal
          transparent
          visible={appealModalVisible}
          animationType="fade"
          onRequestClose={() => setAppealModalVisible(false)}>
          <View style={s.modalBackdrop}>
            <View style={s.modalContent}>
              <Text style={s.modalTitle}>Appeal Decision</Text>
              <TextInput
                placeholder="Enter your appeal reason…"
                value={appealReason}
                onChangeText={setAppealReason}
                style={s.modalTextInput}
                multiline
              />
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                  marginTop: 24,
                }}>
                <Pressable
                  onPress={() => setAppealModalVisible(false)}
                  style={s.modalCancelBtn}>
                  <Text style={s.modalCancelText}>Cancel</Text>
                </Pressable>
                <Pressable
                  onPress={async () => {
                    await updateIssueService({appealReason})
                    setAppealModalVisible(false)
                  }}
                  style={[
                    s.modalConfirmBtn,
                    {marginLeft: 12, opacity: appealReason ? 1 : 0.5},
                  ]}
                  disabled={!appealReason}>
                  <Text style={s.modalConfirmText}>Confirm</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  )
}
