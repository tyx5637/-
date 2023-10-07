import { useEffect, useRef } from 'react';
import { app } from '@bridge/pico';
import { I18nt } from '@/utils/globalEnv';
import { bytedance } from '@/api/api-generate/ttarchApi';
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace appTrackType {
  export enum CellType {
    banner = 'banner',
    slide_big = 'slide_big',
    list = 'list',
    slide_small = 'slide_small',
  }
  export enum GroupType {
    post = 'post',
    activity = 'activity',
  }
  export enum Section {
    bar = 'bar',
    button = 'button',
  }
  export enum Position {
    list = 'list',
    detail = 'detail',
    top = 'top',
    button = 'button',
    first_page = 'first_page',
    swtich_tab = 'switch_tab',
  }
  export enum EnterType {
    scroll = 'scroll',
  }
  export enum CloseType {
    scroll = 'scroll',
  }
  export enum Type {
    points = 'points',
    post = 'post',
    comment = 'comment',
    favorite = 'favorite',
    info = 'info',
  }
  export enum ChildType {
    my_points = 'my_points',
    post = 'post',
    msg = 'msg',
  }
  export enum SubType {
    rules = 'rules',
  }
  export enum PgcPosition {
    content = 'content',
    comments = 'comments',
  }
  export interface PageElementData {
    type: 'page';
    pageKey: string;
    [key: string]: any;
  }
  export interface CellElementData {
    type: 'cell';
    cellKey: string;
    cellType: CellType;
    [key: string]: any;
  }
  export interface ClientShow {
    /** 频道名称 */
    category_name?: string;
    /** 子频道名称 */
    subcategory_name?: string;
    /** tab名称 */
    tab_name?: string;
    /** 进入用户ui d */
    owner_uid?: string;
    /** 进入用户名字 */
    owner_name?: string;
    /** （帖子/评论/收藏/pgc频道）是否进入自己的 */
    is_self?: number;
    /** 在页面中选择的一体机类别 */
    pico_device_type?: string;
    /** 展示的模块 */
    cell_type?: CellType;
    /** 模块的名称 */
    cell_name?: string;
    /** 模块的位置，第X位 */
    cell_order?: number;
    /** 应用、帖子、活动等在当前模块中的位置，第X位 */
    group_rank?: number;
    /** 应用，帖子，活动等 */
    group_type?: GroupType;
    /** 应用，帖子、评论等的唯一识别 */
    group_id?: string;
    /** 应用，帖子，评论等的名称 */
    group_title?: string;
    /** 话题 */
    group_topic?: string;
    /** 作者uid */
    author_uid?: string;
    /** 头图url */
    pic_url?: string;
    /** 是否置顶 */
    is_sticked_top?: number;
    /** 是否加精 */
    is_selected?: number;
    /** 例如“阅读杂聊” */
    group_label?: string;
    /** 帖子的评论数量 */
    comment_num?: number;
    /** 帖子的点赞数量 */
    like_num?: number;
  }
  export interface ClickMoreComment {
    /** 类型 */
    group_type?: GroupType;
    /** 应用，帖子、评论等的唯一识别 */
    group_id?: string;
    /** 应用，帖子，活动等的名称 */
    group_title?: string;
    /** 回复的comment_id */
    reply_comment_id?: string;
    /** 回复的评论id */
    reply_uid?: string;
  }

  export interface EnterComment {
    /** 频道名称 */
    category_name?: string;
    /** tab名称 */
    tab_name?: string;
    /** 类型 */
    group_type?: GroupType;
    /** 应用，帖子、评论等的唯一识别 */
    group_id?: string;
    /** 应用，帖子，活动等的名称 */
    group_title?: string;
    /** 进入方式 */
    enter_type?: EnterType;
    /** 操作位置 */
    position?: Position;
    /** 话题 */
    group_topic?: string;
  }
  export interface CloseComment {
    /** 频道名称 */
    category_name?: string;
    /** tab名称 */
    tab_name?: string;
    /** 类型 */
    group_type?: GroupType;
    /** 应用，帖子、评论等的唯一识别 */
    group_id?: string;
    /** 话题 */
    group_topic?: string;
    /** 应用，帖子，活动等的名称 */
    group_title?: string;
    /** 停留时长 */
    stay_time?: number;
    /** 进入方式 */
    enter_type?: EnterType;
    /** 退出方式 */
    close_type?: CloseType;
  }
  export interface EnterPgc {
    /** 频道名称 */
    category_name?: string;
    /** 子频道名称 */
    subcategory_name?: string;
    /** tab名称 */
    tab_name?: string;
    /** 模块的位置，第X位 */
    cell_order?: number;
    /** 应用、帖子、活动等在当前模块中的位置，第X位，从1开始 */
    group_rank?: number;
    /** 操作位置 */
    position?: Position;
    /** 类型 */
    group_type?: GroupType;
    /** 应用，帖子、评论等的唯一识别 */
    group_id?: string;
    /** 应用，帖子，活动等的名称 */
    group_title?: string;
    /** 帖子的评论数量 */
    comment_num?: number;
    /** 帖子的点赞数量 */
    like_num?: number;
    /** 个人主页id */
    user_id?: string;
    /** 个人主页用户姓名 */
    user_name?: string;
    /** 是否进入自己的个人主页 */
    is_self?: number;
    /** 点击位置 */
    pgc_position?: PgcPosition;
  }
  export interface CheckPgcInfo {
    /** 频道名称 */
    category_name?: string;
    /** tab名称 */
    tab_name?: string;
    /** 类型 */
    type?: Type;
    /** 子类型 */
    sub_type?: SubType;
    /** 个人主页id */
    user_id?: string;
    /** 个人主页用户姓名 */
    user_name?: string;
    /** 是否进入自己的个人主页 */
    is_self?: number;
    position?: string;
  }
  export interface SignIn {
    /** 频道名称 */
    category_name?: string;
    /** 子频道名称 */
    subcategory_name?: string;
    /** tab名称 */
    tab_name?: string;
    /** 连续第x天签到 */
    signin_num?: number;
    /** 今天发放的金币数量 */
    coins?: number;
  }
  export interface ClickDeleteComment {
    /** 频道名称 */
    category_name?: string;
    /** tab名称 */
    tab_name?: string;
    /** 应用，帖子、评论等的唯一识别 */
    group_id?: string;
    /** 应用，帖子，活动等的名称 */
    group_title?: string;
    /** 是否是回复的回复 */
    is_reply?: number;
    /** 回复的comment_id */
    reply_comment_id?: string;
    /** 回复的评论id */
    reply_uid?: string;
    /** 删除的comment_id */
    comment_id?: string;
  }
  export interface DeleteComment {
    /** 频道名称 */
    category_name?: string;
    /** tab名称 */
    tab_name?: string;
    /** 应用，帖子、评论等的唯一识别 */
    group_id?: string;
    /** 应用，帖子，活动等的名称 */
    group_title?: string;
    /** 是否是回复的回复 */
    is_reply?: number;
    /** 回复的comment_id */
    reply_comment_id?: string;
    /** 回复的评论id */
    reply_uid?: string;
    /** 删除的comment_id */
    comment_id?: string;
  }
  export interface CheckUserCenter {
    type?: string;
    subtype?: string;
  }
  export interface Unfavorite {
    /** 应用，帖子、评论等的唯一识别 */
    group_id?: string;
    /** 应用，帖子，活动等的名称 */
    group_title?: string;
    /** 类型 */
    group_type?: GroupType;
    /** 收藏的位置 */
    position?: Position;
  }
}

/** 获取当前排序位置 */
const findRank = (ctx: any[]) => {
  const target = ctx.find(item => 'index' in item);
  if (!target) {
    return undefined;
  }
  return (target.index as number) + 1;
};
const findPgcInfoType = item => {
  if (item === I18nt('pico_cmn_web_my_post', '我的帖子') || item === I18nt('pico_cmn_web_search_post', '帖子')) {
    return appTrackType.Type.post;
  }
  if (item === I18nt('pico_cmn_web_user_score', '积分')) {
    return appTrackType.Type.points;
  }
  if (item === I18nt('pico_cmn_web_user_collect', '收藏')) {
    return appTrackType.Type.favorite;
  }
  if (item === I18nt('pico_cmn_web_user_comment', '评论')) {
    return appTrackType.Type.comment;
  }
  return null;
};
/** 事件处理中心 */
function useAppTrackHook() {
  const eventDataRef = useRef<any>(null);

  useEffect(() => {
    const picoEvent = eventDataRef.current;
    if (!picoEvent) {
      return undefined;
    }

    // client_show埋点
    const postCardClientShow = picoEvent.on('show_post_card', ({ data, context }) => {
      const itemInfo = (data.postInfo || data.comment) as bytedance.ttarch.api_interact.CommentPack &
        bytedance.ttarch.api_content.ContentPack;
      const clientShowParams: appTrackType.ClientShow = {
        owner_uid: context[0].userId,
        group_rank: 1,
        group_type: appTrackType.GroupType.post,
        group_id: itemInfo.content?.item_id || itemInfo.comment?.item_id,
        group_title: itemInfo.content?.name || itemInfo.comment?.content,
        is_sticked_top: itemInfo.pool_status?.is_top ? 1 : 0,
        is_selected: itemInfo.pool_status?.is_good ? 1 : 0,
        pic_url: itemInfo.content?.cover_image.url,
        author_uid: itemInfo?.user?.user_id,
        group_topic: itemInfo.topics?.map(cur => cur.name || '')?.join(',') || '',
      };
      app.track({
        eventName: 'client_show',
        params: clientShowParams,
        appAppendKeyList: ['category_name', 'tab_name'],
      });
    });
    const commentCardClientShow = picoEvent.on('show_comment_card', ({ data, context }) => {
      const itemInfo = (data.postInfo || data.comment) as bytedance.ttarch.api_interact.CommentPack &
        bytedance.ttarch.api_content.ContentPack;
      const clientShowParams: appTrackType.ClientShow = {
        owner_uid: context[0].userId,
        group_rank: 1,
        group_type: appTrackType.GroupType.post,
        group_id: itemInfo.content?.item_id || itemInfo.comment?.item_id,
        group_title: itemInfo.content?.name || itemInfo.comment?.content,
        is_sticked_top: itemInfo.pool_status?.is_top ? 1 : 0,
        is_selected: itemInfo.pool_status?.is_good ? 1 : 0,
        pic_url: itemInfo.content?.cover_image.url,
        author_uid: itemInfo?.user?.user_id,
        group_topic: itemInfo.topics?.map(cur => cur.name || '')?.join(',') || '',
      };
      app.track({
        eventName: 'client_show',
        params: clientShowParams,
        appAppendKeyList: ['category_name', 'tab_name'],
      });
    });

    // enter_comment埋点
    const enterComment = picoEvent.on('show_comment_area', ({ data, context }) => {
      const rank = findRank(context);
      const eventParams: appTrackType.EnterComment = {
        group_type: appTrackType.GroupType.post,
        group_id: data.parentInfo.id,
        group_title: context[0].postInfo.content?.name || '',
        enter_type: data.enterType || appTrackType.EnterType.scroll,
        position: typeof rank === 'number' ? appTrackType.Position.list : appTrackType.Position.detail,
        group_topic: context[0].postInfo?.topics?.map(cur => cur.name || '')?.join(',') || '',
      };
      app.track({
        eventName: 'enter_comment',
        params: eventParams,
        appAppendKeyList: ['category_name', 'subcategory_name', 'tab_name'],
      });
    });
    // close_comment埋点
    const closeComment = picoEvent.on('hide_comment_area', ({ data, context }) => {
      const eventParams: appTrackType.CloseComment = {
        group_type: appTrackType.GroupType.post,
        group_id: data.parentInfo.id,
        group_title: context[0].postInfo.content?.name,
        enter_type: data.enterType || appTrackType.EnterType.scroll,
        stay_time: Number(data.parentInfo.stay_time),
        close_type: appTrackType.CloseType.scroll,
        group_topic: context[0].postInfo?.topics?.map(cur => cur.name || '')?.join(',') || '',
      };
      app.track({
        eventName: 'close_comment',
        params: eventParams,
        appAppendKeyList: ['category_name', 'subcategory_name', 'tab_name'],
      });
    });

    // click_more_comment埋点
    const clickMoreComment = picoEvent.on('click_more_comment', ({ data }) => {
      const eventParams: appTrackType.ClickMoreComment = {
        group_type: appTrackType.GroupType.post,
        group_id: data.postInfo.content.item_id,
        group_title: data.postInfo.content.name,
        reply_comment_id: data.comment.comment.comment_id,
        reply_uid: data.comment.comment.user_id,
      };
      app.track({
        eventName: 'click_more_comment',
        params: eventParams,
      });
    });

    // enter_pgc埋点
    const enterPgc = picoEvent.on('click_user', ({ data, context }) => {
      const { postInfo } = data;
      const rank = findRank(context);
      const eventParams: appTrackType.EnterPgc = {
        is_self: context[0].userId ? Number(context[0].userId === postInfo.user?.user_id) : Number(data.user.user_id === data.curUserId),
        group_rank: typeof rank === 'number' ? 1 : undefined,
        cell_order: rank,
        group_type: appTrackType.GroupType.post,
        group_id: postInfo.content.item_id,
        group_title: postInfo.content.name,
        comment_num: postInfo.interact_status?.comment_count,
        like_num: postInfo.interact_status?.like_count,
        position: typeof rank === 'number' ? appTrackType.Position.list : appTrackType.Position.detail,
        user_id: data.user?.user_id || data.postInfo.user.user_id,
        user_name: data.user?.name || data.postInfo.user.name,
        pgc_position: data.type === 'content' ? appTrackType.PgcPosition.content : appTrackType.PgcPosition.comments,
      };
      app.track({
        eventName: 'enter_pgc',
        params: eventParams,
        appAppendKeyList: ['category_name', 'subcategory_name', 'tab_name'],
      });
    });

    // check_pgc_info埋点
    const checkPgcInfo = picoEvent.on('check_pgc_info', ({ data }) => {
      const user = data.user as bytedance.ttarch.api_user.User;
      const eventParams: appTrackType.CheckPgcInfo = {
        is_self: Number(data.isMine) || 0,
        type: findPgcInfoType(data.item?.name) || data.type || appTrackType.Type.info,
        user_id: user?.user_id,
        user_name: user?.name,
        position: data.isMine ? 'switch_tab' : 'first_page',
      };
      app.track({
        eventName: 'check_pgc_info',
        params: eventParams,
        appAppendKeyList: ['category_name', 'subcategory_name', 'tab_name'],
      });
    });

    // sign_in埋点
    const signIn = picoEvent.on('sign_in', ({ data }) => {
      const eventParams: appTrackType.SignIn = {
        signin_num: (data.maxCheckInCt as number) + 1,
        coins: data.point,
      };
      app.track({
        eventName: 'sign_in',
        params: eventParams,
        appAppendKeyList: ['category_name', 'subcategory_name', 'tab_name'],
      });
    });

    // check_user_center埋点
    const checkUserCenter = picoEvent.on('check_user_center', ({ data }) => {
      const eventParams: appTrackType.CheckUserCenter = {
        type: data.type,
        subtype: data.subtype,
      };
      app.track({
        eventName: 'check_user_center',
        params: eventParams,
      });
    });

    // click_delete_comment埋点
    const clickDeleteComment = picoEvent.on('click_delete_comment', ({ data }) => {
      const { comment } = data;
      const eventParams: appTrackType.ClickDeleteComment = {
        group_id: comment.root.item_id,
        group_title: comment.root.name,
        is_reply: comment.comment.item_type === bytedance.ttarch.common.ItemType.Comment ? 1 : 0,
        reply_comment_id: comment.comment.item_id,
        reply_uid: comment.comment.user_id,
        comment_id: comment.comment.comment_id,
      };
      app.track({
        eventName: 'click_delete_comment',
        params: eventParams,
        appAppendKeyList: ['category_name', 'tab_name'],
      });
    });

    // delete_comment埋点
    const deleteComment = picoEvent.on('delete_comment', ({ data }) => {
      const { commentItem } = data;
      const eventParams: appTrackType.DeleteComment = {
        group_id: commentItem.root.item_id,
        group_title: commentItem.root.name,
        is_reply: commentItem.comment.item_type === bytedance.ttarch.common.ItemType.Comment ? 1 : 0,
        reply_comment_id: commentItem.comment.item_id,
        reply_uid: commentItem.comment.user_id,
        comment_id: commentItem.comment.comment_id,
      };
      app.track({
        eventName: 'delete_comment',
        params: eventParams,
        appAppendKeyList: ['category_name', 'tab_name'],
      });
    });

    // unfavorite埋点
    const unFavorite = picoEvent.on('unfavorite', ({ data }) => {
      const { favoriteItem } = data;
      const eventParams: appTrackType.Unfavorite = {
        group_id: favoriteItem.item_id,
        group_title: favoriteItem.name,
        group_type: appTrackType.GroupType.post,
        position: appTrackType.Position.detail,
      };
      app.track({
        eventName: 'unfavorite',
        params: eventParams,
        appAppendKeyList: ['category_name', 'tab_name'],
      });
    });
    // click_report埋点
    const clickReport = picoEvent.on('click_report', ({ data }) => {
      const eventParams: appTrackType.Unfavorite = {
        group_id: data.group_id,
        group_type: appTrackType.GroupType.post,
        position: appTrackType.Position.detail,
      };
      app.track({
        eventName: 'click_report',
        params: eventParams,
        appAppendKeyList: ['category_name', 'tab_name'],
      });
    });
    // reportShow埋点
    const reportShow = picoEvent.on('report_show', ({ data }) => {
      app.track({
        eventName: 'enter_report_all_reason_choose',
        params: data,
      });
    });
    const reportSubmit = picoEvent.on('report_submit', ({ data }) => {
      app.track({
        eventName: 'report_submit',
        params: data,
      });
    });
    // 话题点击
    const clickTopic = picoEvent.on('click_topic', ({ data }) => {
      const { postInfo, topicInfo } = data;
      const is_recommend = topicInfo?.reco_status?.is_recommend;
      const eventParams = {
        is_rec: is_recommend ? 1 : 0,
        group_type: appTrackType.GroupType.post,
        group_topic: topicInfo?.data?.name || postInfo?.topics?.map(cur => cur.name || '')?.join(',') || '',
        topic_id: topicInfo?.data?.topic_id || postInfo?.topics?.map(cur => cur.topic_id || '')?.join(',') || '',
      };
      app.track({
        eventName: 'topic_detail_enter',
        params: eventParams,
        appAppendKeyList: ['category_name', 'subcategory_name', 'tab_name'],
      });
    });

    // 帖子详情页展现
    const enterPostDetail = picoEvent.on('enter_post_detail', ({ data, context }) => {
      const { postInfo, homePageInfo = {} } = data;
      const rank = findRank(context);
      const eventParams = {
        cell_order: rank,
        group_rank: typeof rank === 'number' ? 1 : undefined,
        group_title: postInfo.content.name,
        group_type: appTrackType.GroupType.post,
        group_id: postInfo.content?.item_id,
        is_self: context[0].userId
          ? Number(context[0].userId === postInfo.user?.user_id)
          : Number(postInfo.user?.user_id === data.curUserId),
        author_uid: postInfo.user?.user_id,
        pic_url: postInfo.content?.cover_image.url,
        is_sticked_top: postInfo.pool_status?.is_top ? 1 : 0,
        is_selected: postInfo.pool_status?.is_good ? 1 : 0,
        ...homePageInfo,
      };
      app.track({
        eventName: 'post_detail_show',
        params: eventParams,
        appAppendKeyList: ['category_name', 'subcategory_name', 'tab_name'],
      });
    });
    // 点击@的用户
    const clickAt = picoEvent.on('show_homepage_page', ({ data }) => {
      app.track({
        eventName: 'show_homepage_page',
        params: {
          ...data,
        },
      });
    });

    const readAll = picoEvent.on('read_all_click', ({ data }) => {
      app.track({
        eventName: 'read_all_click',
        params: { ...data },
      });
    });

    const EditTopicClick = picoEvent.on('topic_click', ({ data }) => {
      app.track({
        eventName: 'topic_click',
        params: { ...data },
        appAppendKeyList: ['category_name', 'tab_name'],
      });
    });

    const EditAtButtonClick = picoEvent.on('at_button_click', ({ data }) => {
      const eventParams = {
        content_type: 'post',
        group_forum: '',
        group_id: data.item_id || '',
        group_subforum: '',
        group_title: data.name || '',
        group_type: '',
      };
      app.track({
        eventName: 'at_button_click',
        params: eventParams,
        appAppendKeyList: ['category_name', 'subcategory_name', 'tab_name'],
      });
    });

    const EditPostSuccess = picoEvent.on('post_success', ({ data }) => {
      app.track({
        eventName: 'post_success',
        params: { ...data },
        appAppendKeyList: ['category_name', 'tab_name'],
      });
    });

    const EditPostEnter = picoEvent.on('edit_post', ({ data }) => {
      const { value } = data.data;
      app.track({
        eventName: 'edit_post',
        params: {
          group_type: appTrackType.GroupType.post,
          group_id: value.itemId || 0,
          group_title: value.name || '',
          group_status: value.status < 1 ? 'not_pass' : 'normal',
        },
        appAppendKeyList: ['category_name', 'subcategory_name', 'tab_name'],
      });
    });

    return () => {
      postCardClientShow();
      commentCardClientShow();
      clickMoreComment();
      enterComment();
      closeComment();
      enterPgc();
      checkPgcInfo();
      signIn();
      checkUserCenter();
      clickDeleteComment();
      deleteComment();
      unFavorite();
      clickReport();
      clickTopic();
      enterPostDetail();
      clickAt();
      readAll();
      reportShow();
      reportSubmit();
      EditTopicClick();
      EditAtButtonClick();
      EditPostSuccess();
      EditPostEnter();
    };
  }, [eventDataRef.current]);
  return [eventDataRef];
}
export default useAppTrackHook;
