import {colors} from '@/src/utils/colors'
import {StyleSheet, TextInput, View} from 'react-native'
import {Entypo, Feather} from '@expo/vector-icons'
import React from 'react'
import {i18n} from '@/src/translations/i18n'

const CustomTextInput = ({
  clicked = false,
  setClicked,
  searchPhrase,
  setSearchPhrase,
}) => {
  return (
    <View
      style={!clicked ? styles.searchBarUnclicked : styles.searchBarClicked}
    >
      <Feather
        name="search"
        size={20}
        color={colors.primary}
        style={{paddingLeft: 10}}
      />
      <TextInput
        theme={{
          roundness: 10,
          colors: {
            primary: colors.primary,
            placeholder: colors.lightgray,
            text: colors.darkGrey,
            onSurface: colors.darkGrey,
            background: colors.white,
          },
        }}
        mode="flat"
        placeholder={i18n.t('search')}
        placeholderTextColor={colors.secondary}
        underlineColor={colors.lightgray}
        activeUnderlineColor={colors.primary}
        selectionColor={colors.primary}
        style={styles.input}
        onChangeText={setSearchPhrase}
        value={searchPhrase}
        onFocus={() => {
          setClicked(true)
        }}
      />

      {clicked && (
        <Entypo
          name="cross"
          size={20}
          color={colors.primary}
          style={{padding: 1}}
          onPress={() => {
            setSearchPhrase('')
          }}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    width: '90%',
    fontFamily: 'Poppins_400Regular',
  },
  searchBarUnclicked: {
    flexDirection: 'row',
    width: '90%',
    backgroundColor: colors.disabled100,
    borderRadius: 10,
    alignItems: 'center',
  },
  searchBarClicked: {
    flexDirection: 'row',
    width: '90%',
    backgroundColor: colors.disabled100,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  input: {
    width: '90%',
    borderRadius: 10,
    fontSize: 14,
    color: '#707070',
    paddingVertical: 10,
    height: 40,
    borderColor: colors.disabled100,
    backgroundColor: colors.disabled100,
    borderWidth: 1,
  },
})

export default CustomTextInput
