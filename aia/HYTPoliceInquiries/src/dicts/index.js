// 引入 国际化函数
import { i18n } from '../../../../src/locale';
// 警情有效性
export const effectivenessArr = [
  // { value: '', label: '全部' }, // 全部
  { value: '1', label: i18n.t('hyt.dicts.invalid') }, // 无效
  { value: '0', label: i18n.t('hyt.dicts.valid') }, // 有效
];

// 签收状态
export const signFlagArr = [
  // { value: '', label: '全部' }, // 全部
  { value: '0', label: i18n.t('hyt.dicts.notSignedForReceipt') }, // 未签收
  { value: '1', label: i18n.t('hyt.dicts.signedFor') }, // 已签收
];

// 是否反馈
export const feedbackFlagArr = [
  // { value: '', label: '全部' }, // 全部
  { value: '0', label: i18n.t('hyt.dicts.noFeedback') }, // 未反馈
  { value: '1', label: i18n.t('hyt.dicts.feedback') }, // 已反馈
];

// 联动警情
export const linkIdentityArr = [
  // { value: '', label: '全部' }, // 全部
  { value: '0', label: i18n.t('hyt.dicts.12345Transfers_110') }, // 12345移交110
  { value: '1', label: i18n.t('hyt.dicts.110Transfer_12345') }, // 110移交12345
];

// 违规状态
export const violationStatusArr = [
  // { value: '', label: '全部' }, // 全部
  { value: '0', label: i18n.t('hyt.dicts.thereIsAViolation') }, // 有违规
  { value: '1', label: i18n.t('hyt.dicts.noViolations') }, // 无违规
];