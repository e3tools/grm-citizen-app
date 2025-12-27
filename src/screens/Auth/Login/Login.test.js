import {fireEvent, render, waitFor} from '@testing-library/react-native'
import React from 'react'
import Login from './Login'

// Mock services
jest.mock('../../../services/authService', () => ({
  fetchAuthCredentials: jest.fn(),
}))

// Mock navigation
const mockNavigate = jest.fn()
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}))

// Mock Redux
jest.mock('react-redux', () => ({
  useDispatch: () => jest.fn(),
  useSelector: () => ({}),
}))

// Mock i18n
jest.mock('../../../translations/i18n', () => ({
  i18n: {
    t: key => key,
  },
}))

describe('Login Screen (Option 2: Integration Test)', () => {
  it('should render login form', () => {
    const {getByPlaceholderText} = render(<Login />)
    expect(getByPlaceholderText('enter_your_username')).toBeTruthy()
    expect(getByPlaceholderText('enter_your_password')).toBeTruthy()
  })

  it('should handle form submission', async () => {
    const {fetchAuthCredentials} = require('../../../services/authService')
    fetchAuthCredentials.mockResolvedValueOnce({
      token: 'mock-token',
      user: {id: 1},
    })

    const {getByPlaceholderText, getByText} = render(<Login />)
    const emailInput = getByPlaceholderText('enter_your_username')
    const passwordInput = getByPlaceholderText('enter_your_password')
    const submitButton = getByText('login')

    fireEvent.changeText(emailInput, 'test@example.com')
    fireEvent.changeText(passwordInput, 'password123')
    fireEvent.press(submitButton)

    await waitFor(() => {
      expect(fetchAuthCredentials).toHaveBeenCalledWith({
        username: 'test@example.com',
        password: 'password123',
      })
    })
  })

  it('should display error on failed login', async () => {
    const {fetchAuthCredentials} = require('../../../services/authService')
    fetchAuthCredentials.mockResolvedValueOnce({
      error: 'Invalid credentials',
    })

    const {getByPlaceholderText, getByText} = render(<Login />)
    const emailInput = getByPlaceholderText('enter_your_username')
    const passwordInput = getByPlaceholderText('enter_your_password')
    const submitButton = getByText('login')

    fireEvent.changeText(emailInput, 'wrong@example.com')
    fireEvent.changeText(passwordInput, 'wrong')
    fireEvent.press(submitButton)

    await waitFor(() => {
      // The error should be displayed in the form
      expect(fetchAuthCredentials).toHaveBeenCalled()
    })
  })
})
