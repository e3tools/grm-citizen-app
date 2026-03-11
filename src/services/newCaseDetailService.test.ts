import * as request from '../utils/request'
import {
  getIssueCategories,
  getIssueComponents,
  getIssueSubcomponents,
  getIssueSubTypes,
  getIssueTypes,
} from './newCaseDetailsService'

// Mock config
jest.mock('../../config', () => ({
  __esModule: true,
  default: {
    API_AUTH_BASE_URL: 'https://api.test.com',
  },
}))

jest.mock('../utils/request', () => {
  const originalModule = jest.requireActual('../utils/request')

  return {
    __esModule: true,
    ...originalModule,
    default: jest.fn(),
  }
})

describe('newCaseDetailsService', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('Get Issue Categories', () => {
    it('should fetch issue categories', async () => {
      const mockResponse = {data: [{id: 1, name: 'Category 1'}]}
      require('../utils/request').default.mockResolvedValue(mockResponse)
      const data = await getIssueCategories()
      expect(request.default).toHaveBeenCalledWith(
        expect.objectContaining({
          url: 'https://api.test.com/issues/issue-categories/',
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
      const data = await getIssueTypes()
      expect(request.default).toHaveBeenCalledWith(
        expect.objectContaining({
          url: 'https://api.test.com/issues/issue-types/',
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
      const data = await getIssueComponents()
      expect(request.default).toHaveBeenCalledWith(
        expect.objectContaining({
          url: 'https://api.test.com/issues/components/',
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
      const data = await getIssueSubcomponents()
      expect(request.default).toHaveBeenCalledWith(
        expect.objectContaining({
          url: 'https://api.test.com/issues/subcomponents/',
          method: 'GET',
        }),
      )

      expect(data).toEqual(mockResponse.data)
    })
  })

  describe('Get Issue Sub Types  ', () => {
    it('should fetch issue sub-components', async () => {
      const mockResponse = {data: [{id: 1, name: 'Subtype 1'}]}
      require('../utils/request').default.mockResolvedValue(mockResponse)
      const data = await getIssueSubTypes()
      expect(request.default).toHaveBeenCalledWith(
        expect.objectContaining({
          url: 'https://api.test.com/issues/issue-subtypes/',
          method: 'GET',
        }),
      )

      expect(data).toEqual(mockResponse.data)
    })
  })
})
