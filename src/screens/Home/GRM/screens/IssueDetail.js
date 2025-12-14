import { Feather } from "@expo/vector-icons";
import React from "react";
import { ActivityIndicator, SafeAreaView, Text, View } from "react-native";
import posed from "react-native-pose";
import { i18n } from "../../../../translations/i18n";
import { colors } from "../../../../utils/colors";
import {useNavigation, useRoute} from "@react-navigation/native";
import { useIssue } from "../../../../hooks/useIssue";
import { formatDate } from "../../../../utils/date";
import { getStatusInfo } from "../../../../utils/issue";
import { styles } from "../GRM.style";
import IssueComments from "../../components/issueComments";
import IssueAttachments from "../../components/issueAttachments";


const iconConfig = {
  focused: {
    x: 0,
    transition: { type: 'tween', ease: 'linear' },
  },
  unfocused: { x: 0 },
};

const AnimatedFeatherIcon = posed(Feather)(iconConfig);

const IssueDetail = () => {
  const route = useRoute();
  const id = route.params['id'];
  const navigation = useNavigation();

  const {
    issue,
    loadingIssue,
    issueComments,
    loadingIssueComments,
    issueAttachments,
    loadingIssueAttachments,
    loadMoreIssueComments,
    commentsHasNextPage,
    loadingIssueCommentsMore,
  } = useIssue(id);
  let customStyles = styles();
  customStyles = {
    ...customStyles,
    detailTableRow: {
      flexDirection: 'row',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 0,
      paddingVertical: 8,
      borderStyle: 'solid',
      borderColor: colors.lightgray,
      borderBottomWidth: 1
    },
    detailTableTitle: {
      color: colors.secondary,
      fontSize: 16
    },
    detailTableValue: {
      fontSize: 16
    }
  };
  return (
      <SafeAreaView style={customStyles.container}>
        {loadingIssue && (
              <View
                style={{
                  zIndex: 20,
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(0,0,0,0.6)',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <ActivityIndicator color={colors.primary} />
              </View>
        )}
        {!loadingIssue && issue ?
            (
                <View
                style={{flex: 1, alignContent: 'start', justifyContent: 'start', alignItems: 'start', padding: 20}}>
                  <View style={{
                    backgroundColor: '#fff',
                    borderStyle: 'solid',
                    borderWidth: 1,
                    borderColor: colors.lightgray,
                    borderRadius: 8,
                    paddingHorizontal: 16,
                  }}>
                    <View style={customStyles.detailTableRow}>
                      <Text style={customStyles.detailTableTitle}>{i18n.t('date_submission')}</Text>
                      <Text style={customStyles.detailTableValue}>{ formatDate(issue.intake_date) }</Text>
                    </View >
                    <View style={customStyles.detailTableRow}>
                      <Text style={customStyles.detailTableTitle}>{i18n.t('issue_date')}</Text>
                      <Text style={customStyles.detailTableValue}>{ formatDate(issue.created_date) }</Text>
                    </View>
                    <View style={customStyles.detailTableRow}>
                      <Text style={customStyles.detailTableTitle}>{i18n.t('issue_type')}</Text>
                      <Text style={customStyles.detailTableValue}>{ i18n.t(issue.issue_type.name.toLowerCase())}</Text>
                    </View>
                    <View style={[customStyles.detailTableRow, { borderBottomWidth: 0 }]}>
                      <Text style={customStyles.detailTableTitle}>{i18n.t('status')}</Text>
                      <View style={[customStyles.statusTag, { backgroundColor: getStatusInfo(issue.status).color }]}>
                        <Text style={[customStyles.statusText, { color: getStatusInfo(issue.status).textColor }]}>
                          {  getStatusInfo(issue.status).text }
                        </Text>
                      </View>
                    </View>
                  </View>
                  <Text style={{marginTop: 20, fontSize: 18, fontWeight: 'bold'}}>{ i18n.t("description")}</Text>
                  <Text style={{marginTop: 10, fontSize: 18 }}>{ issue.description }</Text>

                  <SafeAreaView  style={customStyles.container}>
                      <View style={{ marginTop: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                        <Text style={{fontSize: 18, fontWeight: 'bold'}}>{ i18n.t("attachments")}</Text>
                        { issue && issue.id && (
                            <Text style={{ marginLeft: 'auto', fontSize: 14, color: colors.primary}}
                                  onPress={() => navigation.navigate('All issue attachments', { id: issue.id })}
                            >{i18n.t("view_all")}</Text>
                          )
                        }

                      </View>

                      {loadingIssueAttachments && (
                            <View
                              style={{
                                zIndex: 20,
                                position: 'absolute',
                                left: 0,
                                right: 0,
                                top: 0,
                                bottom: 0,
                                backgroundColor: 'white',
                                justifyContent: 'center',
                                alignItems: 'center',
                              }}
                            >
                              <ActivityIndicator color={colors.primary} />
                            </View>
                      )}
                      {!loadingIssueAttachments && (!issueAttachments || issueAttachments.length === 0) ?
                          (
                            <View
                              style={{flex: 1, alignContent: 'center', justifyContent: 'start', alignItems: 'center', padding: 20}}
                            >
                              <Text style={{ fontSize: 16, color: '#747985', textAlign: 'center'}}>
                                { i18n.t("no_attachments_yet") }
                              </Text>
                            </View>
                          )
                          :
                          (
                              <View style={{flex: 1}}>
                                <View style={{flex: 1, marginTop: 10 }}>
                                    <IssueAttachments
                                        issueId={issue?.id}
                                        attachments={[issueAttachments[0]]}
                                    ></IssueAttachments>
                                </View>
                              </View>
                          )
                      }
                   </SafeAreaView>

                  <SafeAreaView style={customStyles.container}>
                      <Text style={{ fontSize: 18, fontWeight: 'bold'}}>{ i18n.t("case_timeline")}</Text>
                      {loadingIssueComments && (
                            <View
                              style={{
                                zIndex: 20,
                                position: 'absolute',
                                left: 0,
                                right: 0,
                                top: 0,
                                bottom: 0,
                                backgroundColor: 'white',
                                justifyContent: 'center',
                                alignItems: 'center',
                              }}
                            >
                              <ActivityIndicator color={colors.primary} />
                            </View>
                      )}
                      {!loadingIssueComments && (!issueComments || issueComments.length === 0) ?
                          (
                            <View
                              style={{flex: 1, alignContent: 'center', justifyContent: 'start', alignItems: 'center', padding: 20}}
                            >
                              <Text style={{ fontSize: 16, color: '#747985', textAlign: 'center'}}>
                                { i18n.t("no_comments_yet") }
                              </Text>
                            </View>
                          )
                          :
                          (
                              <View style={{flex: 1}}>
                                <View style={{flex: 1, marginTop: 10 }}>
                                  <IssueComments
                                      issueId={issue?.id}
                                      comments={issueComments}
                                      loadMoreIssueComments={loadMoreIssueComments}
                                      commentsHasNextPage={commentsHasNextPage}
                                      loadingIssueCommentsMore={loadingIssueCommentsMore}
                                  ></IssueComments>
                                </View>
                              </View>
                          )
                      }
                   </SafeAreaView>
            </View>
                )
            :
                (
                    <View
                    style={{flex: 1, alignContent: 'center', justifyContent: 'center', alignItems: 'center', padding: 20}}>
                      <View style={{backgroundColor: '#f3f4f6', borderRadius: '50%', padding: '40'}}>
                        <AnimatedFeatherIcon
                            name="frown"
                            size={50}
                            color={'#9da3ae'}
                        />
                      </View>
                      <Text style={{marginTop: 10, fontSize: 20, fontWeight: 'bold'}}>{ i18n.t("no_grievances_yet")}</Text>
                    </View>
                )
            }
          </SafeAreaView>
  );
};

export default IssueDetail;
