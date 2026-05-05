import type * as AuthServiceModule from './authService'

const TEST_API_AUTH_BASE_URL = 'https://api.test.com'

let authService: typeof AuthServiceModule

// Mock config
jest.mock('../../config', () => ({
  __esModule: true,
  default: {
    API_AUTH_BASE_URL: 'https://api.test.com',
  },
}))

describe('authService', () => {
  const previousApiAuthBaseUrl = process.env.EXPO_PUBLIC_API_AUTH_BASE_URL

  beforeEach(() => {
    global.fetch = jest.fn()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  beforeAll(() => {
    process.env.EXPO_PUBLIC_API_AUTH_BASE_URL = TEST_API_AUTH_BASE_URL
    authService = require('./authService') as typeof AuthServiceModule
  })

  afterAll(() => {
    if (previousApiAuthBaseUrl === undefined) {
      delete process.env.EXPO_PUBLIC_API_AUTH_BASE_URL
    } else {
      process.env.EXPO_PUBLIC_API_AUTH_BASE_URL = previousApiAuthBaseUrl
    }
  })

  describe('register', () => {
    it('should call register API with correct data', async () => {
      const mockResponse = {success: true, user: {id: 1}}
      global.fetch.mockResolvedValueOnce({
        json: async () => mockResponse,
      })

      const data = {email: 'test@example.com', password: 'password123'}
      const result = await authService.register(data)

      expect(global.fetch).toHaveBeenCalledTimes(1)
      const fetchCall = global.fetch.mock.calls[0]
      expect(fetchCall[0]).toBe(
        `${TEST_API_AUTH_BASE_URL}/authentication/register/`,
      )
      expect(fetchCall[1].method).toBe('POST')
      expect(fetchCall[1].body).toBe(JSON.stringify(data))
      expect(fetchCall[1].headers).toBeDefined()
      expect(result).toEqual(mockResponse)
    })

    it('should return error response from API', async () => {
      const mockError = {non_field_errors: ['Email already exists']}
      global.fetch.mockResolvedValueOnce({
        json: async () => mockError,
      })

      const data = {email: 'existing@example.com', password: 'password123'}
      const result = await authService.register(data)

      expect(result).toEqual(mockError)
    })
  })

  describe('fetchAuthCredentials', () => {
    it('should call login API with correct credentials', async () => {
      const mockResponse = {
        success: true,
        token: 'mock-token',
        user: {id: 1, email: 'test@example.com'},
      }
      global.fetch.mockResolvedValueOnce({
        json: async () => mockResponse,
      })

      const data = {email: 'test@example.com', password: 'password123'}
      const result = await authService.fetchAuthCredentials(data)

      expect(global.fetch).toHaveBeenCalledTimes(1)
      const fetchCall = global.fetch.mock.calls[0]
      expect(fetchCall[0]).toBe(
        `${TEST_API_AUTH_BASE_URL}/authentication/login/`,
      )
      expect(fetchCall[1].method).toBe('POST')
      expect(fetchCall[1].body).toBe(JSON.stringify(data))
      // Headers is a Headers object, check it exists
      expect(fetchCall[1].headers).toBeDefined()
      expect(result).toEqual(mockResponse)
    })

    it('should handle login errors', async () => {
      global.fetch.mockRejectedValueOnce(new Error('Network error'))

      const data = {email: 'test@example.com', password: 'wrong'}

      await expect(authService.fetchAuthCredentials(data)).rejects.toThrow(
        'Network error',
      )
    })
  })
})
