<template>
  <div id="test" class="hyt-police-inquiries-list-container">
    <a-table
      :columns="columns"
      :data-source="dataList"
      :pagination="pagination"
      :row-key="record => record.caseNo"
      :loading="loading"
      :scroll="scrollTop"
      :customRow="customRowEvent"
      :customHeaderRow="customHeaderRow"
      :rowClassName="rowClassNameCallBack"
      @change="changePage"
    >
      <!-- 表头 -->
      <div v-for="(item, index) in columns" :key="index" :slot="item.scopedSlots.title">
        <!-- 设置按钮 -->
        <div v-if="item.scopedSlots.title === 'tableSetting'">
          <a-icon type="setting" theme="filled" @click="handleSetting" />
        </div>

        <!-- 普通表头 -->
        <div v-else>
          <p v-for="(_item, _index) in item.child" :key="_index">
            {{ _item.title }}
          </p>
        </div>
      </div>
      <!-- 表内容 -->
      <div
        v-for="(item, itemIndex) in columns"
        :key="itemIndex"
        :slot="item.scopedSlots.customRender"
        slot-scope="text, record, index"
        class="line-clamp-2"
      >
        <!-- 多行处理 -->
        <div v-if="item.child && item.child.length">
          <div v-for="_item in item.child" :key="_item.dataIndex" class="line-clamp-1">
            <!-- ############################  特殊字段多行情况处理 ################################# -->
            <!-- 警情状态 -->
            <slot v-if="_item.dataIndex === 'caseState'" :name="_item.dataIndex" :record="record">
              <div>
                <div class="alertStateBlock" :class="`alertState${record.caseStateNo}`"></div>
                <a-tooltip>
                  <template slot="title">{{ record[_item.dataIndex] }}</template>
                  <span>{{ record[_item.dataIndex] }}</span>
                </a-tooltip>
              </div>
            </slot>

            <!-- 报警内容 -->
            <slot v-else-if="_item.dataIndex === 'caseDesc'" :name="_item.dataIndex" :record="record">
              <a-tooltip placement="topLeft" overlayClassName="tooltip-large">
                <template slot="title">{{ record[_item.dataIndex] }}</template>
                <span>{{ record[_item.dataIndex] }}</span>
              </a-tooltip>
            </slot>

            <!-- 警情有效性 -->
            <slot v-else-if="_item.dataIndex === 'invalidFlag'" :name="_item.dataIndex" :record="record">
              <a-tooltip>
                <template slot="title">{{
                  record.invalidFlag === '0' ? t('hyt.policeInquiriesList.valid') : t('hyt.policeInquiriesList.invalid')
                }}</template>
                <div class="alertStateBlock"></div>
                <span>{{
                  record.invalidFlag === '0' ? t('hyt.policeInquiriesList.valid') : t('hyt.policeInquiriesList.invalid')
                }}</span>
              </a-tooltip>
            </slot>

            <!-- 警情标签 -->
            <slot v-else-if="_item.dataIndex === 'alarmLableList'" :name="_item.dataIndex" :record="record">
              <a-tooltip placement="leftTop" overlayClassName="tooltip-large">
                <template slot="title">
                  <span v-for="(label, labelIndex) in record[_item.dataIndex]" :key="labelIndex" class="alarm-label">
                    {{ label }};
                  </span>
                </template>
                <span v-for="(label, labelIndex) in record[_item.dataIndex]" :key="labelIndex"> {{ label }}; </span>
              </a-tooltip>
            </slot>

            <!-- 警情反馈内容 -->
            <slot v-else-if="_item.dataIndex === 'feedbackContentList'" :name="_item.dataIndex" :record="record">
              <a-tooltip overlayClassName="tooltip-large">
                <template slot="title">
                  <span
                    v-for="(feedBack, feedBackIndex) in record[_item.dataIndex]"
                    :key="feedBackIndex"
                    class="alarm-label"
                  >
                    {{ feedBack }}
                  </span>
                </template>
                <span v-for="(feedBack, feedBackIndex) in record[_item.dataIndex]" :key="feedBackIndex">
                  {{ feedBack }}
                </span>
              </a-tooltip>
            </slot>
            <!-- 违规情况 -->
            <slot v-else-if="_item.dataIndex === 'violationStatus'" :name="_item.dataIndex" :record="record">
              <span>{{
                record[_item.dataIndex] === '0'
                  ? t('hyt.policeInquiriesList.violation')
                  : t('hyt.policeInquiriesList.nonViolation')
              }}</span>
            </slot>

            <!-- 其他插槽 -->
            <slot v-else :name="_item.dataIndex" :record="record">
              <a-tooltip>
                <template slot="title">{{ record[_item.dataIndex] }}</template>
                {{ record[_item.dataIndex] }}
              </a-tooltip>
              <br :key="_item.dataIndex" />
            </slot>
          </div>
          <!-- ############################  特殊字段多行情况处理 ################################# -->
        </div>

        <!-- ############################  特殊字段单行情况处理 ################################# -->
        <!-- 警情状态 -->
        <slot v-if="item.dataIndex === 'caseState'" :name="item.dataIndex" :record="record">
          <div>
            <div class="alertStateBlock" :class="`alertState${record.caseStateNo}`"></div>
            <a-tooltip>
              <template slot="title">{{ record[item.dataIndex] }}</template>
              <span>{{ record[item.dataIndex] }}</span>
            </a-tooltip>
          </div>
        </slot>

        <!-- 报警内容 -->
        <slot v-else-if="item.dataIndex === 'caseDesc'" :name="item.dataIndex" :record="record">
          <a-tooltip placement="topLeft" overlayClassName="tooltip-large">
            <template slot="title">{{ record[item.dataIndex] }}</template>
            <span>{{ record[item.dataIndex] }}</span>
          </a-tooltip>
        </slot>

        <!-- 警情有效性 -->
        <slot v-else-if="item.dataIndex === 'invalidFlag'" :name="item.dataIndex" :record="record">
          <a-tooltip>
            <template slot="title">{{
              record.invalidFlag === '0' ? t('hyt.policeInquiriesList.valid') : t('hyt.policeInquiriesList.invalid')
            }}</template>
            <div class="alertStateBlock"></div>
            <span>{{
              record.invalidFlag === '0' ? t('hyt.policeInquiriesList.valid') : t('hyt.policeInquiriesList.invalid')
            }}</span>
          </a-tooltip>
        </slot>

        <!-- 警情标签 -->
        <slot v-else-if="item.dataIndex === 'alarmLableList'" :name="item.dataIndex" :record="record">
          <a-tooltip placement="topLeft" overlayClassName="tooltip-large">
            <template slot="title">
              <span v-for="(label, labelIndex) in record[item.dataIndex]" :key="labelIndex" class="alarm-label">
                {{ label }}
              </span>
            </template>
            <span v-for="(label, labelIndex) in record[item.dataIndex]" :key="labelIndex"> {{ label }} </span>
          </a-tooltip>
        </slot>

        <!-- 警情反馈内容 -->
        <slot v-else-if="item.dataIndex === 'feedbackContentList'" :name="item.dataIndex" :record="record">
          <a-tooltip placement="topLeft" overlayClassName="tooltip-large">
            <template slot="title">
              <span
                v-for="(feedBack, feedBackIndex) in record[item.dataIndex]"
                :key="feedBackIndex"
                class="alarm-feedback"
              >
                {{ feedBack }}
              </span>
            </template>
            <span v-for="(feedBack, feedBackIndex) in record[item.dataIndex]" :key="feedBackIndex">
              {{ feedBack }}
            </span>
          </a-tooltip>
        </slot>
        <!-- 序号 -->
        <slot v-else-if="item.dataIndex === 'index'" :name="item.dataIndex" :record="record">
          <div>{{ index + 1 }}</div>
        </slot>

        <!-- 按钮部分 -->
        <slot v-else-if="item.dataIndex === 'tableBtn'" :name="item.dataIndex" :record="record">
          <div class="btn-part">
            <a-icon type="file-text" @click="handleClickBtn(record)" />
          </div>
        </slot>

        <!-- 违规情况 -->
        <slot v-else-if="item.dataIndex === 'violationStatus'" :name="item.dataIndex" :record="record">
          <span>{{
            record[item.dataIndex] === '0'
              ? t('hyt.policeInquiriesList.violation')
              : t('hyt.policeInquiriesList.nonViolation')
          }}</span>
        </slot>
        <!-- ############################  特殊字段单行情况处理 ################################# -->
        <!-- 单行 -->
        <slot v-else :name="item.dataIndex" :record="record">
          <a-tooltip>
            <template slot="title">{{ record[item.dataIndex] }}</template>
            {{ record[item.dataIndex] }}
          </a-tooltip>
        </slot>
      </div>
    </a-table>
    <!-- 表格设置弹窗 -->
    <TableSetting
      v-if="showSetting"
      :visible.sync="showSetting"
      :defaultColumns="processConfiguration(defaultColumns)"
      :currentColumns="settingColumns"
      @updateColumn="updateColumn"
    />
  </div>
</template>

<script>
// 引入 国际化混入
import locate from '../../../src/mixins/locale.js';
// 引入表格设置弹窗
import TableSetting from './modal/index.vue';
// 引入 工具 方法
import { getSessionStorage, setSessionStorage, setLocalStorage } from './tool/utils.js';
// 引入 接口
import { getToken, getPoliceAlertList } from './server/index.js';
// 全局样式
import './styles/index.less';
export default {
  name: 'HYTPoliceInquiriesList',
  mixins: [locate],
  components: {
    TableSetting
  },

  props: {
    params: {
      type: Object,
      default: () => {}
    },

    // 表格字段
    tableField: {
      type: Array,
      default: () => []
    },

    // 添加字段
    addField: {
      type: Array,
      default: () => []
    },

    // 删除字段
    deleteField: {
      type: Array,
      default: () => []
    },

    // 滚动高度
    scrollTop: {
      type: Object,
      default: () => {
        return { y: '300px' };
      }
    },

    // 行类名方法
    rowClassNameCallBack: {
      type: Function,
      default: () => {}
    },

    // 设置按钮宽度
    settingWidth: {
      type: String,
      default: '5%'
    },

    // 表格默认查询条数
    pageSize: {
      type: Number,
      default: 10
    },

    // 接口地址
    url: {
      type: String,
      default: `aia-alarm-service/caseQuery/caseListByPage`,
      methods: 'post'
    }
  },
  data() {
    return {
      showSetting: false, // 设置表格弹窗 开关
      settingColumns: [], // 当前表格展示字段
      // 序号列 配置
      index: {
        scopedSlots: {
          customRender: 'index',
          title: 'indexTitle'
        },
        dataIndex: 'index',
        align: 'center',
        title: this.t('hyt.policeInquiriesList.index'),
        width: '3%',
        child: []
      },
      // 设置列 配置
      setting: {
        scopedSlots: {
          customRender: 'tableBtn',
          title: 'tableSetting'
        },
        dataIndex: 'tableBtn',
        width: this.settingWidth,
        child: []
      },
      // 表格默认配置
      defaultColumns: [
        {
          child: [
            {
              dataIndex: 'receiptType', //  接警类型
              title: this.t('hyt.policeInquiries.alarmType'),
              width: '10%'
            },
            {
              dataIndex: 'caseNo', // 警单号
              title: this.t('hyt.policeInquiries.policeOrderNumber'),
              width: '10%'
            }
          ]
        },
        {
          child: [
            {
              dataIndex: 'caseResource', //  警情来源
              title: this.t('hyt.policeInquiries.policeInformationSource'),
              width: '7%'
            },
            {
              dataIndex: 'callType', // 来话类型
              title: this.t('hyt.policeInquiries.incomingCallType'),
              width: '7%'
            }
          ]
        },
        {
          child: [
            {
              dataIndex: 'caseLevel', //  警情等级
              title: this.t('hyt.policeInquiries.policeLevel'),
              width: '10%'
            },
            {
              dataIndex: 'caseType', // 警情分类
              title: this.t('hyt.policeInquiries.policeSituationClassification'),
              width: '10%'
            }
          ]
        },
        {
          dataIndex: 'caseDesc', //  报警内容
          title: this.t('hyt.policeInquiries.alarmContent'),
          width: '17%',
          child: []
        },
        {
          child: [
            {
              dataIndex: 'invalidFlag', //  警情有效性
              title: this.t('hyt.policeInquiries.alertEffectiveness'),
              width: '6%'
            },
            {
              dataIndex: 'caseState', // 警情状态
              title: this.t('hyt.policeInquiries.alertStatus'),
              width: '6%'
            }
          ]
        },
        {
          child: [
            {
              dataIndex: 'caseCaller', //  报警人
              title: this.t('hyt.policeInquiriesList.alarmPeople'),
              width: '6%'
            },
            {
              dataIndex: 'callerNo', // 报警电话
              title: this.t('hyt.policeInquiriesList.alarmPhone'),
              width: '6%'
            }
          ]
        },
        {
          child: [
            {
              dataIndex: 'caseTime', //  接警时间
              title: this.t('hyt.policeInquiriesList.alarmTime'),
              width: '13%'
            },
            {
              dataIndex: 'caseAddress', // 警情地址
              title: this.t('hyt.policeInquiries.policeInformationAddress'),
              width: '13%'
            }
          ]
        },
        {
          child: [
            {
              dataIndex: 'receivingName', //  接警单位
              title: this.t('hyt.policeInquiries.alarmReceivingUnit'),
              width: '8%'
            },
            {
              dataIndex: 'districtUnit', // 管辖单位
              title: this.t('hyt.policeInquiries.jurisdictionalUnit'),
              width: '8%'
            }
          ]
        },
        {
          child: [
            {
              dataIndex: 'alarmLableList', // 警情标签
              title: this.t('hyt.policeInquiriesList.alarmLabel'),
              width: '11%'
            },
            {
              dataIndex: 'feedbackContentList', // 反馈内容
              title: this.t('hyt.policeInquiriesList.feedBackContent'),
              width: '11%'
            }
          ]
        },
        {
          child: [
            {
              dataIndex: 'policeman', // 接警员
              title: this.t('hyt.policeInquiries.pickUpThePolice'),
              width: '4%'
            },
            {
              dataIndex: 'dispatcher', // 派警员
              title: this.t('hyt.policeInquiries.sendThePolice'),
              width: '4%'
            }
          ]
        },
        {
          dataIndex: 'violationStatus', //  违规情况
          title: this.t('hyt.policeInquiries.violationStatus'),
          width: '5%',
          child: []
        }
      ],
      // 表格配置
      columns: [],
      // 数据源
      dataList: [],
      // 分页参数
      pagination: {
        total: 0,
        current: 1,
        position: 'bottom',
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100', '1000'],
        showTotal: (total, range) => {
          return `${this.t('hyt.policeInquiriesList.total')} ${total} ${this.t('hyt.policeInquiriesList.data')} `;
        },
        showQuickJumper: true,
        pageSize: this.pageSize
      },
      // loading
      loading: false
    };
  },
  watch: {
    // 表格字段
    tableField: {
      deep: true,
      immediate: true,
      handler(newVal) {
        if (newVal.length) {
          // 覆盖默认值
          this.defaultColumns = newVal;
        }
        // 新增字段
        this.addField.length && this.defaultColumns.push(...this.addField);
        // 删除字段
        this.deleteField.length && (this.defaultColumns = this.deleteColumns());
        // 获取缓存数据
        const storageColumns = getSessionStorage('tableColumns');
        if (storageColumns) {
          this.columns = storageColumns;
          return;
        }
        // 没有缓存 取传入的字段 或 默认字段
        const arr = [
          this.index,
          ...this.processConfiguration(newVal.length ? newVal : this.defaultColumns),
          this.setting
        ];
        this.columns = arr;
      }
    },
    // 查询参数
    params: {
      deep: true,
      immediate: true,
      handler(newVal = {}) {
        if (Object.keys(newVal).length) {
          this.getPoliceAlertList(true);
        }
      }
    }
  },
  mounted() {
    // this.init();
    // 计算表格滚动区域高度
    // this.$nextTick(() => {
    //   this.calculateHeight();
    // });
    // // 监听页面
    // window.addEventListener('resize', this.calculateHeight);
  },

  // beforeDestroy() {
  //   // 组件销毁取消监听事件
  //   window.removeEventListener('resize', this.calculateHeight);
  // },
  methods: {
    async init() {
      if (process.env.NODE_ENV === 'development') {
        try {
          const res = await getToken();
          const { code, data, message } = res.data;
          if (code === '200') {
            setLocalStorage('Authorization', data);
          } else {
            this.$notification.error({ message });
          }
        } catch (error) {}
      }
    },

    // =======================表格方法=======================
    /**
     * 表格显示字段配置
     */
    handleSetting() {
      this.settingColumns = this.columns.slice(1, this.columns.length - 1);
      this.showSetting = true;
    },

    /**
     * 操作按钮
     */
    handleClickBtn(record) {
      this.$emit('handleEvent', {
        type: 'operateBtn',
        record
      });
    },

    /**
     * 分页回调
     */
    changePage(pagination) {
      const { current, pageSize } = pagination;
      this.pagination.current = current;
      this.pagination.pageSize = pageSize;
      // 获取列表
      this.getPoliceAlertList(false);
    },

    /**
     * table 列表事件
     */
    customRowEvent(record) {
      return {
        on: {
          // 事件
          click: event => {
            this.$emit('handleEvent', {
              type: 'bodyClick',
              event,
              record
            });
          },
          dblclick: event => {
            this.$emit('handleEvent', {
              type: 'bodyDblclick',
              event,
              record
            });
          },
          contextmenu: event => {
            this.$emit('handleEvent', {
              type: 'bodyContextmenu',
              event,
              record
            });
          },
          mouseenter: event => {
            this.$emit('handleEvent', {
              type: 'bodyMouseenter',
              event,
              record
            });
          },
          mouseleave: event => {
            this.$emit('handleEvent', {
              type: 'bodyMouseleave',
              event,
              record
            });
          }
        }
      };
    },

    /**
     * table 表头事件
     */
    customHeaderRow(record) {
      return {
        on: {
          // 事件
          click: event => {
            this.$emit('handleEvent', {
              type: 'headerClick',
              event,
              record
            });
          },
          dblclick: event => {
            this.$emit('handleEvent', {
              type: 'headerDblclick',
              event,
              record
            });
          },
          contextmenu: event => {
            this.$emit('handleEvent', {
              type: 'headerContextmenu',
              event,
              record
            });
          },
          mouseenter: event => {
            this.$emit('handleEvent', {
              type: 'headerMouseenter',
              event,
              record
            });
          },
          mouseleave: event => {
            this.$emit('handleEvent', {
              type: 'headerMouseleave',
              event,
              record
            });
          }
        }
      };
    },
    // =======================数据处理=======================
    /**
     * 表格配置数据处理
     */
    processConfiguration(arr) {
      const newColumns = [];
      arr.forEach(item => {
        // 有子元素的拼接子元素的dataIndex作为插槽名称
        if (item.child && item.child.length) {
          // 取宽度较大值作为合并后的宽度
          const width = this.calculateWidth(item.child);
          // 拼接表格插槽名称
          const result = item.child.map(childItem => childItem.dataIndex).join('-');
          newColumns.push({
            ...item,
            width,
            scopedSlots: {
              customRender: result, // 表内容插槽
              title: result + '-title' // 表头插槽
            }
          });
        } else {
          // 没有子元素的直接取dataIndex作为插槽名称
          newColumns.push({
            ...item,
            scopedSlots: {
              customRender: item.dataIndex, // 表内容插槽
              title: item.dataIndex + '-title' // 表头插槽
            }
          });
        }
      });
      return newColumns;
    },

    /**
     * 更新表格配置回调
     */
    updateColumn(e) {
      const arr = [this.index, ...this.processConfiguration(e), this.setting];
      this.columns = arr;
      setSessionStorage('tableColumns', this.columns);
    },

    /**
     * 计算表格高度
     */
    calculateHeight(e) {
      const tableHeight = window.innerHeight - document.getElementById('test').getBoundingClientRect().top - 64 - 78;
      this.scrollTop = { y: tableHeight };
    },

    /**
     * 计算列宽度最大值
     */
    calculateWidth(arr) {
      let width = '';
      const [firstItem, secondItem] = arr;
      width =
        parseFloat(firstItem.width.replace('%', '')) > parseFloat(secondItem.width.replace('%', ''))
          ? firstItem.width
          : secondItem.width;
      return width;
    },

    /**
     * 根据配置项删除表格默认字段
     */
    deleteColumns() {
      // 默认字段
      const _defaultColumns = [...this.defaultColumns];
      // 更新字段
      let updatedColumns = [];
      // 删除字段集合
      this.deleteField.forEach(deleteField => {
        updatedColumns = _defaultColumns
          .reduce((newArr, column) => {
            // 合并字段处理
            if (column.child.length) {
              column.child = column.child.filter(childColumn => childColumn.dataIndex !== deleteField);
            }
            // 单独字段处理
            if (column?.dataIndex === deleteField) {
              column.dataIndex = null;
            }
            // 保留有效字段
            if (column.dataIndex || column.child.length) {
              newArr.push(column);
            }
            return newArr;
          }, [])
          // 将合并字段中只有一个的单独拿出来
          .map(_column =>
            _column.child.length === 1
              ? {
                  ..._column.child[0],
                  child: []
                }
              : _column
          );
      });
      return updatedColumns;
    },

    /**
     * 获取列表数据
     */
    async getPoliceAlertList(flag) {
      this.loading = true;
      this.$emit('setLoading', true);
      // 重置首页
      if (flag) {
        this.pagination.current = 1;
      }
      // 分页参数
      const { current, pageSize } = this.pagination;
      const page = {
        current,
        pageSize
      };
      try {
        const res = await getPoliceAlertList(this.params, page, this.url);
        const { code, data, message } = res.data;
        if (code !== '200') {
          return this.$notification.error({
            message: message
          });
        }
        const { pageNum, total, list } = data;
        this.dataList = this.setFilterData(list);
        this.pagination.total = total;
        this.pagination.current = pageNum;
      } catch (error) {
        console.log(error);
      } finally {
        this.loading = false;
        this.$emit('setLoading', false);
      }
    },

    /**
     * 空数据过滤赋值
     * @param {*} data
     */
    setFilterData(data) {
      data.forEach(item => {
        for (const key in item) {
          // eslint-disable-next-line no-unused-expressions
          item[key] === null ? (item[key] = '---') : item[key];
        }
      });
      return data;
    }
  }
};
</script>

<style lang="less" scoped>
@import './index.less';
</style>
