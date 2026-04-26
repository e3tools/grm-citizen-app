import {Feather} from '@expo/vector-icons'
import React from 'react'
import {Text, TouchableOpacity} from 'react-native'
import {colors} from '../utils/colors'

const CustomButton = ({
  label,
  color,
  textColor,
  backgroundColor,
  iconName,
  onPress,
  borderRadius = 10,
  minWidth = 200,
  style = {},
}) => {
  const buttonStyle = {
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 10,
    height: 48,
    minWidth,
    borderWidth: 0,
    borderRadius,
    backgroundColor: backgroundColor || colors.primary || '#24c38b',
    marginTop: 20,
    ...style,
  }

  const textStyle = {
    fontSize: 16,
    fontFamily: 'Poppins_500Medium',
    color: textColor || color || 'white',
  }

  return (
    <TouchableOpacity style={buttonStyle} onPress={onPress} activeOpacity={0.8}>
      {iconName && (
        <Feather
          name={iconName.replace(/'/g, '')}
          size={20}
          color={textColor || color || 'white'}
          style={{marginRight: 8, marginTop: -1}}
        />
      )}
      <Text style={textStyle}>{label}</Text>
    </TouchableOpacity>
  )
}

export default CustomButton
