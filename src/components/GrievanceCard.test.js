import {fireEvent, render} from '@testing-library/react-native'
import React from 'react'
import GrievanceCard from './GrievanceCard'

// Mock navigation
const mockNavigate = jest.fn()
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}))

// Mock i18n
jest.mock('../translations/i18n', () => ({
  i18n: {
    t: key => key,
  },
}))

describe('GrievanceCard (Option 2: Component Test)', () => {
  const mockIssue = {
    id: 1,
    tracking_code: 'GRM-001',
    intake_date: '2024-01-15',
    status: {
      name: 'submitted',
    },
    issue_type: {
      name: 'Grievance',
    },
  }

  it('should render issue tracking code', () => {
    const {getByText} = render(<GrievanceCard issue={mockIssue} />)
    expect(getByText('GRM-001')).toBeTruthy()
  })

  it('should navigate when card is pressed', () => {
    const {getByText} = render(<GrievanceCard issue={mockIssue} />)
    const card = getByText('GRM-001').parent.parent

    fireEvent.press(card)
    expect(mockNavigate).toHaveBeenCalledWith('Issue detail', {id: 1})
  })

  it('should display issue type', () => {
    const {getByText} = render(<GrievanceCard issue={mockIssue} />)
    // i18n.t will return the key if translation not found
    expect(getByText('grievance')).toBeTruthy()
  })
})
