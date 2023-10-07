import { useContext, useEffect, useRef } from 'react';
import { DataEventContext } from '@/components/common';
import eventTrack from '@/web/utils/eventTrack';
import { bytedance } from '@/api/api-generate/ttarchApi';
import { eventTrackType } from '@/web/hooks/useEventCenterHook';
import { IsOversea } from '@/utils';

const REPORT_REASON = {
  [bytedance.ttarch.interact.TipOffType.QualityPoor]: 'low_quality',
  [bytedance.ttarch.interact.TipOffType.Marketing]: 'ad',
  [bytedance.ttarch.interact.TipOffType.Vulgar]: 'pornographic',
  [bytedance.ttarch.interact.TipOffType.Infringement]: 'plagiarize',
  [bytedance.ttarch.interact.TipOffType.Inadequate]: 'not_real',
  [bytedance.ttarch.interact.TipOffType.Illegal]: 'illegal',
};

export default () => {
  const dataEvent: any = useContext(DataEventContext);
  const timeRef = useRef<number>();
  const categoryRef = useRef<any>({});
  const appID = IsOversea() ? PICO_APP_ID_VA : PICO_APP_ID;

  useEffect(() => {
    dataEvent.on('search_tab_enter', () => {
      eventTrack.track('search_tab_enter', {});
    });

    dataEvent.on('show_search_result', data => {
      const {
        data: { details, zone },
      } = data;
      eventTrack.track('search_success', {
        query: details.query,
        search_type: zone,
        is_return_result: details.isEmpty ? 0 : 1,
      });
    });

    dataEvent.on('log_in', () => {
      eventTrack.track('log_in', {});
    });
    dataEvent.on('log_out', () => {
      eventTrack.track('log_out', {});
    });
    dataEvent.on('post_success', data => {
      eventTrack.track('post_success', {
        ...data.data,
        group_photo_url: data.data.group_photo_url.key,
        is_draft: 1,
      });
    });
    dataEvent.on('write_post', data => {
      eventTrack.track('write_post', {
        ...data.data,
      });
    });
    dataEvent.on('click_report', data => {
      const {
        data: { reportInfo },
      } = data;
      eventTrack.track('report', {
        group_type: 'post',
        group_id: reportInfo.item_id,
        group_reason: REPORT_REASON[reportInfo.tipoff_type],
      });
    });
    dataEvent.on('show_comment_area', data => {
      const {
        data: { parentInfo },
        context,
      } = data;
      const current = context[context.length - 2];
      const evtParams: eventTrackType.EventEnterComment = {
        group_type: eventTrackType.GroupType.post,
        group_id: parentInfo.id,
        group_title: current?.postInfo?.content?.name,
        enter_type: eventTrackType.EnterType.scroll,
        group_topic: current?.postInfo?.topics?.map(cur => cur.name || '')?.join(',') || '',
      };
      eventTrack.track('enter_comment', evtParams);
      timeRef.current = new Date().getTime();
    });
    dataEvent.on('hide_comment_area', data => {
      const {
        data: { parentInfo },
        context,
      } = data;
      const current = context[context.length - 2];

      if (!timeRef.current && parentInfo.enter_type) {
        // 已经离开评论区不上报
        return;
      }
      const evtParams: eventTrackType.EventCloseComment = {
        group_type: eventTrackType.GroupType.post,
        group_id: parentInfo.id,
        group_title: parentInfo.title || current?.postInfo?.content?.name,
        enter_type: eventTrackType.EnterType.scroll,
        stay_time: parentInfo.stay_time ? parentInfo.stay_time : new Date().getTime() - timeRef.current!,
        group_topic: current?.postInfo?.topics?.map(cur => cur.name || '')?.join(',') || '',
      };
      eventTrack.track('close_comment', evtParams);
      timeRef.current = 0;
      categoryRef.current = {};
    });
    dataEvent.on('topic_click', data => {
      eventTrack.track('topic_click', {
        tab_name: data.data.tab_name,
      });
    });

    // imc曝光埋点
    dataEvent.on('imc_or_show', data => {
      const {
        data: { extra, ...others },
      } = data;
      const evtParams = { ...others };
      if (extra) {
        evtParams.extra = typeof extra === 'string' ? extra : JSON.stringify(extra);
      }
      eventTrack.track('imc_or_show', { ...evtParams, app_id: `${appID}` });
    });

    // imc点击埋点
    dataEvent.on('imc_or_click', data => {
      const {
        data: { extra, ...others },
      } = data;
      const evtParams = { ...others };
      if (extra) {
        evtParams.extra = typeof extra === 'string' ? extra : JSON.stringify(extra);
      }
      eventTrack.track('imc_or_click', { ...evtParams, app_id: `${appID}` });
    });
  }, []);

  return null;
};
