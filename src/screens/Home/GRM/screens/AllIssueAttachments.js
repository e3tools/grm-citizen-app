import { Feather } from "@expo/vector-icons";
import React from "react";
import { ActivityIndicator, SafeAreaView, Text, View } from "react-native";
import posed from "react-native-pose";
import { i18n } from "../../../../translations/i18n";
import { colors } from "../../../../utils/colors";
import { styles } from "../GRM.style";
import IssueAttachments from "../../components/issueAttachments";
import {useIssue} from "../../../../hooks/useIssue";
import {useRoute} from "@react-navigation/native";

const iconConfig = {
  focused: {
    x: 0,
    transition: { type: 'tween', ease: 'linear' },
  },
  unfocused: { x: 0 },
};

const AnimatedFeatherIcon = posed(Feather)(iconConfig);

const AllIssueAttachments = () => {
  const route = useRoute();
  const id = route.params['id'];
  const {
    issueAttachments,
    attachmentsHasNextPage,
    loadMoreIssueAttachments,
    loadingIssueAttachments,
    loadingIssueCommentsMore
  } = useIssue(id);

  const customStyles = styles();

  return (
      <SafeAreaView style={customStyles.container}>
        {loadingIssueAttachments && (
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
        {!loadingIssueAttachments && (!issueAttachments || issueAttachments.length === 0) ?
            (<View
                style={{flex: 1, alignContent: 'center', justifyContent: 'center', alignItems: 'center', padding: 20}}>
              <View style={{backgroundColor: '#f3f4f6', borderRadius: '50%', padding: '40'}}>
                <AnimatedFeatherIcon
                    name="frown"
                    size={50}
                    color={'#9da3ae'}
                />
              </View>
              <Text style={{marginTop: 10, fontSize: 20, fontWeight: 'bold'}}>{ i18n.t("no_attachments_yet")}</Text>
              <Text style={{marginTop: 10, fontSize: 16, color: '#747985', textAlign: 'center'}}>
                {i18n.t("no_attachments")}
              </Text>
            </View>)
            :
            (
                <View style={{flex: 1}}>
                  <View style={{flex: 1, marginTop: 30, paddingHorizontal: 16}}>
                    <IssueAttachments
                        loadMoreIssueAttachments={loadMoreIssueAttachments}
                        loadingIssueAttachmentsMore={loadingIssueCommentsMore}
                        attachments={issueAttachments}
                        attachmentsHasNextPage={attachmentsHasNextPage}
                    ></IssueAttachments>
                  </View>
                </View>
            )
        }
      </SafeAreaView>
  );
};

export default AllIssueAttachments;
