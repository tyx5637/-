<template>
  <a-modal
    dialogClass="table-setting-modal"
    :title="t('hyt.policeInquiriesList.showFiled')"
    width="800px"
    :visible="visibleModal"
    :destroyOnClose="true"
    :mask="true"
    :maskClosable="false"
    @cancel="handleCancel"
  >
    <div class="table-setting-container">
      <!-- 所有字段 -->
      <div class="transfer-left">
        <div class="title-part">
          <H3>{{ t('hyt.policeInquiriesList.display') }}</H3>
          <H5>{{ t('hyt.policeInquiriesList.oneOrTwo') }}</H5>
        </div>
        <a-checkbox-group ref="checkbox" @change="e => handleChecked(e, 'left')">
          <a-checkbox v-for="item in allColumns" :key="item.dataIndex" :value="item" :disabled="item.disabled">
            {{ item.title }}
          </a-checkbox>
        </a-checkbox-group>
      </div>
      <!-- 穿梭按钮 -->
      <div class="transfer-btn">
        <!-- 右置按钮 -->
        <a-button type="primary" :disabled="!leftChecked.length" @click="handleTransferBtn('toRight')">
          <a-icon type="right" />
        </a-button>
        <!-- 左置按钮 -->
        <a-button type="primary" :disabled="!rightChecked.length" @click="handleTransferBtn('toLeft')">
          <a-icon type="left" />
        </a-button>
      </div>
      <!-- 组合方式 -->
      <div class="transfer-right">
        <div class="title-part">
          <H3>{{ t('hyt.policeInquiriesList.show') }}</H3>
          <H5>{{ t('hyt.policeInquiriesList.showNotice') }}</H5>
        </div>
        <a-checkbox-group id="drag-container" @change="e => handleChecked(e, 'right')">
          <div class="drag-item" v-for="item in showColumns" :key="item.dataIndex || item[0].dataIndex">
            <a-checkbox v-if="item.length" :value="item">
              <span class="filed-name">{{ item[0].title }}</span>
              <span class="filed-name">{{ item[1].title }}</span>
            </a-checkbox>
            <a-checkbox v-else :value="item">
              <span class="filed-name">{{ item.title }}</span>
            </a-checkbox>
          </div>
        </a-checkbox-group>
      </div>
    </div>
    <template slot="footer">
      <!-- 重置 -->
      <a-button @click="handleReset">{{ t('hyt.commons.reset') }}</a-button>
      <!-- 保存 -->
      <a-button type="primary" @click="handleOk">{{ t('hyt.commons.save') }}</a-button>
    </template>
  </a-modal>
</template>

<script>
// 引入 国际化混入
import locate from '../../../../src/mixins/locale.js';
import Sortable from '../tool/Sortable.min.js';
export default {
  name: 'TableSetting',
  mixins: [locate],
  props: {
    // 显示/隐藏
    visible: {
      type: Boolean,
      default: false
    },

    // 表格默认字段
    defaultColumns: {
      type: Array,
      default: () => []
    },
    // 表格当前字段
    currentColumns: {
      type: Array,
      default: () => []
    }
  },
  watch: {
    currentColumns: {
      deep: true,
      immediate: true,
      handler(newVal) {
        this.showColumns = this.columnsToCheckBox(newVal);
        this.filterColumns();
      }
    }
  },
  data() {
    return {
      allColumns: [], // 所有字段
      leftChecked: [], // 右侧选中字段
      showColumns: [], // 最终展示字段
      rightChecked: [] // 左侧选中字段
    };
  },

  computed: {
    // 弹框 开关响应
    visibleModal: {
      get() {
        return this.visible;
      },
      set() {
        this.$emit('update:visible', false);
      }
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      // 拖拽排序
      this.$nextTick(() => {
        const dragDom = document.getElementById('drag-container');
        new Sortable(dragDom, {
          animation: 150,
          easing: 'cubic-bezier(1, 0, 0, 1)',
          onUpdate: e => {
            const { newIndex, oldIndex } = e;
            // 更新展示 字段顺序
            this.updateColumns({
              newIndex,
              oldIndex
            });
          }
        });
      });
    },

    /**
     * 关闭弹窗
     */
    handleCancel(e) {
      this.visibleModal = false;
    },

    /**
     * 重置
     */
    handleReset() {
      // 默认字段
      this.showColumns = this.columnsToCheckBox(this.defaultColumns);
      this.allColumns = [];
      const arr = this.checkBoxToColumns(this.showColumns);
      this.$emit('updateColumn', arr);
      this.$nextTick(() => {
        this.handleCancel();
      });
    },

    /**
     * 保存
     */
    handleOk() {
      // 复选框数据  => 表格配置数据
      const arr = this.checkBoxToColumns(this.showColumns);
      this.$emit('updateColumn', arr);
      this.$nextTick(() => {
        this.handleCancel();
      });
    },

    /**
     * checkBox勾选
     * @param {*} e 选中的字段集合
     * @param {*} type 字段类型
     */
    handleChecked(e, type) {
      // 操作对象
      const actionObj = {
        /**
         * 左侧勾选
         */
        left: e => {
          this.leftChecked = e;
          if (e.length >= 2) {
            this.allColumns.forEach(item => {
              if (!e.includes(item)) {
                item.disabled = true;
              }
            });
          } else {
            this.allColumns.forEach(item => (item.disabled = false));
          }
        },

        /**
         * 右侧勾选
         */
        right: e => {
          this.rightChecked = e;
        }
      };
      // 执行
      actionObj[type](e);
    },

    /**
     * 点击 穿梭框 按钮
     * * @param {*} item 当前按钮项
     * @param {*} type 按钮方向
     */
    handleTransferBtn(type) {
      // 操作对象
      const actionObj = {
        /**
         * 右置按钮
         */
        toRight: () => {
          // 删除左侧勾选的元素
          const filterArr = this.allColumns.filter(item => !this.leftChecked.includes(item));
          // 重置禁用状态
          filterArr.forEach(item => {
            item.disabled = false;
          });
          // 将选中的字段添加到右侧
          if (this.leftChecked.length > 1) {
            this.showColumns.push(this.leftChecked);
          } else {
            this.showColumns.push(...this.leftChecked);
          }
          // 更新数据
          this.leftChecked = [];
          this.allColumns = filterArr;
        },

        /**
         * 左置按钮
         */
        toLeft: () => {
          // 删除右侧勾选元素
          this.showColumns = this.showColumns.filter(item => !this.rightChecked.includes(item));
          // 将勾选的元素添加到左侧
          this.rightChecked.flat().forEach(item => {
            this.allColumns.push({ ...item, disabled: this.leftChecked.length >= 2 });
          });
          this.rightChecked = [];
        }
      };
      actionObj[type]();
    },

    /**
     * 过滤 展示/不展示 字段
     */
    filterColumns() {
      // 默认所有字段
      const defaultColumns = this.columnsToCheckBox(this.defaultColumns).flat();
      // 当前展示字段
      const currentColumns = this.columnsToCheckBox(this.currentColumns).flat();
      // 过滤未展示的字段
      this.allColumns = defaultColumns.filter(
        item => !currentColumns.some(_item => _item.dataIndex === item.dataIndex)
      );
    },

    /**
     * 表格配置数据 => 复选框数据
     */
    columnsToCheckBox(arr) {
      const aimArr = [];
      arr.forEach(item => {
        if (item.child && item.child.length) {
          aimArr.push(item.child);
        } else {
          aimArr.push(item);
        }
      });
      return aimArr;
    },

    /**
     * 复选框数据 => 表格配置数据
     */
    checkBoxToColumns(arr) {
      const aimArr = [];
      arr.forEach(item => {
        if (item.length) {
          aimArr.push({ child: item });
        } else {
          aimArr.push(item);
        }
      });
      return aimArr;
    },

    /**
     * 更新展示 字段顺序
     */
    updateColumns(item) {
      const { newIndex = 0, oldIndex = 0 } = item;
      // 删除拖拽旧的值
      const columnItem = this.showColumns.splice(oldIndex, 1)[0];
      // 更新字段的值
      this.showColumns.splice(newIndex, 0, columnItem);
    }
  }
};
</script>

<style lang="less" scoped>
@import './index.less';
</style>
