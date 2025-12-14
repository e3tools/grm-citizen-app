import {ActivityIndicator, ScrollView, Text, View} from "react-native";
import {colors} from "../../../utils/colors";
import {i18n} from "../../../translations/i18n";
import React, {useCallback} from "react";
import {formatDate} from "../../../utils/date";

const IssueComments = ({issueId, comments, commentsHasNextPage, loadingIssueCommentsMore, loadMoreIssueComments}) => {
    const handleScroll = useCallback(({ nativeEvent }) => {
    const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
    const paddingToBottom = 20;
    const isCloseToBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
    if (isCloseToBottom && commentsHasNextPage && !loadingIssueCommentsMore) {
      loadMoreIssueComments(issueId);
    }
  }, [commentsHasNextPage, loadingIssueCommentsMore, loadMoreIssueComments]);
    return <ScrollView
                      showsVerticalScrollIndicator={false}
                      scrollEventThrottle={16}
                      contentContainerStyle={{paddingBottom: 20}}
                      onScroll={handleScroll}
                    >
                      {comments && comments.map((comment, index) => (
                          <View style={{
                            backgroundColor: colors.disabled,
                            padding: 12,
                            borderRadius: 8,
                            marginBottom: 20
                          }}
                          key={index}>
                             <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                                <Text style={{ fontWeight: 'bold'}}> {comment.user.name }</Text>
                                <Text style={{ color: colors.secondary}}> { formatDate(comment.created_date, {month: 'numeric',  day: 'numeric', year: 'numeric' }) }</Text>
                             </View>
                             <Text style={{ paddingHorizontal: 4, paddingTop: 10 }}>{ comment.comment}</Text>
                          </View>
                      ))}

                      {loadingIssueCommentsMore && (
                        <View style={{padding: 20, alignItems: 'center'}}>
                          <ActivityIndicator size="small" color={colors.primary} />
                          <Text style={{marginTop: 8, color: colors.secondary, fontSize: 14}}>
                            {i18n.t("load_more")}
                          </Text>
                        </View>
                      )}

                      {!commentsHasNextPage && comments && comments.length > 0 && (
                        <View style={{padding: 20, alignItems: 'center'}}>
                          <Text style={{color: colors.secondary, fontSize: 14}}>
                            {i18n.t("no_comments_to_load")}
                          </Text>
                        </View>
                      )}
                    </ScrollView>
}

export default IssueComments;