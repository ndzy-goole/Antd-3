import * as _ from 'lodash';
import data_ from './data';

//#region 将树形数据转换为table数据
/**
 * @description 将树形数据转换为table数据
 * @param data
 */
export const treeDataToTableDataG = (data: any[]) => {
  const deep = _.cloneDeep(data);
  const arr: any[] = [];
  if (_.isArray(deep[0].children)) {
    if (deep[0].children.length > 0) {
      [...deep[0].children].map((item) => {
        item.children = item.children.map((item_: any) => {
          item_.key = item_.id;
          item_.key1 = item.paramName;
          item_.key2 = item_.paramName;
          item_.key3 = item_.mark;
          item_.count = item.mark;
          item_.uniqueKey = item.id;
          item_.key1Span = {
            rowSpan: 0,
            colSpan: 0
          };
          item_.isDelete = 0;
          item_.isAdd = 0;
          arr.push(item_);
          return item_;
        });
        if (item.children.length > 0) {
          item.children[0].key1Span = {
            rowSpan: item.children && item.children.length,
            colSpan: 1
          };
          item.children[item.children.length - 1].isDelete = 1;
          item.children[item.children.length - 1].isAdd = 1;
        }
        return item;
      });
    }
  }
  return arr;
};
//#endregion

//#region 删除树结构中的某一项
/**
 * @description 删除树结构中的某一项
 * @param data
 * @param key
 */
export const deleteFromTreeG = (data: any[], key: any) => {
  const deep = _.cloneDeep(data);
  if (_.isArray(deep[0].children)) {
    if (deep[0].children.length > 0) {
      deep[0].children = [...deep[0].children].map((item) => {
        item.children = item.children.filter(
          (item_: any) => String(item_.id) !== String(key)
        );
        return item;
      });
    }
  }
  return deep;
};
//#endregion

//#region 向树结构中添加某一项
/**
 *
 * @param data
 * @param key
 */
export const addToTreeG = (data: any[], key: any) => {
  const deep1 = _.cloneDeep(data);
  const deep2 = _.cloneDeep(data);
  let itemId: any;
  let leaf: any;
  let idArr: any[] = [];
  let idIndex: any;

  if (_.isArray(deep1[0].children)) {
    if (deep1[0].children.length > 0) {
      [...deep1[0].children].map((item, idex_) => {
        item.children.map((item_: any) => {
          if (String(item_.id) === String(key)) {
            idIndex = idex_;
            leaf = item_;
            leaf.paramName = '';
            leaf.mark = '';
            leaf.isNew = 1; //标明是新加的
            itemId = item.id;
          }
          return item_;
        });
        return item;
      });
    }
  }
  if (_.isArray(deep1[0].children)) {
    if (deep1[0].children.length > 0) {
      [...deep2[0].children]
        .filter((item) => String(item.id) === String(itemId))[0]
        .children.map((item: any) => {
          idArr.push(item.id);
          return item;
        });
      idArr = idArr
        .map((item) => parseInt(item, 10))
        .sort(function (a, b) {
          return a - b;
        });
      leaf.id = idArr[idArr.length - 1] + 1;
    }
  }
  if (_.isArray(data[0].children)) {
    if (data[0].children.length > 0) {
      data[0].children[idIndex].children.push(leaf);
    }
  }
  return data;
};

//#endregion

//#region columns
/**
 * @description columns
 * @param that
 */
export const columnsG = (that: any) => {
  const columns = [
    {
      title: '项目名称',
      dataIndex: 'key1',
      width: '25%',
      editable: true,
      inputType: 'text',
      render: (value: any, row: { [propsName: string]: any }, index: any) => {
        const obj = {
          children: value,
          props: {
            rowSpan: row.key1Span && row.key1Span.rowSpan,
            colSpan: row.key1Span && row.key1Span.colSpan
          }
        };
        return obj;
      }
    },
    {
      title: '评分项',
      dataIndex: 'key2',
      width: '40%',
      editable: true,
      inputType: 'input1'
    },
    {
      title: '分值',
      dataIndex: 'key3',
      width: '15%',
      editable: true,
      inputType: 'input2'
    }
  ];
  return columns;
};
//#endregion

export const getDataG = () => {
  return data_;
};
