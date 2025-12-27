import {fetchAuthCredentials, register} from './authService'

// Mock config
jest.mock('../../config', () => ({
  __esModule: true,
  default: {
    API_AUTH_BASE_URL: 'https://api.test.com',
  },
}))

describe('authService', () => {
  beforeEach(() => {
    global.fetch = jest.fn()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('register', () => {
    it('should call register API with correct data', async () => {
      const mockResponse = {success: true, user: {id: 1}}
      global.fetch.mockResolvedValueOnce({
        json: async () => mockResponse,
      })

      const data = {email: 'test@example.com', password: 'password123'}
      const result = await register(data)

      expect(global.fetch).toHaveBeenCalledTimes(1)
      const fetchCall = global.fetch.mock.calls[0]
      expect(fetchCall[0]).toBe('https://api.test.com/authentication/register/')
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
      const result = await register(data)

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
      const result = await fetchAuthCredentials(data)

      expect(global.fetch).toHaveBeenCalledTimes(1)
      const fetchCall = global.fetch.mock.calls[0]
      expect(fetchCall[0]).toBe('https://api.test.com/authentication/login/')
      expect(fetchCall[1].method).toBe('POST')
      expect(fetchCall[1].body).toBe(JSON.stringify(data))
      // Headers is a Headers object, check it exists
      expect(fetchCall[1].headers).toBeDefined()
      expect(result).toEqual(mockResponse)
    })

    it('should handle login errors', async () => {
      global.fetch.mockRejectedValueOnce(new Error('Network error'))

      const data = {email: 'test@example.com', password: 'wrong'}

      await expect(fetchAuthCredentials(data)).rejects.toThrow('Network error')
    })
  })
})
