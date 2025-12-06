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

const iconConfig = {
  focused: {
    x: 0,
    transition: { type: 'tween', ease: 'linear' },
  },
  unfocused: { x: 0 },
};

const AnimatedFeatherIcon = posed(Feather)(iconConfig);

const Home = () => {
  const {issues, loadingIssues, loadingMore, hasNextPage, loadMoreIssues} = useIssue();

  const customStyles = styles();

  const handleScroll = useCallback(({ nativeEvent }) => {
    const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
    const paddingToBottom = 20;
    const isCloseToBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
    if (isCloseToBottom && hasNextPage && !loadingMore) {
      loadMoreIssues();
    }
  }, [hasNextPage, loadingMore, loadMoreIssues]);
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
                  <Text style={{marginTop: 10, paddingHorizontal: 16, fontSize: 20, fontWeight: 'bold'}}>{i18n.t("welcome")}</Text>
                  <Button
                      backgroundColor="#24c38b"
                      textColor="white"
                      color="white"
                      label={i18n.t("report_new_grievance")}
                      iconName="plus-circle"
                  />
                  <View style={{flex: 1, marginTop: 30, paddingHorizontal: 16}}>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16}}>
                      <Text style={{fontSize: 18, fontWeight: 'bold', color: '#1f2937'}}>My Recent Grievances</Text>
                    </View>
                    <ScrollView
                      showsVerticalScrollIndicator={false}
                      scrollEventThrottle={16}
                      contentContainerStyle={{paddingBottom: 20}}
                    >
                      {issues && issues.map((issue, index) => (
                        <GrievanceCard key={issue.id || index} issue={issue} />
                      ))}

                      {loadingMore && (
                        <View style={{padding: 20, alignItems: 'center'}}>
                          <ActivityIndicator size="small" color={colors.primary} />
                          <Text style={{marginTop: 8, color: colors.secondary, fontSize: 14}}>
                            {i18n.t("load_more")}
                          </Text>
                        </View>
                      )}

                      {!hasNextPage && issues && issues.length > 0 && (
                        <View style={{padding: 20, alignItems: 'center'}}>
                          <Text style={{color: colors.secondary, fontSize: 14}}>
                            {i18n.t("no_grievances_to_load")}
                          </Text>
                        </View>
                      )}
                    </ScrollView>
                  </View>


                </View>
            )
        }
      </SafeAreaView>
  );
};

export default Home;
