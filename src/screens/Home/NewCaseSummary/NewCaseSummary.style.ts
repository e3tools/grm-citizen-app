import {StyleSheet} from 'react-native'
import {colors} from '../../../utils/colors'

export default StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f6f7f8',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  stepKicker: {
    textAlign: 'center',
    fontSize: 11,
    letterSpacing: 1,
    fontWeight: '800',
    color: '#6b7280',
    marginBottom: 14,
  },

  card: {
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e6e8eb',
    marginBottom: 12,
  },

  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  cardHeaderLabel: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.6,
    color: '#9ca3af',
  },
  editLink: {
    fontSize: 11,
    fontWeight: '900',
    color: colors.primary,
    letterSpacing: 0.6,
  },

  securityRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
  },
  securityIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary200,
    borderWidth: 1,
    borderColor: '#cfe9dd',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  securityTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#111827',
    marginBottom: 4,
  },
  securitySubtitle: {
    fontSize: 12,
    color: '#6b7280',
    lineHeight: 16,
  },

  table: {
    gap: 10,
  },
  tableRow: {
    flexDirection: 'row',
    gap: 12,
  },
  tableCell: {
    flex: 1,
  },
  tableRowSingle: {
    gap: 6,
  },
  tableLabel: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.6,
    color: '#9ca3af',
    marginBottom: 6,
  },
  tableValue: {
    fontSize: 13,
    fontWeight: '800',
    color: '#111827',
  },

  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#111827',
  },

  divider: {
    height: 1,
    backgroundColor: '#eef0f2',
    marginVertical: 6,
  },

  sectionLabel: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.6,
    color: '#9ca3af',
    marginBottom: 6,
  },
  bodyText: {
    fontSize: 12,
    color: '#374151',
    lineHeight: 16,
  },
  muted: {
    fontSize: 12,
    color: '#9ca3af',
    fontWeight: '700',
  },

  attachmentsRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  attachmentThumb: {
    width: 84,
    height: 56,
    borderRadius: 10,
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center',
  },

  geoText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 12,
  },
  mapPreview: {
    height: 130,
    borderRadius: 14,
    backgroundColor: '#e5e7eb',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapPin: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    alignItems: 'center',
    justifyContent: 'center',
  },

  certRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginTop: 4,
    marginBottom: 6,
    paddingHorizontal: 6,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkboxChecked: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  certText: {
    flex: 1,
    fontSize: 12,
    color: '#6b7280',
    lineHeight: 16,
  },
})
