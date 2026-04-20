import {i18n} from '@/src/translations/i18n'
import {Feather} from '@expo/vector-icons'
import {useNavigation} from '@react-navigation/native'
import React, {useMemo, useState} from 'react'
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native'
import {colors} from '../../../utils/colors'
import styles from './ExistingCaseDetails.style'

export default function ExistingCaseDetails() {
  const navigation = useNavigation<any>()
  const [comment, setComment] = useState('')
  const s = styles as any

  const data = useMemo(
    () => ({
      status: 'RESOLVED',
      title: 'Unresolved Pothole Issue',
      caseNumberLabel: 'Case #GR-',
      caseNumber: '9920',
      dateOfSubmission: 'Oct 24, 2023',
      caseType: 'Grievance',
      description:
        'A large, deep pothole has developed near the intersection of Main St and 5th Ave. It is causing significant traffic delays and poses a danger to cyclists and motorcyclists. Multiple vehicles have sustained tire damage.',
      progress: [
        {
          key: 'resolved',
          title: 'Resolved',
          subtitle: 'Maintenance crew repaired the site.',
          date: 'Nov 02',
          icon: 'check-circle',
          active: true,
        },
        {
          key: 'under_review',
          title: 'Under Review',
          subtitle: 'Assigned to Road Maintenance Dept.',
          date: 'Oct 26',
          icon: 'clipboard',
          active: false,
        },
        {
          key: 'reported',
          title: 'Reported',
          subtitle: 'Case successfully submitted.',
          date: 'Oct 24',
          icon: 'flag',
          active: false,
        },
      ],
      attachmentsCount: 3,
      updates: [
        {
          key: 'u1',
          author: 'Officer Sarah Jenkins',
          role: 'Officer',
          text: 'Verification complete. Maintenance crew has been scheduled for repair on Nov 2nd.',
          when: '2d ago',
          side: 'left' as const,
        },
        {
          key: 'u2',
          author: 'You',
          role: 'You',
          text: 'Thank you for the quick update.\nLooking forward to the fix.',
          when: '3d ago',
          side: 'right' as const,
        },
      ],
    }),
    [],
  )

  return (
    <SafeAreaView style={s.screen}>
      <ScrollView
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={s.card}>
          <View style={s.cardHeaderRow}>
            <View style={s.statusPill}>
              <Text style={s.statusPillText}>{data.status}</Text>
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
              <Text style={s.metaLabel}>{i18n.t('dateOfSubmission')}</Text>
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
                      ]}
                    >
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
              hitSlop={10}
              onPress={() => {
                // Keep navigation optional; if route isn't wired yet, this is a no-op.
                try {
                  navigation.navigate('All issue attachments')
                } catch (e) {}
              }}
            >
              <Text style={s.viewAllLink}>View All</Text>
            </Pressable>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={s.attachmentsRow}
          >
            {[0, 1, 2].map(i => (
              <View key={i} style={s.attachmentThumb}>
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
                  style={[s.chatRow, isRight ? s.chatRowRight : s.chatRowLeft]}
                >
                  {!isRight && (
                    <View style={s.avatar}>
                      <Feather name="shield" size={16} color={colors.primary} />
                    </View>
                  )}

                  <View
                    style={[
                      s.chatBubble,
                      isRight ? s.chatBubbleRight : s.chatBubbleLeft,
                    ]}
                  >
                    <View
                      style={[
                        s.chatMetaRow,
                        isRight ? {flexDirection: 'row-reverse'} : {},
                      ]}
                    >
                      <Text
                        style={[
                          s.chatAuthor,
                          isRight ? {color: colors.tertiary} : {},
                        ]}
                      >
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
            <Pressable
              onPress={() => setComment('')}
              style={s.sendBtn}
              hitSlop={10}
            >
              <Feather name="send" size={18} color={colors.white} />
            </Pressable>
          </View>
        </View>
      </ScrollView>

      <View style={s.bottomBar}>
        <Pressable style={[s.bottomBtn, s.bottomBtnPrimary]}>
          <Feather name="star" size={18} color={colors.white} />
          <Text style={[s.bottomBtnText, s.bottomBtnTextPrimary]}>Rate</Text>
        </Pressable>
        <Pressable style={[s.bottomBtn, s.bottomBtnDangerOutline]}>
          <Feather name="flag" size={18} color={'#9d3224'} />
          <Text style={[s.bottomBtnText, s.bottomBtnTextDanger]}>Appeal</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  )
}
