import React from 'react';
import * as _ from 'lodash';
import { Table, Input, Form, Button, Icon, Popconfirm } from 'antd';
import data_ from './data';

const handleGetData = (data: any[]) => {
  let arr: any[] = [];
  if (data[0].children && data[0].children.length > 0) {
    [...data[0].children].map((item) => {
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
  return arr;
};
/**
 * @description 删除树结构中的某一项
 * @param data
 * @param key
 */
const deleteFromTreeGlobal = (data: any[], key: any) => {
  if (data[0].children && data[0].children.length > 0) {
    data[0].children = [...data[0].children].map((item) => {
      item.children = item.children.filter(
        (item_: any) => String(item_.id) !== String(key)
      );
      return item;
    });
  }
  return data;
};

const addToTreeGlobal = (data: any[], key: any) => {
  const deep1 = _.cloneDeep(data);
  const deep2 = _.cloneDeep(data);

  let itemId: any;
  let leaf: any;
  let idArr: any[] = [];
  let idIndex: any;
  if (deep1[0].children && deep1[0].children.length > 0) {
    [...deep1[0].children].map((item, idex_) => {
      item.children.map((item_: any) => {
        if (String(item_.id) === String(key)) {
          idIndex = idex_;
          leaf = item_;
          leaf.paramName = '';
          leaf.mark = '';
          leaf.isNew = 1;
          itemId = item.id;
        }
        return item_;
      });
      return item;
    });
  }
  if (deep2[0].children && deep2[0].children.length > 0) {
    [...deep2[0].children]
      .filter((item) => String(item.id) === String(itemId))[0]
      .children.map((item: any) => {
        idArr.push(item.id);
        return item;
      });
    idArr = idArr
      .map((item) => parseInt(item))
      .sort(function (a, b) {
        return a - b;
      });
    leaf.id = idArr[idArr.length - 1] + 1;
  }
  console.log(data);

  if (data[0].children && data[0].children.length > 0) {
    data[0].children[idIndex].children.push(leaf);
  }
  return data;
};



const handleColumns = (that: any) => {
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
      title: '总分',
      dataIndex: 'key3',
      width: '15%',
      editable: true,
      inputType: 'input2'
    }
  ];
  return columns;
};

const { Provider, Consumer } = React.createContext(null);

class EditableCell extends React.Component<any, any> {
  handleDelete = () => {
    const tree = deleteFromTreeGlobal(
      this.props.treeData,
      this.props.record.key
    );
    this.props.setTreeData(tree);
  };
  handleAdd = () => {
    const tree = addToTreeGlobal(this.props.treeData, this.props.record.key);
    this.props.setTreeData(tree);
  };
  getInput = (form: any) => {
    if (this.props.inputType !== 'text') {
      return (
        <Input
          suffix={
            this.props.inputType === 'input2' ? (
              <span>
                {this.props.record.isDelete !== 1 ? (
                  <span>
                    <Popconfirm
                      title="确定要删除吗？"
                      onConfirm={this.handleDelete.bind(this)}
                    >
                      <Icon type="delete" />
                    </Popconfirm>
                  </span>
                ) : null}
                {this.props.record.isAdd === 1 ? (
                  <span onClick={this.handleAdd.bind(this)}>
                    <Icon type="plus" />
                  </span>
                ) : null}
              </span>
            ) : null
          }
          onBlur={(e) => {
            const key = this.props.record.key;
            const { treeData } = this.props;
            const obj = {
              paramName: form.getFieldValue(`key2_${key}`),
              mark: form.getFieldValue(`key3_${key}`)
            };
            treeData[0].children = [...treeData[0].children].map((item) => {
              item.children = item.children.map((item_: any) => {
                if (String(item_.id) === String(key)) {
                  item_ = { ...item_, ...obj };
                  return item_;
                }
                return item_;
              });
              return item;
            });
            form.validateFields((error: any, row: any) => {
              if (error) {
                return;
              }
              this.props.setTreeData(treeData);
            });
          }}
        />
      );
    }
    return <span>{this.props.record.key1}</span>;
  };

  handleValidate = (
    dataIndex: any,
    record: any,
    treeData: any,
    rule: any,
    value: any,
    callback: any
  ) => {
    const reg = /^[1-9]+[0-9]*$/;
    if (dataIndex === 'key3') {
      const flag = reg.test(value);
      if (flag) {
        const allCount = record.count; // 每一大项的总分
        const data = handleGetData(treeData);
        let count = 0;
        data
          .map((item) => {
            if (item.id === record.id) {
              item.mark = value;
            }
            return item;
          })
          .filter((item) => item.uniqueKey === record.uniqueKey)
          .map((item) => {
            count += parseInt(item.mark, 10);
            return item;
          });

        if (String(count) === String(allCount)) {
          callback();
        } else {
          callback(record.key1 + '！');
        }
      } else {
        callback('需要输入一个整数');
      }
    }
    callback();
  };

  renderCell = (form: any) => {
    const { getFieldDecorator } = form;

    const {
      treeData,
      dataIndex,
      title,
      inputType,
      record,
      index,
      children,
      ...restProps
    } = this.props;
    return (
      <td {...restProps}>
        <Form.Item style={{ margin: 0 }}>
          {/* TODO: */}
          {getFieldDecorator(`${dataIndex}_${record.key}`, {
            rules: [
              {
                required: true,
                message: `请输入 ${title}!`
              },
              {
                validator: this.handleValidate.bind(
                  this,
                  dataIndex,
                  record,
                  treeData
                )
              }
            ],
            initialValue: record[dataIndex]
          })(this.getInput(form))}
        </Form.Item>
      </td>
    );
  };

  render() {
    return <Consumer>{this.renderCell}</Consumer>;
  }
}

class EditableTable extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      treeData: data_
    };
  }

  setTreeData = (treeData: any) => {
    this.setState({
      treeData
    });
  };

  render() {
    const components = {
      body: {
        cell: EditableCell
      }
    };
    const columns = handleColumns(this).map((col: any) => {
      return {
        ...col,
        onCell: (record: any) => ({
          treeData: this.state.treeData,
          record,
          inputType: col.inputType || 'text',
          dataIndex: col.dataIndex,
          title: col.title,
          setTreeData: this.setTreeData.bind(this)
        })
      };
    });

    return (
      <Provider value={this.props.form}>
        <Table
          components={components}
          bordered
          dataSource={handleGetData(this.state.treeData)}
          columns={columns}
          pagination={false}
        />
        <Button
          onClick={() => {
            console.log(handleGetData(this.state.treeData));
          }}
        >
          提交
        </Button>
      </Provider>
    );
  }
}

const EditableFormTable = Form.create()(EditableTable);

export default EditableFormTable;
