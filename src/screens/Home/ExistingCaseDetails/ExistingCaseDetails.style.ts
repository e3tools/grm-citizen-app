import {StyleSheet} from 'react-native'
import {colors} from '../../../utils/colors'

export default StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f6f7f8',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 120,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    minWidth: 240,
    padding: 24,
    borderRadius: 12,
    backgroundColor: '#ffffff',
  },
  modalButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 24,
    marginBottom: 12,
  },
  modalCancelBtn: {
    backgroundColor: '#cccccc',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  modalCancelText: {color: '#666666'},
  modalConfirmBtn: {
    marginLeft: 12,

    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  modalConfirmText: {color: '#ffffff'},
  modalTitle: {fontSize: 18, fontWeight: 'bold'},
  modalTextInput: {
    borderColor: '#cccccc',
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    margin: 10,
  },
  rateStarsRow: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  },
  moreIconBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f3f4f6',
  },

  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: '#dff4ea',
    borderWidth: 1,
    borderColor: '#bfead7',
  },
  statusPillText: {
    fontSize: 11,
    letterSpacing: 0.6,
    fontWeight: '700',
    color: '#1c9b73',
  },

  titleRow: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  caseTitle: {
    flex: 1,
    fontSize: 20,
    lineHeight: 24,
    fontWeight: '800',
    color: '#111827',
  },
  caseNumber: {
    fontSize: 12,
    color: colors.tertiary,
    fontWeight: '700',
    marginTop: 4,
  },
  caseNumberLabel: {
    color: colors.tertiary,
    fontWeight: '700',
  },

  metaGrid: {
    marginTop: 12,
    flexDirection: 'row',
    gap: 12,
  },
  metaCell: {
    flex: 1,
  },
  metaLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.6,
    color: colors.tertiary,
    marginBottom: 6,
  },
  metaValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
  },

  divider: {
    height: 1,
    backgroundColor: '#eef0f2',
    marginVertical: 12,
  },

  sectionLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.6,
    color: colors.tertiary,
    marginBottom: 6,
  },
  description: {
    fontSize: 13,
    lineHeight: 19,
    color: '#374151',
  },

  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionHeaderTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#111827',
  },
  sectionHeaderTitlePlain: {
    fontSize: 14,
    fontWeight: '800',
    color: '#111827',
  },
  viewAllLink: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },

  timeline: {
    paddingTop: 2,
  },
  timelineRow: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 8,
  },
  timelineLeft: {
    width: 28,
    alignItems: 'center',
  },
  timelineDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timelineDotActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#e5e7eb',
    marginTop: 6,
  },
  timelineBody: {
    flex: 1,
    paddingBottom: 2,
  },
  timelineTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  timelineTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#111827',
  },
  timelineDate: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.tertiary,
  },
  timelineSubtitle: {
    marginTop: 2,
    fontSize: 12,
    color: colors.tertiary,
    lineHeight: 16,
  },

  attachmentsRow: {
    gap: 10,
    paddingBottom: 2,
  },
  attachmentThumb: {
    width: 84,
    height: 56,
    borderRadius: 10,
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    overflow: 'hidden',
  },
  attachmentThumbInner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  chatList: {
    marginTop: 8,
    gap: 10,
  },
  chatRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
  },
  chatRowLeft: {
    justifyContent: 'flex-start',
  },
  chatRowRight: {
    justifyContent: 'flex-end',
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary200,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#cfe9dd',
  },
  avatarRight: {
    backgroundColor: '#eef2ff',
    borderColor: '#dbe3ff',
  },
  chatBubble: {
    maxWidth: '78%',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
  },
  chatBubbleLeft: {
    backgroundColor: '#ffffff',
    borderColor: '#e5e7eb',
  },
  chatBubbleRight: {
    backgroundColor: '#dff4ea',
    borderColor: '#bfead7',
  },
  chatMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
    gap: 10,
  },
  chatAuthor: {
    fontSize: 12,
    fontWeight: '800',
    color: '#111827',
  },
  chatWhen: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.tertiary,
  },
  chatText: {
    fontSize: 12,
    color: '#374151',
    lineHeight: 16,
  },

  commentComposer: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
  },
  commentInput: {
    flex: 1,
    minHeight: 44,
    maxHeight: 96,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#ffffff',
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: '#111827',
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f6f7f8',
    borderTopWidth: 1,
    borderTopColor: '#e6e8eb',
    flexDirection: 'row',
    gap: 12,
  },
  bottomBtn: {
    flex: 1,
    height: 46,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  bottomBtnPrimary: {
    backgroundColor: colors.primary,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  bottomBtnRated: {
    backgroundColor: '#dff4ea',
    borderWidth: 1,
    borderColor: '#bfead7',
    gap: 6,
  },
  bottomBtnDangerOutline: {
    backgroundColor: '#ffe7e4',
    borderWidth: 1,
    borderColor: '#9d322445',
  },
  bottomBtnText: {
    fontSize: 14,
    fontWeight: '800',
  },
  bottomBtnTextPrimary: {
    color: colors.white,
  },
  bottomBtnTextDanger: {
    color: '#9d3224',
  },
})
