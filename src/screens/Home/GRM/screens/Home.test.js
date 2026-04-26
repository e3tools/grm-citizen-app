import React from 'react'
import {fireEvent, render} from '@testing-library/react-native'

import Home from './Home'

const mockNavigate = jest.fn()

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
    reset: jest.fn(),
  }),
}))

jest.mock('../../../../hooks/useIssueList', () => ({
  useIssueList: () => ({
    issues: [],
    loadingIssues: false,
    loadingMore: false,
    hasNextPage: false,
    loadMoreIssues: jest.fn(),
  }),
}))

jest.mock('../../../../translations/i18n', () => ({
  i18n: {
    t: key => key,
  },
}))

jest.mock('react-native-pose', () => ({
  __esModule: true,
  default: () => () => 'AnimatedIcon',
}))

describe('Home grievance flow', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('navigates to issue_create from report grievance action', () => {
    const {getByText} = render(<Home />)

    fireEvent.press(getByText('report_grievance'))

    expect(mockNavigate).toHaveBeenCalledWith('issue_create')
  })
})
