import {citizenTypes} from './utils'

describe('utils', () => {
  describe('citizenTypes', () => {
    it('should be an array', () => {
      expect(Array.isArray(citizenTypes)).toBe(true)
    })

    it('should contain expected citizen types', () => {
      expect(citizenTypes).toContain("Une organisation au nom d'un citoyen")
      expect(citizenTypes).toContain("Un citoyen au nom d'un autre")
      expect(citizenTypes).toContain('Un plaignant')
    })

    it('should have at least 3 items', () => {
      expect(citizenTypes.length).toBeGreaterThanOrEqual(3)
    })
  })
})
