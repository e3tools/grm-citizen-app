// Fallback for using MaterialIcons on Android and web.

import {
  Feather,
  MaterialCommunityIcons,
  MaterialIcons,
} from '@expo/vector-icons'
import {SymbolViewProps, SymbolWeight} from 'expo-symbols'
import {ComponentProps} from 'react'
import {OpaqueColorValue, type StyleProp, type TextStyle} from 'react-native'

type MaterialIconMapping = Record<
  SymbolViewProps['name'],
  ComponentProps<typeof MaterialIcons>['name']
>

type FeatherIconMapping = Record<
  SymbolViewProps['name'],
  ComponentProps<typeof Feather>['name']
>

type MaterialCommunityIconMapping = Record<
  SymbolViewProps['name'],
  ComponentProps<typeof MaterialCommunityIcons>['name']
>

type IconSymbolName =
  | keyof typeof MATERIAL_MAPPING
  | keyof typeof FEATHER_MAPPING
  | keyof typeof MATERIAL_COMMUNITY_MAPPING

/**
 * Add your SF Symbols to Material Icons mappings here.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */

const MATERIAL_MAPPING = {
  'house.fill': 'home',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
  'chevron.down': 'arrow-downward',
  calendar: 'calendar-today',
  mic: 'mic-none',
  xmark: 'close',
  'stop.circle': 'stop-circle',
  video: 'videocam',
  'apple.image.playground.fill': 'image',
  document: 'file-present',
} as MaterialIconMapping

const FEATHER_MAPPING = {
  camera: 'camera',
} as FeatherIconMapping

const MATERIAL_COMMUNITY_MAPPING = {
  cloud: 'cloud-upload-outline',
  'camera.rotate.fill': 'camera-flip',
} as MaterialCommunityIconMapping

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to Material Icons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName
  size?: number
  color: string | OpaqueColorValue
  style?: StyleProp<TextStyle>
  weight?: SymbolWeight
}) {
  if (Object.keys(FEATHER_MAPPING).some(value => value === name)) {
    return (
      <Feather
        color={color}
        size={size}
        name={FEATHER_MAPPING[name]}
        style={style}
      />
    )
  }

  if (Object.keys(MATERIAL_COMMUNITY_MAPPING).some(value => value === name)) {
    return (
      <MaterialCommunityIcons
        color={color}
        size={size}
        name={MATERIAL_COMMUNITY_MAPPING[name]}
        style={style}
      />
    )
  }
  return (
    <MaterialIcons
      color={color}
      size={size}
      name={MATERIAL_MAPPING[name]}
      style={style}
    />
  )
}
