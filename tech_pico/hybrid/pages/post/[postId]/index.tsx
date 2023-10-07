// 重要代码简略为

// export default ()=>{
//   const dataEventContext = useContext(DataEventContext);    
//   const onUserClick = user => {
//       dataEventContext.trigger('click_user', {
//         user,
//       });
//   };
// }
/* eslint-disable eslint-comments/disable-enable-pair */
import cns from 'classnames';
import { useEffect, useReducer, useRef, useState, useContext } from 'react';
import { content, view } from '@bridge/pico';
import { IconArrowDown } from '@arco-design/mobile-react/esm/icon';
import { useModel } from '@jupiter/plugin-runtime/model';
import { useMounted } from '@byted/hooks';
import styles from './index.less';
import { usePostInfo } from './index.data';
import { I18nt } from '@/utils/globalEnv';
import { DataEventContext, DataEventProvider, CommunityConfigContext } from '@/components/common';
import PostDetail from '@/hybrid/components/PostDetail';
import Empty from '@/hybrid/components/Empty';
import RichTextViewer from '@/components/RichText/RichTextViewer';
import useSetTitle from '@/hybrid/components/SetTitleHook';
import CommentList, { uniqIDArrReducer } from '@/community/components/CommentList';
import { documentProxy } from '@/web/utils';
import LoadMore, { LoadMoreStatus } from '@/hybrid/components/LoadMore';
import PCArcoConfigProvider from '@/hybrid/components/PcArcoConfigProvider';
import userModel from '@/hybrid/models/userModel';
import { CommentItem, ReplyItem } from '@/community/components/CommentItem';
import { bytedance } from '@/api/api-generate/ttarchApi';
import { ConfirmMasking } from '@/hybrid/components/Confirm';
import picoApiJsb from '@/api/picoApiJsb';
import { scrollToAnchor, useAnchorScroll } from '@/utils/view';
import zlink from '@/utils/zlink';
import { getParamsFromUrl } from '@/utils/url';
import VisibleWrapper from '@/components/VisibleWrapper';
import { getAppVersion } from '@/hybrid/utils/env';

export default () => {
  useSetTitle({ title: I18nt('pico_cmn_web_post_detail', '帖子详情') });
  const viewerRef = useRef();
  const { postId, postInfo, isEmpty, isError } = usePostInfo();
  const needPost = !isEmpty && !isError;
  const documentRef = useRef(documentProxy);
  const [userState, { checkAccountPostAuth }] = useModel(userModel);
  const [showDelConfirmModal, setShowDelConfirmModal] = useState(false);
  const [tgtDelCmnt, setTgtDelCmnt] = useState<CommentItem>();
  const [removedCommentIDs, removedCommentIDsDispatch] = useReducer(uniqIDArrReducer, []);
  const dataEventContext = useContext(DataEventContext);
  const { userAction } = useContext(CommunityConfigContext);

  const onUserClick = user => {
    userAction.openUser(user.user_id);
    dataEventContext.trigger('click_user', {
      user,
      postInfo,
      curUserId: userState.uid,
      type: user.user_id === postInfo.user?.user_id ? 'content' : 'comments',
    });
  };

  const onReportPost = data => {
    dataEventContext.trigger?.('click_report', {
      group_id: data.content.item_id,
    });
    if (getAppVersion() >= '2.1.2') {
      userAction.openExternal(`https://${location.host}/hybrid/report?app_key=1&item_id=${postId}&item_type=2`);
    } else {
      content.report({
        itemType: data.content.item_type,
        itemID: data.content.item_id,
      });
    }
  };

  const onCommentDetailClick = (comment: CommentItem) => {
    userAction.openComment(comment.comment.comment_id);
    dataEventContext.trigger?.('click_more_comment', {
      comment,
      postInfo,
    });
  };

  const onReplyCommentClick = (comment: CommentItem | ReplyItem) => {
    content.reply({
      itemType: bytedance.ttarch.common.ItemType.Comment,
      itemID: comment.comment.comment_id,
      replyType: 'reply',
      displayName: comment.user?.name || I18nt('log_out_user', '注销用户'),
      userId: comment.user?.user_id || '',
    } as any);
  };

  const onDeleteCommentClick = (comment: CommentItem) => {
    setTgtDelCmnt(comment);
    setShowDelConfirmModal(true);
  };
  const onReportCommentClick = (comment: CommentItem) => {
    userAction.openExternal(`https://${location.host}/hybrid/report?app_key=2&item_id=${comment?.comment?.comment_id}&item_type=21`);
  };

  const handleDeleteComment = async () => {
    const tgtCmntID = tgtDelCmnt?.comment.comment_id;

    if (tgtCmntID) {
      try {
        await picoApiJsb.DeleteComment({
          comment_id: tgtCmntID,
        });

        setShowDelConfirmModal(false);
        removedCommentIDsDispatch({ type: 'append', payload: tgtCmntID });
        view.toast({
          text: I18nt('delete_successfully', '删除成功'),
        });
        view.updateItemInfo({
          item_id: postId,
          item_type: bytedance.ttarch.common.ItemType.Doc,
        });
      } catch (e) {
        setShowDelConfirmModal(false);
      }
      setTgtDelCmnt(undefined);
    } else {
      view.toast({
        text: I18nt('data_error', '数据错误'),
      });
    }
  };

  useEffect(() => {
    const sub = content.replyComplete(data => {
      if (data.code) {
        view.toast({
          text: I18nt('pico_cmn_web_post_comment_success_reviewed_show', '评论发布成功！将在审核通过后展示'),
        });
      }
    });
    // at用户点击
    const onAtUserClick = e => {
      const current = e.target as HTMLBRElement;
      if (current?.classList?.contains('pico-at') && current?.dataset.opType === 'at') {
        current?.dataset.userId &&
          userAction.openUser(current?.dataset.userId, {
            section: 'at_button',
          } as any);
        e.stopPropagation();
      }
    };

    document.getElementsByClassName('post-content-wrap')[0].addEventListener('click', onAtUserClick);
    document.getElementsByClassName('comm-comment-list-comment-mobile')[0].addEventListener('click', e => onAtUserClick(e));

    return () => {
      sub.remove();
      document.getElementsByClassName('post-content-wrap')?.[0]?.removeEventListener('click', onAtUserClick);
      document.getElementsByClassName('comm-comment-list-comment-mobile')?.[0]?.removeEventListener('click', onAtUserClick);
    };
  }, []);

  useAnchorScroll(location.hash);

  useMounted(() => {
    const urlParams = getParamsFromUrl();
    const needScroll = urlParams.at_content_type === 'Comment' && Boolean(urlParams.comment_id);
    if (needScroll) {
      scrollToAnchor('#comment-list', { timeout: 1000 });
    } else {
      view.scroll(({ data: { anchor } }) => {
        scrollToAnchor(anchor);
      });
    }
    view.togglePostOpBar({ show: true });
    view.toggleCommentOpBar({ show: false });
    view.loading({ show: false });
    return () => {
      view.togglePostOpBar({
        show: false,
      });
    };
  });

  useEffect(() => {
    if (postInfo?.content) {
      const urlParams = getParamsFromUrl();
      let homePageInfo = {};
      if (urlParams.tab_name && urlParams.tab_name === 'homepage') {
        const { subsection_id, subsection_name, subsection_rank, is_second_page, home_section_id, home_section_name, section_rank } =
          urlParams;
        homePageInfo = {
          subsection_id,
          subsection_name,
          subsection_rank: subsection_rank ? Number(subsection_rank) : subsection_rank,
          is_second_page: is_second_page ? Number(is_second_page) : is_second_page,
          section_id: home_section_id,
          section_name: home_section_name,
          section_rank: section_rank ? Number(section_rank) : section_rank,
        };
      }
      dataEventContext.trigger?.('enter_post_detail', { postInfo, curUserId: userState.uid, homePageInfo });

      if (viewerRef?.current) {
        (viewerRef.current as any)?.addEventListener('click', (e: any) => {
          if (e.target?.currentSrc && e.target?.nodeName === 'IMG') {
            view.viewImage({
              imageUrls: [e.target?.currentSrc],
              index: 0,
              description: '',
            });
          }
        });
      }
    }
  }, [postInfo, viewerRef]);

  return (
    <div className={cns(styles.wrap, 'pico-post-wrap')}>
      {!needPost ? (
        <div className={cns(styles.empty, 'post-empty-wrap')}>
          <Empty description={isError ? I18nt('there_was_an_error__try_it_later~', '出错了，稍后试试吧') : undefined} />
        </div>
      ) : (
        <PostDetail
          onCategoryClick={currentCat => {
            userAction.openCategory(currentCat.category_id!);
          }}
          onCategoryListClick={() => {
            userAction.openCategoryGather();
          }}
          onTopicClick={(id, topicData) => {
            userAction?.openTopic?.(id, topicData);
            dataEventContext.trigger?.('click_topic', { topicInfo: topicData?.topics?.[0], postInfo: topicData });
          }}
          onUserClick={onUserClick}
          onReportClick={onReportPost}
          data={postInfo}
          detail={<RichTextViewer ref={viewerRef} content={postInfo.content?.content || ''} />}
        />
      )}
      <VisibleWrapper visible={!isEmpty}>
        <div id="comment-list" className={styles.comments}>
          <div className={styles['comment-list-container']}>
            <PCArcoConfigProvider>
              <DataEventProvider evtData={{ postInfo }}>
                <CommentList
                  firstCommentId={getParamsFromUrl().comment_id}
                  type="comment"
                  layout="mobile"
                  emptyElement={<Empty className={styles['comment-empty']} />}
                  tgtItemID={postId}
                  totalCommentsCount={postInfo.interact_status?.comment_count}
                  loadMoreContainerRef={documentRef}
                  autoRequest={true}
                  curUserID={userState.uid}
                  isCurUserAdmin={userState.isAdmin}
                  removedCommentIDs={removedCommentIDs}
                  publishValidFn={() => {
                    if (!userState.hasPostAuth) {
                      checkAccountPostAuth();
                      return false;
                    }
                    return true;
                  }}
                  onClickReply={onReplyCommentClick}
                  onClickDelete={onDeleteCommentClick}
                  onClickReport={onReportCommentClick}
                  onClickUser={onUserClick}
                  onClickContent={(comment: CommentItem) => {
                    userAction.openComment(
                      comment.comment.item_type === bytedance.ttarch.common.ItemType.Comment
                        ? comment.comment.parent_id
                        : comment.comment.comment_id,
                    );
                  }}
                  loadMoreRender={({ loadingMore, noMore, error, onRetry }) => {
                    let status: LoadMoreStatus = 'prepare';

                    if (loadingMore) {
                      status = 'loading';
                    } else if (error) {
                      status = 'retry';
                    } else if (noMore) {
                      status = 'nomore';
                    }

                    return <LoadMore className={styles['comment-load-more']} status={status} onClick={error && onRetry} />;
                  }}
                  replyLoadMoreRender={({ parentComment, noMore }) =>
                    noMore ? (
                      <div className={styles['reply-no-more-placeholder']} />
                    ) : (
                      <div className={styles['more-btn']} onClick={() => onCommentDetailClick(parentComment)}>
                        {I18nt('pico_cmn_web_view_more_reply', '查看更多回复')}
                        <IconArrowDown className={styles['down-icon']} />
                      </div>
                    )
                  }
                  commentPropsMapper={comment => ({
                    previewImage: false,
                    onClickImage: (_image, idx, images) =>
                      view.viewImage({
                        imageUrls: images.map(image => image?.url) as string[],
                        index: idx,
                        description: comment.comment.content,
                      }),
                  })}
                />
              </DataEventProvider>
            </PCArcoConfigProvider>
            <ConfirmMasking
              visible={showDelConfirmModal}
              close={() => {
                setShowDelConfirmModal(false);
                setTgtDelCmnt(undefined);
              }}
              contentProps={{
                content: I18nt('pico_cmn_web_confirm_delete', '删除评论之后不可恢复，确认删除吗？'),
                onOk: handleDeleteComment,
                cancelText: I18nt('pico_cmn_h5_cancel', '取消'),
                okText: I18nt('ok_', '确定'),
              }}
            />
          </div>
        </div>
      </VisibleWrapper>
    </div>
  );
};
