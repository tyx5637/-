import { I18n } from '@ies/starling_intl';

import { bytedance } from '@/api/api-generate/ttarchApi';

interface ToastConfig {
  /** 展示文本 */
  text: string;
  /** 提示类型 */
  type?: string;
  /**
   * 展示时长，单位ms
   */
  duration?: number;
}

/**
 * 用户交互协议, 需要业务具体实现交互行为
 */
class UserActionInterface {
  closeWebview(): void {
    throw new Error('Method not implemented.');
  }

  /** 打开实体 */
  openContent(target: { itemType: bytedance.ttarch.common.ItemType; itemId: string }, detail?: bytedance.ttarch.api_content.ContentPack) {
    console.log('UserActionInterface method openContent', target, detail);
    throw new Error(`${I18n.t('method_not_implemented', {}, '方法未实现')}`);
  }

  /** 打开培训任务详情(特化) */
  openTrainTaskDetail(taskData: any) {
    console.log('UserActionInterface method openTrainTaskDetail', taskData);
    throw new Error(`${I18n.t('method_not_implemented', {}, '方法未实现')}`);
  }

  /** 打开文章详情 */
  openPost(targetId: string, detail?: bytedance.ttarch.api_content.Content) {
    console.log('UserActionInterface method openPost', targetId, detail);
    throw new Error(`${I18n.t('method_not_implemented', {}, '方法未实现')}`);
  }

  /** 打开用户详情 */
  openUser(targetId: string, detail?: bytedance.ttarch.api_user.User) {
    console.log('UserActionInterface method openUser', targetId, detail);
    throw new Error(`${I18n.t('method_not_implemented', {}, '方法未实现')}`);
  }

  /** 打开话题详情 */
  openTopic?(targetId: string, detail: bytedance.ttarch.api_tag.TopicPack, data?: bytedance.ttarch.api_content.ContentPack) {
    console.log('UserActionInterface method openTopic', targetId, detail, data);
    throw new Error(`${I18n.t('method_not_implemented', {}, '方法未实现')}`);
  }

  /** 打开标签详情 */
  openTag?(tagId: string, detail: bytedance.ttarch.api_tag.Tag, data?: bytedance.ttarch.api_content.ContentPack) {
    console.log('UserActionInterface method openTag', tagId, detail, data);
    throw new Error(`${I18n.t('method_not_implemented', {}, '方法未实现')}`);
  }

  /** 打开版块详情 */
  openCategory(targetId: string, detail?: bytedance.ttarch.api_tag.Category) {
    console.log('UserActionInterface method openCategory', targetId, detail);
    throw new Error(`${I18n.t('method_not_implemented', {}, '方法未实现')}`);
  }

  /** 打开一级评论详情 */
  openComment(targetId: string, root?: bytedance.ttarch.api_common.ItemHref) {
    console.log('UserActionInterface method openComment', targetId, root);
    throw new Error(`${I18n.t('method_not_implemented__targetid_=_{targetid}', { targetId }, '方法未实现: targetId={targetId}')}`);
  }

  /** 打开外部链接 */
  openExternal(targetLink: string) {
    window.open(targetLink, '_blank');
  }

  /** 打开版块聚合页 */
  openCategoryGather(targetId?: string) {
    console.log('UserActionInterface method openCategoryGather', targetId);
    throw new Error(`${I18n.t('method_not_implemented', {}, '方法未实现')}`);
  }

  /** 打开帖子评论区 */
  openPostComment(targetId: string) {
    console.log('UserActionInterface method openPostComment', targetId);
    throw new Error(`${I18n.t('method_not_implemented', {}, '方法未实现')}`);
  }

  // 特殊功能
  /** 分享帖子 */
  sharePost(data: {
    /** 分享页面链接 */
    postId: string;
    /** 分享标题 */
    title?: string;
    /** 分享描述 */
    description?: string;
    /** 图像Url地址 */
    image?: string;
  }) {
    console.log('UserActionInterface method sharePost', data);
    throw new Error(I18n.t('method_not_implemented', {}, '方法未实现'));
  }

  /** 图片预览 */
  viewImage(imageUrls: string[], index = 0) {
    console.log('UserActionInterface method viewImage', imageUrls, index);
    throw new Error(I18n.t('method_not_implemented', {}, '方法未实现'));
  }

  /** 轻提示 */
  toast(config: ToastConfig | string) {
    console.log('UserActionInterface method toast', config);
  }
}

export default UserActionInterface;
