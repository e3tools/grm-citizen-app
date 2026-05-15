import * as request from '../utils/request'

import type * as NewCaseDetailsServiceModule from './newCaseDetailsService'

const TEST_API_AUTH_BASE_URL = 'https://api.test.com'

let newCaseDetailsService: typeof NewCaseDetailsServiceModule

jest.mock('../utils/request', () => {
  const originalModule = jest.requireActual('../utils/request')

  return {
    __esModule: true,
    ...originalModule,
    default: jest.fn(),
  }
})

describe('newCaseDetailsService', () => {
  const previousApiAuthBaseUrl = process.env.EXPO_PUBLIC_API_AUTH_BASE_URL

  beforeAll(() => {
    process.env.EXPO_PUBLIC_API_AUTH_BASE_URL = TEST_API_AUTH_BASE_URL
    newCaseDetailsService =
      require('./newCaseDetailsService') as typeof NewCaseDetailsServiceModule
  })

  afterAll(() => {
    if (previousApiAuthBaseUrl === undefined) {
      delete process.env.EXPO_PUBLIC_API_AUTH_BASE_URL
    } else {
      process.env.EXPO_PUBLIC_API_AUTH_BASE_URL = previousApiAuthBaseUrl
    }
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('Get Issue Categories', () => {
    it('should fetch issue categories', async () => {
      const mockResponse = {data: [{id: 1, name: 'Category 1'}]}
      require('../utils/request').default.mockResolvedValue(mockResponse)
      const data = await newCaseDetailsService.getIssueCategories()
      expect(request.default).toHaveBeenCalledWith(
        expect.objectContaining({
          url: `${TEST_API_AUTH_BASE_URL}/issues/issue-categories/`,
          method: 'GET',
        }),
      )

      expect(data).toEqual(mockResponse.data)
    })
  })

  describe('Get Issue Types', () => {
    it('should fetch issue types', async () => {
      const mockResponse = {data: [{id: 1, name: 'Type 1'}]}
      require('../utils/request').default.mockResolvedValue(mockResponse)
      const data = await newCaseDetailsService.getIssueTypes()
      expect(request.default).toHaveBeenCalledWith(
        expect.objectContaining({
          url: `${TEST_API_AUTH_BASE_URL}/issues/issue-types/`,
          method: 'GET',
        }),
      )

      expect(data).toEqual(mockResponse.data)
    })
  })

  describe('Get Issue Components', () => {
    it('should fetch issue components', async () => {
      const mockResponse = {data: [{id: 1, name: 'Components 1'}]}
      require('../utils/request').default.mockResolvedValue(mockResponse)
      const data = await newCaseDetailsService.getIssueComponents()
      expect(request.default).toHaveBeenCalledWith(
        expect.objectContaining({
          url: `${TEST_API_AUTH_BASE_URL}/issues/components/`,
          method: 'GET',
        }),
      )

      expect(data).toEqual(mockResponse.data)
    })
  })

  describe('Get Issue Subcomponents', () => {
    it('should fetch issue sub-components', async () => {
      const mockResponse = {data: [{id: 1, name: 'Subcomponent 1'}]}
      require('../utils/request').default.mockResolvedValue(mockResponse)
      const data = await newCaseDetailsService.getIssueSubcomponents()
      expect(request.default).toHaveBeenCalledWith(
        expect.objectContaining({
          url: `${TEST_API_AUTH_BASE_URL}/issues/subcomponents/`,
          method: 'GET',
        }),
      )

      expect(data).toEqual(mockResponse.data)
    })
  })

  describe('Get Issue Sub Types  ', () => {
    it('should fetch issue sub-types', async () => {
      const mockResponse = {data: [{id: 1, name: 'Subtype 1'}]}
      require('../utils/request').default.mockResolvedValue(mockResponse)
      const data = await newCaseDetailsService.getIssueSubTypes()
      expect(request.default).toHaveBeenCalledWith(
        expect.objectContaining({
          url: `${TEST_API_AUTH_BASE_URL}/issues/issue-subtypes/`,
          method: 'GET',
        }),
      )

      expect(data).toEqual(mockResponse.data)
    })
  })
})
