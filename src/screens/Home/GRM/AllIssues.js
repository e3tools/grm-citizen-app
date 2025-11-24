import { Feather } from "@expo/vector-icons";
import React, { useCallback } from "react";
import { ActivityIndicator, SafeAreaView, ScrollView, Text, View } from "react-native";
import posed from "react-native-pose";
import Button from "../../../components/CustomButton";
import GrievanceCard from "../../../components/GrievanceCard";
import { useIssue } from "../../../hooks/useIssue";
import { i18n } from "../../../translations/i18n";
import { colors } from "../../../utils/colors";
import { styles } from "./GRM.style";
import IssueList from "../components/IssueList";
import {useNavigation} from "@react-navigation/native";

const iconConfig = {
  focused: {
    x: 0,
    transition: { type: 'tween', ease: 'linear' },
  },
  unfocused: { x: 0 },
};

const AnimatedFeatherIcon = posed(Feather)(iconConfig);

const AllIssues = () => {
  const {issues, loadingIssues, loadingMore, hasNextPage, loadMoreIssues} = useIssue();
  const navigation = useNavigation();

  const customStyles = styles();

  return (
      <SafeAreaView style={customStyles.container}>
        {loadingIssues && (
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
        {!loadingIssues && (!issues || issues.length === 0) ?
            (<View
                style={{flex: 1, alignContent: 'center', justifyContent: 'center', alignItems: 'center', padding: 20}}>
              <View style={{backgroundColor: '#f3f4f6', borderRadius: '50%', padding: '40'}}>
                <AnimatedFeatherIcon
                    name="frown"
                    size={50}
                    color={'#9da3ae'}
                />
              </View>
              <Text style={{marginTop: 10, fontSize: 20, fontWeight: 'bold'}}>{ i18n.t("no_grievances_yet")}</Text>
              <Text style={{marginTop: 10, fontSize: 16, color: '#747985', textAlign: 'center'}}>
                {i18n.t("no_grievances")}
              </Text>
              <Button
                  backgroundColor="#24c38b"
                  textColor="white"
                  color="white"
                  label={i18n.t("report_grievance")}
              />
            </View>)
            :
            (
                <View style={{flex: 1}}>
                  <View style={{flex: 1, marginTop: 30, paddingHorizontal: 16}}>
                    <IssueList
                        loadingMore={loadingMore}
                        issues={issues}
                        hasNextPage={hasNextPage}
                        loadMoreIssues={loadMoreIssues}
                    ></IssueList>
                  </View>


                </View>
            )
        }
      </SafeAreaView>
  );
};

export default AllIssues;
