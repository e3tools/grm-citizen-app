import React from 'react'
import {View} from 'react-native'

// Mock SVG component
const SvgMock = ({children, ...props}) => {
  return React.createElement(View, {...props, testID: 'svg-mock'}, children)
}

// Export both default and named export
SvgMock.default = SvgMock
export default SvgMock
export {SvgMock}
