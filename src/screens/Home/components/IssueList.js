import GrievanceCard from '../../../components/GrievanceCard'
import {ActivityIndicator, ScrollView, Text, View} from 'react-native'
import {colors} from '../../../utils/colors'
import {i18n} from '../../../translations/i18n'
import React, {useCallback} from 'react'

const IssueList = ({issues, hasNextPage, loadingMore, loadMoreIssues}) => {
  const handleScroll = useCallback(
    ({nativeEvent}) => {
      const {layoutMeasurement, contentOffset, contentSize} = nativeEvent
      const paddingToBottom = 20
      const isCloseToBottom =
        layoutMeasurement.height + contentOffset.y >=
        contentSize.height - paddingToBottom
      if (isCloseToBottom && hasNextPage && !loadingMore) {
        loadMoreIssues()
      }
    },
    [hasNextPage, loadingMore, loadMoreIssues],
  )
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      scrollEventThrottle={16}
      contentContainerStyle={{paddingBottom: 20}}
    >
      {issues &&
        issues.map((issue, index) => (
          <GrievanceCard key={issue.id || index} issue={issue} />
        ))}

      {loadingMore && (
        <View style={{padding: 20, alignItems: 'center'}}>
          <ActivityIndicator size="small" color={colors.primary} />
          <Text style={{marginTop: 8, color: colors.secondary, fontSize: 14}}>
            {i18n.t('load_more')}
          </Text>
        </View>
      )}

      {!hasNextPage && issues && issues.length > 0 && (
        <View style={{padding: 20, alignItems: 'center'}}>
          <Text style={{color: colors.secondary, fontSize: 14}}>
            {i18n.t('no_grievances_to_load')}
          </Text>
        </View>
      )}
    </ScrollView>
  )
}

export default IssueList
