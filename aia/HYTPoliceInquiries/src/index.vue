<template>
  <div class="hyt-police-inquiries-container">
    <!-- 检索框 -->
    <HYTSearch
      v-bind="$attrs"
      :formConfig="_formConfig"
      :queryLoading="queryLoading"
      :exportLoading="exportLoading"
      @search="handleSearch"
      @reset="handleReset"
      @export="handleExport"
      @advanced-search="handleAdvancedSearch"
    />
    <slot name="middle"></slot>
    <transition name="fade-transform" mode="out-in">
      <!-- 列表框 -->
      <HYTPoliceInquiriesList
        v-if="showInquiriesList"
        v-bind="$attrs"
        :params="searchParams"
        @handleEvent="handleEvent"
        @setLoading="handleSetLoading"
      >
        <template v-for="(value, name) in $scopedSlots" #[name]="slotData">
          <slot :name="name" v-bind="slotData" />
        </template>
      </HYTPoliceInquiriesList>
    </transition>
  </div>
</template>

<script>
// 引入 国际化混入
import locate from '../../../src/mixins/locale.js';
// 引入 工具函数
import { downloadFile } from './tool/file';
// 引入 时间插件
import moment from 'moment';
// 引入 工具函数
import { getSessionStorage, setSessionStorage } from '../../HYTSearch/src/utils/index.js';
// 引入 字典接口
import { getDictList, onDownLoadExcel } from './server/index.js';
// 引入 字典列表
import { effectivenessArr, signFlagArr, feedbackFlagArr, linkIdentityArr, violationStatusArr } from './dicts/index.js';
// 引入 查询条件
import HYTSearch from '../../HYTSearch/src/index.vue';
// 引入 警情查询列表
import HYTPoliceInquiriesList from '../../HYTPoliceInquiriesList/src/index.vue';
export default {
  name: 'HYTPoliceInquiries',
  mixins: [locate],
  components: {
    HYTSearch,
    HYTPoliceInquiriesList
  },
  props: {
    // 是否默认导出内部函数
    exportDefault: {
      type: Boolean,
      default: true
    },
    // search 组件 排除不要的高级搜索项
    advancedFieldExinclude: {
      type: Array,
      default: () => []
    },
    // 是否显示警情列表
    showInquiriesList: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      // 检索参数
      searchParams: {},
      // 检索框默认配置
      formConfig: [
        {
          type: 'quick-time-selection',
          timePeriodTypeRadio: true, // 是否 为 当前、最近时间特殊选择
          label: this.t('hyt.commons.timeSelection'), // 时间选择
          sm: { span: 3 },
          xxl: { span: 3 }
        },
        {
          type: 'range-picker',
          label: this.t('hyt.commons.period'), // 时段
          prop: 'dateRange',
          dateProps: ['startDate', 'endDate'],
          value: [
            moment().startOf('day').format('YYYY-MM-DD HH:mm:ss'),
            moment().add(1, 'days').startOf('day').format('YYYY-MM-DD HH:mm:ss')
          ],
          colClass: 'range-picker-wrapper',
          format: 'YYYY/MM/DD HH:mm:ss',
          showTime: { format: 'HH:mm' },
          showArrow: true,
          allowClear: false,
          valueFormat: 'YYYY-MM-DD HH:mm:ss', // 绑定值的格式
          sm: { span: 7 },
          xxl: { span: 5 }
        },
        {
          type: 'text',
          prop: 'id',
          label: this.t('hyt.policeInquiries.policeOrderNumber'), // 警单号
          value: '',
          placeholder: this.t('hyt.policeInquiries.policeOrderNumber'), // 警单号
          allowClear: true,
          sm: { span: 3 },
          xxl: { span: 3 }
        },
        {
          type: 'text',
          prop: 'caseKeyWord',
          label: this.t('hyt.policeInquiries.policeKeywords'), // 警情关键字
          value: '',
          placeholder: `${this.t('hyt.policeInquiries.policeInformationAddress')}/${this.t('hyt.policeInquiries.alarmContent')}`, // 警情地址/报警内容
          allowClear: true,
          sm: { span: 3 },
          xxl: { span: 3 }
        },
        {
          type: 'text',
          prop: 'callerInfoKeyWord',
          label: this.t('hyt.policeInquiries.alarmPersonInformation'), // 报警人信息
          value: '',
          placeholder: `${this.t('hyt.commons.mobilePhone')}/${this.t('hyt.commons.name')}/${this.t('hyt.commons.idCard')}`, // 警情地址/报警内容
          allowClear: true,
          sm: { span: 3 },
          xxl: { span: 3 }
        },
        {
          type: 'advanced-search',
          sm: { span: 2 },
          xxl: { span: 2 }
        },
        {
          type: 'buttons',
          sm: { span: 3 },
          xxl: { span: 5 }
        },
        {
          type: 'select',
          mode: 'multiple',
          prop: 'calledNoTypeList',
          label: this.t('hyt.policeInquiries.alarmType'), // 接警类型
          isReturnArrayValue: true,
          value: undefined,
          options: [],
          valueProp: 'dictKey',
          labelProp: 'dictValue',
          allowClear: true,
          maxTagCount: 1,
          sm: { span: 4 },
          xxl: { span: 4 },
          colClass: 'width-20-percentage',
          advancedSearch: true
        },
        {
          type: 'select',
          mode: 'multiple',
          prop: 'sourceTypeList',
          label: this.t('hyt.policeInquiries.policeInformationSource'), // 警情来源
          isReturnArrayValue: true,
          value: undefined,
          valueProp: 'dictKey',
          labelProp: 'dictValue',
          allowClear: true,
          maxTagCount: 1,
          sm: { span: 4 },
          xxl: { span: 4 },
          colClass: 'width-20-percentage',
          advancedSearch: true
        },
        {
          type: 'select',
          mode: 'multiple',
          prop: 'handleTypeList',
          label: this.t('hyt.policeInquiries.incomingCallType'), // 来话类型
          isReturnArrayValue: true,
          value: undefined,
          valueProp: 'dictKey',
          labelProp: 'dictValue',
          allowClear: true,
          maxTagCount: 1,
          sm: { span: 4 },
          xxl: { span: 4 },
          colClass: 'width-20-percentage',
          advancedSearch: true
        },
        {
          type: 'org-cascader',
          prop: 'receiptDeptOrgCode',
          label: this.t('hyt.policeInquiries.alarmReceivingUnit'), // 接警单位
          value: [],
          filterable: true,
          collapseTags: true,
          leastOne: false,
          showIncludeSubOrg: true,
          includeSubOrgProp: 'receiptOrgIncludeSubFlag',
          sm: { span: 4 },
          xxl: { span: 4 },
          colClass: 'width-20-percentage',
          advancedSearch: true
        },
        {
          type: 'text',
          prop: 'receiptName',
          label: this.t('hyt.policeInquiries.pickUpThePolice'), // 接警员
          value: '',
          allowClear: true,
          sm: { span: 4 },
          xxl: { span: 4 },
          colClass: 'width-20-percentage',
          advancedSearch: true
        },
        {
          type: 'org-cascader',
          prop: 'adminDeptOrgCode',
          label: this.t('hyt.policeInquiries.jurisdictionalUnit'), // 管辖单位
          value: [],
          ref: 'adminDeptOrgCodeRef',
          filterable: true,
          collapseTags: true,
          leastOne: false,
          showIncludeSubOrg: true,
          checkSameLevel: false, // 是否校验勾选同级
          includeSubOrgProp: 'adminOrgIncludeSubFlag',
          sm: { span: 4 },
          xxl: { span: 4 },
          colClass: 'width-20-percentage',
          advancedSearch: true
        },
        {
          type: 'case-type-cascader',
          prop: 'caseTypeList',
          label: this.t('hyt.policeInquiries.policeSituationClassification'), // 警情分类
          value: [],
          filterable: true,
          collapseTags: true,
          sm: { span: 4 },
          xxl: { span: 4 },
          colClass: 'width-20-percentage',
          advancedSearch: true
        },
        {
          type: 'select',
          mode: 'multiple',
          prop: 'levelList',
          label: this.t('hyt.policeInquiries.policeLevel'), // 警情等级
          isReturnArrayValue: true,
          value: undefined,
          valueProp: 'dictKey',
          labelProp: 'dictValue',
          allowClear: true,
          maxTagCount: 1,
          sm: { span: 4 },
          xxl: { span: 4 },
          colClass: 'width-20-percentage',
          advancedSearch: true
        },
        {
          type: 'select',
          mode: 'multiple',
          prop: 'stateList',
          label: this.t('hyt.policeInquiries.alertStatus'), // 警情状态
          isReturnArrayValue: true,
          value: undefined,
          valueProp: 'dictKey',
          labelProp: 'dictValue',
          allowClear: true,
          maxTagCount: 1,
          sm: { span: 4 },
          xxl: { span: 4 },
          colClass: 'width-20-percentage',
          advancedSearch: true
        },
        {
          type: 'select',
          prop: 'invalidFlag',
          label: this.t('hyt.policeInquiries.alertEffectiveness'), // 警情有效性
          value: '0', // 默认有效
          options: effectivenessArr,
          allowClear: true,
          sm: { span: 4 },
          xxl: { span: 4 },
          colClass: 'width-20-percentage',
          advancedSearch: true
        },
        {
          type: 'text',
          prop: 'dispatcherName',
          label: this.t('hyt.policeInquiries.sendThePolice'), // 派警员
          value: '',
          allowClear: true,
          sm: { span: 4 },
          xxl: { span: 4 },
          colClass: 'width-20-percentage',
          advancedSearch: true
        },
        {
          type: 'select',
          prop: 'signFlag',
          label: this.t('hyt.policeInquiries.receiptStatus'), // 签收状态
          value: undefined,
          options: signFlagArr,
          allowClear: true,
          sm: { span: 4 },
          xxl: { span: 4 },
          colClass: 'width-20-percentage',
          advancedSearch: true
        },
        {
          type: 'org-cascader',
          prop: 'processDeptCode',
          label: this.t('hyt.policeInquiries.policeUnit'), // 出警单位
          value: [],
          filterable: true,
          collapseTags: true,
          leastOne: false,
          showIncludeSubOrg: true,
          includeSubOrgProp: 'processOrgIncludeSubFlag',
          sm: { span: 4 },
          xxl: { span: 4 },
          colClass: 'width-20-percentage',
          advancedSearch: true
        },
        {
          type: 'select-request',
          prop: 'dispatchPersonnel',
          label: this.t('hyt.policeInquiries.dispatchThePoliceForce'), // 出动警力
          value: undefined,
          showSearch: true,
          allowClear: true,
          showArrow: false,
          filterOption: false,
          loading: false,
          keyProp: 'id',
          valueProp: 'id',
          formValueProp: 'name', // 最后表单要传列表的字段值，没有就是取列表数据的valueProp指定的字段值
          labelProp: 'name',
          sm: { span: 4 },
          xxl: { span: 4 },
          colClass: 'width-20-percentage',
          advancedSearch: true
        },
        {
          type: 'select',
          prop: 'feedbackFlag',
          label: this.t('hyt.policeInquiries.whetherFeedback'), // 是否反馈
          value: undefined,
          options: feedbackFlagArr,
          allowClear: true,
          sm: { span: 4 },
          xxl: { span: 4 },
          colClass: 'width-20-percentage',
          advancedSearch: true
        },
        {
          type: 'org-cascader',
          prop: 'jurisdictionalOrgIdentifier',
          label: this.t('hyt.policeInquiries.feedbackJurisdiction'), // 反馈管辖单位
          value: [],
          filterable: true,
          collapseTags: true,
          leastOne: false,
          showIncludeSubOrg: true,
          includeSubOrgProp: 'jurisdictionalOrgIncludeSubFlag',
          sm: { span: 4 },
          xxl: { span: 4 },
          colClass: 'width-20-percentage',
          advancedSearch: true
        },
        {
          type: 'case-type-cascader',
          prop: 'feedbackCaseTypeList',
          label: this.t('hyt.policeInquiries.feedbackAlarmClassification'), // 反馈警情分类
          value: [],
          filterable: true,
          collapseTags: true,
          sm: { span: 4 },
          xxl: { span: 4 },
          colClass: 'width-20-percentage',
          advancedSearch: true
        },
        {
          type: 'select',
          mode: 'multiple',
          prop: 'alarmHandlingStatusList',
          label: this.t('hyt.policeInquiries.policeDisposalResult'), // 警情处置结果
          isReturnArrayValue: true,
          value: undefined,
          valueProp: 'dictKey',
          labelProp: 'dictValue',
          allowClear: true,
          maxTagCount: 1,
          sm: { span: 4 },
          xxl: { span: 4 },
          colClass: 'width-20-percentage',
          advancedSearch: true
        },
        {
          type: 'select',
          prop: 'linkIdentityList',
          label: this.t('hyt.policeInquiries.linkagePoliceSituation'), // 联动警情
          isReturnArrayValue: true,
          value: undefined,
          options: linkIdentityArr,
          allowClear: true,
          sm: { span: 4 },
          xxl: { span: 4 },
          colClass: 'width-20-percentage',
          advancedSearch: true
        },
        {
          type: 'select',
          prop: 'violationStatusList',
          label: this.t('hyt.policeInquiries.violationStatus'), // 违规状态
          isReturnArrayValue: true,
          value: undefined,
          options: violationStatusArr,
          allowClear: true,
          sm: { span: 4 },
          xxl: { span: 4 },
          colClass: 'width-20-percentage',
          advancedSearch: true
        }
      ],
      // 表格加载 loading
      queryLoading: false,
      exportLoading: false
    };
  },
  computed: {
    // 动态 检索框默认配置
    _formConfig() {
      let formConfig = this.formConfig.filter(item => {
        return !this.advancedFieldExinclude.includes(item.prop);
      });
      return formConfig;
    }
  },
  created() {
    // 初始化
    this.init();
  },
  methods: {
    /**
     *  初始化
     */
    init() {
      // 初始化 字典集合数据
      this.initDict();
    },
    /**
     *  初始化 字典集合数据
     */
    initDict() {
      this.formConfig.forEach(async item => {
        const { prop } = item;
        // 接警类型
        if (prop === 'calledNoTypeList') {
          item.options = await this.getDictList({ systemCode: 'SYS_CODE_VCS', dictType: 'JJLX' }, item);
        }
        // 警情来源
        if (prop === 'sourceTypeList') {
          item.options = await this.getDictList({ dictType: 'DIC001' }, item);
        }
        // 来话类型
        if (prop === 'handleTypeList') {
          item.options = await this.getDictList({ dictType: 'DIC002' }, item);
        }
        // 警情等级
        if (prop === 'levelList') {
          item.options = await this.getDictList({ dictType: 'DIC017' }, item);
        }
        // 警情状态
        if (prop === 'stateList') {
          item.options = await this.getDictList({ dictType: 'DIC019' }, item);
        }
        // 警情处置结果
        if (prop === 'alarmHandlingStatusList') {
          item.options = await this.getDictList({ dictType: 'DIC024' }, item);
        }
      });
    },
    /**
     *  请求 字典集合
     */
    async getDictList(params = {}, item = {}) {
      const { prop = '', valueProp = 'value', labelProp = 'label', isAllData = true } = item;
      try {
        // 获取缓存
        const dictCacheList = getSessionStorage(`${prop}-dict`) || [];
        // 存在缓存 读缓存内容
        if (dictCacheList.length) {
          return Promise.resolve(dictCacheList);
        }
        const { data } = await getDictList(params);
        const { data: list = [] } = data;
        // 设置缓存
        setSessionStorage(`${prop}-dict`, list);
        // 是否添加 全部 项
        // if (isAllData) {
        //   const item = {
        //     [valueProp]: '',
        //     [labelProp]: '全部' // 全部
        //   };
        //   list = [item, ...list];
        // }
        return Promise.resolve(list);
      } catch (e) {
        console.log(e);
      }
    },
    /**
     *  点击 检索
     */
    handleSearch(params = {}) {
      // 查询按钮 loading 加载
      this.handleSetLoading(true);
      // 设置 检索参数
      this.searchParams = { ...params };
      // 发送 search 参数
      this.$emit('search', { ...params });
    },
    /**
     *  点击 重置 按钮
     */
    handleReset() {
      // 发送 reset 事件
      this.$emit('reset');
    },
    /**
     *  点击 导出按钮
     */
    async handleExport(params) {
      // 默认导出
      if (this.exportDefault) {
        // 导出 loading 加载
        this.handleSetExportLoading(true);
        try {
          const { data: res } = await onDownLoadExcel(params);
          const { type } = res;
          // 判断是否返回json报错信息
          if (type === 'application/json') {
            const reader = new FileReader(); // 创建一个FileReader实例
            reader.readAsText(res, 'utf-8'); // 读取文件,结果用字符串形式表示
            reader.onload = () => {
              // 读取完成后,**获取reader.result**
              const { message, code } = JSON.parse(reader.result);
              if (code !== '200') {
                this.$notification.destroy();
                return this.$notification.error({
                  message
                });
              }
              if (!res.data) {
                return this.$notification.warn({
                  message
                });
              }
            };
            return;
          }
          const blob = new Blob([res], {
            type: 'application/vnd.ms-excel;charset=utf-8'
          });
          downloadFile(blob, '警情列表.xlsx');
        } catch (e) {
          this.$notification.destroy();
          this.$notification.error({
            message: e?.message
          });
        } finally {
          // 导出 loading 关闭
          this.handleSetExportLoading(false);
        }
      }
      // 发送 search 参数
      this.$emit('export', { ...params });
    },
    /**
     *  点击 高级按钮回调
     */
    handleAdvancedSearch(flag, params) {
      // 发送 高级检索按钮回调
      this.$emit('advanced-search', flag, { ...params });
    },
    /**
     *  列表组件事件组回调
     */
    handleEvent(e) {
      const { type, record } = e;
      this.$emit(type, record);
    },
    /**
     *  列表 loading 加载回调
     */
    handleSetLoading(flag) {
      this.queryLoading = flag;
    },
    /**
     *  导出 loading 加载回调
     */
    handleSetExportLoading(flag) {
      this.exportLoading = flag;
    }
  }
};
</script>

<style lang="less" scoped>
.hyt-police-inquiries-container {
  display: flex;
  flex-direction: column;
  background-color: #fff;
  height: 100%;
  .hyt-search-container {
    flex-shrink: 0;
    flex-grow: 0;
  }
  .hyt-police-inquiries-list-container {
    flex: 1;
  }
  ::v-deep .width-20-percentage {
    width: 20%;
  }
}
/* fade-transform */
.fade-transform-leave-active,
.fade-transform-enter-active {
  transition: all 0.5s;
}

.fade-transform-enter {
  opacity: 0;
  transform: translateX(-30px);
}

.fade-transform-leave-to {
  opacity: 0;
  pointer-events: none;
  transform: translateX(30px);
}
</style>
