import React from 'react'
import {StyleSheet, View, Dimensions} from 'react-native'
import {colors} from '../../../utils/colors'
import TextInput from '../../../components/CustomTextInput'

const screenWidth = Dimensions.get('window').width

const SearchBar = props => {
  return (
    <View style={styles.container}>
      <TextInput
        clicked={props.clicked}
        setClicked={props.setClicked}
        searchPhrase={props.searchPhrase}
        setSearchPhrase={props.setSearchPhrase}
      ></TextInput>
    </View>
  )
}

export default SearchBar

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    flexDirection: 'row',
    marginBottom: 10,
    backgroundColor: colors.disabled100,
    borderRadius: 10,
    width: screenWidth - 100,
  },
})
