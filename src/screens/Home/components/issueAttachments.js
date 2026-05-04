import React, {useCallback, useState} from 'react'
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import {Gesture, GestureDetector} from 'react-native-gesture-handler'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated'
import ImagePreviewCard from '../../../components/ImagePreviewCard'
import RecordingCard from '../../../components/RecordingCard'
import {i18n} from '../../../translations/i18n'
import {colors} from '../../../utils/colors'
import {isImageFormat} from '../../../utils/formUtils'

const IssueAttachments = ({
  issueId,
  attachments,
  attachmentsHasNextPage,
  loadingIssueAttachmentsMore,
  loadMoreIssueAttachments,
}) => {
  const [maximizedImage, setMaximizedImage] = useState()
  const scale = useSharedValue(1)
  const savedScale = useSharedValue(1)

  const pinchGesture = Gesture.Pinch()
    .onUpdate(e => {
      scale.value = savedScale.value * e.scale
    })
    .onEnd(() => {
      savedScale.value = 1
      scale.value = 1
    })

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}],
  }))

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
    <View style={{flex: 1, position: 'relative'}}>
      {maximizedImage && (
        <View
          style={{
            position: 'absolute',
            zIndex: 99,
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: colors.white,
          }}
        >
          <GestureDetector gesture={pinchGesture}>
            <Animated.View
              style={[
                {
                  flex: 1,
                  zIndex: 10,
                  backgroundColor: colors.white,
                  width: '100%',
                  height: '100%',
                  justifyContent: 'center',
                  alignItems: 'center',
                },
                animatedStyle,
              ]}
            >
              <Image
                resizeMode="contain"
                style={{width: '100%', height: '100%'}}
                source={{uri: maximizedImage.file}}
              />
              {/* Close Button */}
              <TouchableOpacity
                style={{
                  position: 'absolute',
                  top: 30,
                  right: 20,
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  borderRadius: 20,
                  padding: 8,
                  zIndex: 20,
                }}
                onPress={() => setMaximizedImage(undefined)}
              >
                <Text
                  style={{color: 'white', fontSize: 18, fontWeight: 'bold'}}
                >
                  ×
                </Text>
              </TouchableOpacity>
            </Animated.View>
          </GestureDetector>
        </View>
      )}
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
                  alignItems: 'center',
                }}
                key={index}
              >
                {/* Also using the improved check for 'file' property,
                                      which is also necessary and uses .includes() and .toLowerCase() */}
                {attachment.file &&
                !isImageFormat(attachment.file.toLowerCase()) ? (
                  <RecordingCard mode="playback" initialURI={attachment.file} />
                ) : (
                  // Renders if it is a JPEG OR if attachment.file is missing/null/undefined
                  <TouchableOpacity
                    style={{flex: 1}}
                    onPress={() => {
                      setMaximizedImage(attachment)
                    }}
                  >
                    <ImagePreviewCard
                      uri={attachment.file}
                      id={attachment.id}
                    />
                  </TouchableOpacity>
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
    </View>
  )
}

export default IssueAttachments
