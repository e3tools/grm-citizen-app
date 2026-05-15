import React from 'react'
import {fireEvent, render} from '@testing-library/react-native'

import CreateIssue from './CreateIssue'

const mockNavigate = jest.fn()

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}))

jest.mock('../../../translations/i18n', () => ({
  i18n: {
    t: key => key,
  },
}))

jest.mock('../../../components/CheckboxCard', () => () => null)
jest.mock('../../../components/Stepper', () => () => null)
jest.mock('../../../components/CustomButton', () => {
  const React = require('react')
  const {Pressable, Text} = require('react-native')
  return ({label, onPress}) => (
    <Pressable onPress={onPress}>
      <Text>{label}</Text>
    </Pressable>
  )
})

jest.mock('react-native-pose', () => ({
  __esModule: true,
  default: () => () => 'AnimatedIcon',
}))

describe('CreateIssue flow', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders first step and allows continuing to new case details', () => {
    const {getByText} = render(<CreateIssue />)

    expect(getByText('create_issue_step_1')).toBeTruthy()
    fireEvent.press(getByText('save_and_continue'))

    expect(mockNavigate).toHaveBeenCalledWith('new_case_details', {
      securityLevelDetails: {
        age: true,
        citizen_group_1: true,
        citizen_group_2: true,
        gender: true,
        name: true,
        type: 'on_behalf_of_someone',
      },
    })
  })
})
