import {Feather} from '@expo/vector-icons'
import React, {useEffect, useState} from 'react'
import {ActivityIndicator, SafeAreaView, Text, View} from 'react-native'
import posed from 'react-native-pose'
import Button from '../../../../components/CustomButton'
import {useIssueList} from '../../../../hooks/useIssueList'
import {i18n} from '../../../../translations/i18n'
import {colors} from '../../../../utils/colors'
import {styles} from '../GRM.style'
import IssueList from '../../components/IssueList'
import SearchBar from '../../components/SearchBar'

const iconConfig = {
  focused: {
    x: 0,
    transition: {type: 'tween', ease: 'linear'},
  },
  unfocused: {x: 0},
}

const AnimatedFeatherIcon = posed(Feather)(iconConfig)

const AllIssues = () => {
  const {
    issues,
    loadingIssues,
    loadingMore,
    hasNextPage,
    getIssueList,
    loadMoreIssues,
  } = useIssueList()
  const [searchPhrase, setSearchPhrase] = useState(null)
  const [clicked, setClicked] = useState(false)
  const customStyles = styles()
  useEffect(() => {
    if (searchPhrase && searchPhrase.length > 3) {
      getIssueList(searchPhrase)
    } else if (!searchPhrase) {
      getIssueList(null)
    }
  }, [searchPhrase])

  useEffect(() => {
    setSearchPhrase(null)
    getIssueList(searchPhrase)
  }, [clicked])
  return (
    <SafeAreaView style={customStyles.container}>
      <View
        style={{
          flex: 1,
          padding: 20,
        }}
      >
        <SearchBar
          searchPhrase={searchPhrase}
          setSearchPhrase={setSearchPhrase}
          clicked={clicked}
          setClicked={setClicked}
        />
        {loadingIssues ? (
          <>
            <ActivityIndicator color={colors.primary} />
          </>
        ) : !loadingIssues && (!issues || issues.length === 0) ? (
          <View
            style={{
              flex: 1,
              alignContent: 'center',
              justifyContent: 'center',
              alignItems: 'center',
              padding: 20,
            }}
          >
            <View
              style={{
                backgroundColor: '#f3f4f6',
                borderRadius: '50%',
                padding: '40',
              }}
            >
              <AnimatedFeatherIcon name="frown" size={50} color={'#9da3ae'} />
            </View>

            <Text
              style={{
                marginTop: 10,
                fontSize: 20,
                fontWeight: 'bold',
                textAlign: 'center',
              }}
            >
              {i18n.t('no_grievances_yet')}
            </Text>
            <Text
              style={{
                marginTop: 10,
                fontSize: 16,
                color: '#747985',
                textAlign: 'center',
              }}
            >
              {i18n.t('no_grievances')}
            </Text>
            <Button
              backgroundColor="#24c38b"
              textColor="white"
              color="white"
              label={i18n.t('report_grievance')}
            />
          </View>
        ) : (
          <View style={{flex: 1}}>
            <View style={{flex: 1, paddingHorizontal: 16}}>
              <IssueList
                loadingMore={loadingMore}
                issues={issues}
                hasNextPage={hasNextPage}
                loadMoreIssues={loadMoreIssues}
              ></IssueList>
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  )
}

export default AllIssues
