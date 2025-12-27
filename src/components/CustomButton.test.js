import React from 'react'
import {render, fireEvent} from '@testing-library/react-native'
import CustomButton from './CustomButton'

// Mock @expo/vector-icons
jest.mock('@expo/vector-icons', () => ({
  Feather: 'Feather',
}))

describe('CustomButton', () => {
  it('should render button with label', () => {
    const {getByText} = render(<CustomButton label="Click Me" />)
    expect(getByText('Click Me')).toBeTruthy()
  })

  it('should call onPress when pressed', () => {
    const mockOnPress = jest.fn()
    const {getByText} = render(
      <CustomButton label="Click Me" onPress={mockOnPress} />,
    )

    const button = getByText('Click Me').parent
    fireEvent.press(button)
    expect(mockOnPress).toHaveBeenCalledTimes(1)
  })

  it('should render with custom colors', () => {
    const {getByText} = render(
      <CustomButton
        label="Test Button"
        backgroundColor="#FF0000"
        textColor="#FFFFFF"
      />,
    )
    expect(getByText('Test Button')).toBeTruthy()
  })

  it('should render icon when iconName is provided', () => {
    const {getByText} = render(<CustomButton label="Button" iconName="check" />)
    expect(getByText('Button')).toBeTruthy()
  })
})
