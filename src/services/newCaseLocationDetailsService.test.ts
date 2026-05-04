import request from '../utils/request'
import {getDistricts, getWards} from './newCaseLocationDetailsService'

jest.mock('../utils/request', () => jest.fn())

describe('newCaseLocationDetailsService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('fetches all district pages and returns consolidated district list', async () => {
    const mockRequest = request as jest.MockedFunction<any>

    mockRequest
      .mockResolvedValueOnce({
        data: {
          count: 3,
          next: 'https://api.example.com/issues/regions/?page=2',
          prev: null,
          results: [
            {id: 1, name: 'District A', administrative_level: 1},
            {id: 2, name: 'District B', administrative_level: 1},
          ],
        },
      })
      .mockResolvedValueOnce({
        data: {
          count: 3,
          next: null,
          prev: 'https://api.example.com/issues/regions/?page=1',
          results: [{id: 3, name: 'District C', administrative_level: 1}],
        },
      })

    const result = await getDistricts()

    expect(result).toEqual([
      {id: 1, name: 'District A', administrative_level: 1},
      {id: 2, name: 'District B', administrative_level: 1},
      {id: 3, name: 'District C', administrative_level: 1},
    ])
    expect(mockRequest).toHaveBeenCalledTimes(2)
    expect(mockRequest.mock.calls[0][0].url).toContain('/issues/regions/')
    expect(mockRequest.mock.calls[1][0].url).toContain('page=2')
  })

  it('returns undefined when getDistricts request fails', async () => {
    const mockRequest = request as jest.MockedFunction<any>
    mockRequest.mockRejectedValueOnce(new Error('Network error'))

    const result = await getDistricts()

    expect(result).toBeUndefined()
  })

  it('fetches wards for a given district id', async () => {
    const mockRequest = request as jest.MockedFunction<any>
    mockRequest.mockResolvedValueOnce({
      data: [
        {id: 11, name: 'Ward 1', administrative_level: 2},
        {id: 12, name: 'Ward 2', administrative_level: 2},
      ],
    })

    const result = await getWards(1)

    expect(result).toEqual([
      {id: 11, name: 'Ward 1', administrative_level: 2},
      {id: 12, name: 'Ward 2', administrative_level: 2},
    ])
    expect(mockRequest).toHaveBeenCalledTimes(1)
    expect(mockRequest.mock.calls[0][0].url).toContain('parent=1')
  })

  it('returns undefined when getWards request fails', async () => {
    const mockRequest = request as jest.MockedFunction<any>
    mockRequest.mockRejectedValueOnce(new Error('Network error'))

    const result = await getWards(1)

    expect(result).toBeUndefined()
  })
})
