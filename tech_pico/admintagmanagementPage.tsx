import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Button, Checkbox, Form, Message, Popconfirm } from '@arco-design/web-react';
import TextArea from '@arco-design/web-react/es/Input/textarea';
import { ColumnProps } from '@arco-design/web-react/es/Table';
import { useRequest } from '@byted/hooks';
import { I18n } from '@ies/starling_intl';
import classnames from 'classnames';
import dayjs from 'dayjs';

import { AdminContext } from '../AdminProvider';
import AdminTable, { useVisible } from '../AdminTable';
import { AdminTagManagementPageProps } from './interface';

import { bytedance } from '@/api/api-generate/ttarchApi';
import requestApi from '@/api/picoApi';

import { getRequiredRules } from '@/utils/common_utils/admin';
import { useMultiplePagination } from '@/utils/common_utils/hooks/use-multiple-pagination';

const useTagManagement = (initParams?: bytedance.ttarch.tag_api.TagIdsReq) => {
  const { customRequest } = useContext(AdminContext);

  const item = useMultiplePagination<bytedance.ttarch.api_tag.TopicPack>(args =>
    requestApi.GetTagsPageByCreateTime(args, { customRequest }),
  );

  const {
    urlParams: { current, cursor },
    run,
  } = item;
  const pageNum = Number(current);

  useEffect(() => {
    const currentParams = initParams || {};
    run({ page_index: pageNum, cursor: pageNum === 1 ? '' : cursor, ...currentParams });
  }, [pageNum]);

  return item;
};
const AdminTagManagementPage: React.FC<AdminTagManagementPageProps> = ({ className }) => {
  const [form] = Form.useForm();
  const [categoryChecked, setCategoryChecked] = useState([]);
  const { urlParams, data: currentList, run: fetchData, loading, onPageChange } = useTagManagement();

  useEffect(() => {
    getCategory();
  }, []);
  const editId = useRef<string | null>();
  const { visible, onClose, onShow } = useVisible({ form });
  const { prefixCls, customRequest } = useContext(AdminContext);
  const compPrefixCls = `${prefixCls}-admin-tag-management-page`;

  const { data: categoryList, run: getCategory } = useRequest(async (params?: bytedance.ttarch.tag_api.GetCategoryTreeReq) => {
    const { data } = await requestApi.GetCategoryTree(
      {
        depth: 1,
        ...params,
      },
      { customRequest },
    );
    return data;
  });
  const onOpen = useCallback((current?: bytedance.ttarch.api_tag.TagPack) => {
    const { data, categories } = current || {};
    editId.current = current?.data?.tag_id;
    current &&
      form.setFieldsValue({
        name: data?.name,
        categoryIds: categories?.map(category => category.category_id),
      });
    onShow();
  }, []);
  const { run: editTag } = useRequest(async () => {
    const formValue = await form.validate();
    const { name, categoryIds } = formValue;
    setCategoryChecked(categoryIds);

    await requestApi.UpsertTagWithCate(
      {
        category_ids: categoryIds,
        tag: {
          tag_id: editId.current ? editId.current : undefined,
          name,
        },
      },
      {
        customRequest,
      },
    );
    onClose();
    Message.success(
      editId.current ? I18n.t('edit_tag_successfully', {}, '编辑标签成功') : I18n.t('create_tag_successfully!', {}, '创建标签成功！'),
    );
    editId.current = null;
    fetchData();
  });
  const { run: onDelete } = useRequest(async (tagIds: string) => {
    await requestApi.DeleteTag({ tag_ids: [tagIds] }, { customRequest });
    Message.success(I18n.t('delete_tag_successfully!', {}, '删除标签成功！'));
    fetchData();
  });
  const onCancel = () => {
    onClose();
    editId.current = null;
  };

  const columns = useMemo<ColumnProps<bytedance.ttarch.api_tag.TagPack>[]>(
    () => [
      {
        title: I18n.t('label', {}, '标签'),
        align: 'center',
        dataIndex: '__tagName',
        render: (_, current) => current.data!.name,
        fixed: 'left',
      },
      {
        title: I18n.t('label_id', {}, '标签ID'),
        render: (_, current) => current.data!.tag_id!,
      },
      {
        title: I18n.t('section_name', {}, '版块名称'),
        render: (_, current) => current?.categories?.map(category => category.name).join(','),
      },
      {
        title: I18n.t('creator_(creator_id)', {}, '创建人（创建人ID）'),
        align: 'center',
        render: (_, current) =>
          current.op_info?.op_user?.name ? (
            <>
              <div>{current.op_info?.op_user.name}</div>
              <div>{`(${current.op_info?.op_user.user_id || ''})`}</div>
            </>
          ) : (
            '-'
          ),
      },
      {
        title: I18n.t('creation_time', {}, '创建时间'),
        align: 'center',
        render: (_, current) => (current?.data!.create_time ? dayjs(current?.data.create_time * 1000).format('YYYY-MM-DD HH:mm') : '-'),
      },
      {
        title: I18n.t('edit_time', {}, '编辑时间'),
        align: 'center',
        render: (_, current) => (current?.data!.update_time ? dayjs(current?.data.update_time * 1000).format('YYYY-MM-DD HH:mm') : '-'),
      },
      {
        title: I18n.t('operation', {}, '操作'),
        align: 'center',
        fixed: 'right',
        render: (_, current) => (
          <>
            <Button type="text" onClick={() => onOpen(current)}>
              {I18n.t('edit', {}, '编辑')}
            </Button>
            <Popconfirm
              title={I18n.t(
                'are_you_sure_you_want_to_delete_this_label?_after_deletion__the_user_will_not_fi',
                {},
                '确定要删除该标签吗？删除后，用户在前台将找不到该标签。',
              )}
              onConfirm={() => onDelete(current.data!.tag_id!)}>
              <Button type="text" status="danger">
                {I18n.t('delete', {}, '删除')}
              </Button>
            </Popconfirm>
          </>
        ),
      },
    ],
    [],
  );
  const contentEle = (
    <Form form={form} layout="vertical">
      <Form.Item
        label={I18n.t('label', {}, '标签')}
        field="name"
        rules={[getRequiredRules({ name: I18n.t('label', {}, '标签') }), { maxLength: 25 }]}>
        <TextArea placeholder={I18n.t('up_to_25_words', {}, '最多25个字')} maxLength="25" showWordLimit={true} />
      </Form.Item>
      <Form.Item
        label={I18n.t('section', {}, '版块')}
        field="categoryIds"
        rules={[getRequiredRules({ name: I18n.t('section', {}, '版块') }), { maxLength: 140 }]}>
        <Checkbox.Group value={categoryChecked}>
          {categoryList?.map(category => (
            <Checkbox key={category?.data?.category_id} value={category?.data?.category_id}>
              {category?.data?.name}
            </Checkbox>
          ))}
        </Checkbox.Group>
      </Form.Item>
    </Form>
  );
  return (
    <AdminTable
      className={classnames(`${compPrefixCls}`, className)}
      tableProps={{
        columns,
        rowKey: current => current.data.tag_id,
        data: currentList?.data,
        loading,
        pagination: {
          total: currentList?.count,
          onChange: onPageChange,
          current: Number(urlParams.current),
        },
      }}
      drawerContent={contentEle}
      onCreate={onShow}
      createButtonInner={I18n.t('create_a_label', {}, '创建标签')}
      drawerProps={{
        title: editId.current ? I18n.t('create_a_label', {}, '编辑标签') : I18n.t('edit_tags', {}, '创建标签'),
        visible,
        onCancel,
        onOk: editTag,
      }}
    />
  );
};
export default AdminTagManagementPage;