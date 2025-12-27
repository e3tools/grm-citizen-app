import {ActivityIndicator, ScrollView, Text, View} from 'react-native'
import {colors} from '../../../utils/colors'
import {i18n} from '../../../translations/i18n'
import React, {useCallback} from 'react'
import {formatDate} from '../../../utils/date' // Unused in this component
import ImagePreviewCard from '../../../components/ImagePreviewCard'
import RecordingCard from '../../../components/RecordingCard'

const IssueAttachments = ({
  issueId,
  attachments,
  attachmentsHasNextPage,
  loadingIssueAttachmentsMore,
  loadMoreIssueAttachments,
}) => {
  const handleScroll = useCallback(
    ({nativeEvent}) => {
      if (!attachmentsHasNextPage) return

      const {layoutMeasurement, contentOffset, contentSize} = nativeEvent
      const paddingToBottom = 20

      const isCloseToBottom =
        layoutMeasurement.height + contentOffset.y >=
        contentSize.height - paddingToBottom

      if (
        isCloseToBottom &&
        attachmentsHasNextPage &&
        !loadingIssueAttachmentsMore
      ) {
        loadMoreIssueAttachments(issueId)
      }
    },
    [
      attachmentsHasNextPage,
      loadingIssueAttachmentsMore,
      loadMoreIssueAttachments,
      issueId,
    ],
  ) // Added issueId to dependencies

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      scrollEventThrottle={16}
      onScroll={handleScroll}
      style={{flex: 1}}
    >
      {attachments &&
        attachments.length > 0 &&
        attachments.map((attachment, index) => {
          // **CRITICAL FIX: Check if the attachment object is defined**
          if (!attachment) {
            return null // Skip this iteration if the item is undefined or null
          }

          return (
            <View
              style={{
                backgroundColor: colors.disabled,
                padding: 12,
                borderRadius: 8,
                marginBottom: 20,
              }}
              key={index}
            >
              {/* Also using the improved check for 'file' property,
                                      which is also necessary and uses .includes() and .toLowerCase() */}
              {attachment.file &&
              !attachment.file.toLowerCase().includes('jpeg') ? (
                <RecordingCard mode="playback" initialURI={attachment.file} />
              ) : (
                // Renders if it is a JPEG OR if attachment.file is missing/null/undefined
                <ImagePreviewCard uri={attachment.file} id={attachment.id} />
              )}
            </View>
          )
        })}

      {loadingIssueAttachmentsMore && (
        <View style={{padding: 20, alignItems: 'center'}}>
          <ActivityIndicator size="small" color={colors.primary} />
          <Text style={{marginTop: 8, color: colors.secondary, fontSize: 14}}>
            {i18n.t('load_more')}
          </Text>
        </View>
      )}

      {!attachmentsHasNextPage && attachments && attachments.length > 0 && (
        <View style={{paddingHorizontal: 20, alignItems: 'center'}}>
          <Text style={{color: colors.secondary, fontSize: 14}}>
            {i18n.t('no_attachments_to_load')}
          </Text>
        </View>
      )}
    </ScrollView>
  )
}

export default IssueAttachments
