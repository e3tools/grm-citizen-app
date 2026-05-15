import * as request from '../utils/request'
import type * as IssueServiceModule from './issueService'

const TEST_API_AUTH_BASE_URL = 'https://api.test.com'

let issueService: typeof IssueServiceModule

jest.mock('../store/ducks/authentication.duck', () => {
  const originalModule = jest.requireActual(
    '../store/ducks/authentication.duck',
  )
  return {
    __esModule: true,
    ...originalModule,
    addTokenToHttpClient: jest.fn(),
    getSessionData: jest.fn(),
  }
})

jest.mock('../utils/request', () => {
  const originalModule = jest.requireActual('../utils/request')
  return {
    __esModule: true,
    ...originalModule,
    default: jest.fn(),
  }
})

describe('issueService', () => {
  const previousApiAuthBaseUrl = process.env.EXPO_PUBLIC_API_AUTH_BASE_URL

  beforeAll(() => {
    process.env.EXPO_PUBLIC_API_AUTH_BASE_URL = TEST_API_AUTH_BASE_URL
    issueService = require('./issueService') as typeof IssueServiceModule
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

  describe('fetchIssueList', () => {
    it('should fetch issue list', async () => {
      const mockResponse = {data: [{id: 1, title: 'Issue 1'}]}
      require('../utils/request').default.mockResolvedValue(mockResponse)
      const data = await issueService.fetchIssueList()
      expect(request.default).toHaveBeenCalledWith(
        expect.objectContaining({
          url: `${TEST_API_AUTH_BASE_URL}/issues/reporter/?page=1&page_size=10`,
          method: 'GET',
        }),
      )
      expect(data).toEqual(mockResponse.data)
    })
  })

  describe('getIssues', () => {
    it('should fetch issues with pagination', async () => {
      const mockResponse = {data: [{id: 1, title: 'Issue A'}]}
      require('../utils/request').default.mockResolvedValue(mockResponse)
      const pageUrl = `${TEST_API_AUTH_BASE_URL}/issues/reporter?page=2&page_size=10`
      const data = await issueService.getIssues(pageUrl)
      expect(request.default).toHaveBeenCalledWith(
        expect.objectContaining({
          url: pageUrl,
          method: 'GET',
        }),
      )
      expect(data).toEqual(mockResponse.data)
    })
  })

  describe('getIssueDetail', () => {
    it('should fetch issue detail by id', async () => {
      const mockResponse = {data: {id: 1, title: 'Single Issue'}}
      require('../utils/request').default.mockResolvedValue(mockResponse)
      const data = await issueService.getIssueDetail(1)
      expect(request.default).toHaveBeenCalledWith(
        expect.objectContaining({
          url: `${TEST_API_AUTH_BASE_URL}/issues/1/`,
          method: 'GET',
        }),
      )
      expect(data).toEqual(mockResponse.data)
    })
  })

  describe('createIssue', () => {
    it('should create a new issue', async () => {
      const payload = {title: 'Test Issue'}
      const mockResponse = {data: {id: 2, ...payload}}
      require('../utils/request').default.mockResolvedValue(mockResponse)
      const data = await issueService.createIssue(payload)
      expect(request.default).toHaveBeenCalledWith(
        expect.objectContaining({
          url: `${TEST_API_AUTH_BASE_URL}/issues/create/`,
          method: 'POST',
          data: JSON.stringify(payload),
          headers: {'Content-Type': 'application/json'},
        }),
      )
      expect(data).toEqual(mockResponse.data)
    })
  })

  describe('addIssueAttachment', () => {
    it('should add attachment to issue', async () => {
      const formData = new FormData()
      const mockResponse = {data: {status: 'ok'}}
      require('../utils/request').default.mockResolvedValue(mockResponse)
      const data = await issueService.addIssueAttachment(1, formData)
      expect(request.default).toHaveBeenCalledWith(
        expect.objectContaining({
          url: `${TEST_API_AUTH_BASE_URL}/issues/1/add-attachment`,
          method: 'POST',
          data: formData,
          headers: {'Content-Type': 'multipart/form-data'},
        }),
      )
      expect(data).toEqual(mockResponse.data)
    })
  })

  describe('addIssueComment', () => {
    it('should add comment to an issue', async () => {
      const payload = {comment: 'Nice comment!'}
      const mockResponse = {data: {id: 99, comment: 'Nice comment!'}}
      require('../utils/request').default.mockResolvedValue(mockResponse)
      const data = await issueService.addIssueComment(1, payload)
      expect(request.default).toHaveBeenCalledWith(
        expect.objectContaining({
          url: `${TEST_API_AUTH_BASE_URL}/issues/1/add-comment`,
          method: 'POST',
          data: JSON.stringify(payload),
          headers: {'Content-Type': 'application/json'},
        }),
      )
      expect(data).toEqual(mockResponse.data)
    })
  })

  describe('listIssueComments', () => {
    it('should get comments for an issue', async () => {
      const mockResponse = {data: [{id: 1, comment: 'Hello'}]}
      require('../utils/request').default.mockResolvedValue(mockResponse)
      const data = await issueService.listIssueComments(1)
      expect(request.default).toHaveBeenCalledWith(
        expect.objectContaining({
          url: `${TEST_API_AUTH_BASE_URL}/issues/1/comments/`,
          method: 'GET',
          params: {page: '1', page_size: '10'},
        }),
      )
      expect(data).toEqual(mockResponse.data)
    })
  })

  describe('getIssueComments (alias)', () => {
    it('should alias to listIssueComments', async () => {
      const mockResponse = {data: [{id: 1, comment: 'Alias'}]}
      require('../utils/request').default.mockResolvedValue(mockResponse)
      const data = await issueService.getIssueComments(1)
      expect(request.default).toHaveBeenCalledWith(
        expect.objectContaining({
          url: `${TEST_API_AUTH_BASE_URL}/issues/1/comments/`,
          method: 'GET',
          params: {page: '1', page_size: '10'},
        }),
      )
      expect(data).toEqual(mockResponse.data)
    })
  })

  describe('listIssueAttachments', () => {
    it('should get attachments for an issue', async () => {
      const mockResponse = {data: [{id: 1, filename: 'a.pdf'}]}
      require('../utils/request').default.mockResolvedValue(mockResponse)
      const data = await issueService.listIssueAttachments(1)
      expect(request.default).toHaveBeenCalledWith(
        expect.objectContaining({
          url: `${TEST_API_AUTH_BASE_URL}/issues/1/attachments/`,
          method: 'GET',
          params: {page: '1', page_size: '10'},
        }),
      )
      expect(data).toEqual(mockResponse.data)
    })
  })

  describe('getIssueAttachments (alias)', () => {
    it('should alias to listIssueAttachments', async () => {
      const mockResponse = {data: [{id: 1, filename: 'b.pdf'}]}
      require('../utils/request').default.mockResolvedValue(mockResponse)
      const data = await issueService.getIssueAttachments(1)
      expect(request.default).toHaveBeenCalledWith(
        expect.objectContaining({
          url: `${TEST_API_AUTH_BASE_URL}/issues/1/attachments/`,
          method: 'GET',
          params: {page: '1', page_size: '10'},
        }),
      )
      expect(data).toEqual(mockResponse.data)
    })
  })

  describe('updateIssue', () => {
    it('should update an issue', async () => {
      const payload = {title: 'Updated'}
      const mockResponse = {data: {id: 9, title: 'Updated'}}
      require('../utils/request').default.mockResolvedValue(mockResponse)
      const data = await issueService.updateIssue(9, payload)
      expect(request.default).toHaveBeenCalledWith(
        expect.objectContaining({
          url: `${TEST_API_AUTH_BASE_URL}/issues/9/update/`,
          method: 'PATCH',
          data: JSON.stringify(payload),
          headers: {'Content-Type': 'application/json'},
        }),
      )
      expect(data).toEqual(mockResponse.data)
    })
  })
})
