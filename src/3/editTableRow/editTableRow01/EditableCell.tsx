import React from 'react';
import { Input, Form, Icon, Popconfirm } from 'antd';
import { treeDataToTableDataG, addToTreeG, deleteFromTreeG } from './utils';
import Content from './context';

export default class EditableCell extends React.Component<any, any> {
  handleDelete = () => {
    const tree = deleteFromTreeG(this.props.treeData, this.props.record.key);
    this.props.setTreeData(tree);
  };
  handleAdd = () => {
    const tree = addToTreeG(this.props.treeData, this.props.record.key);
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
        const data = treeDataToTableDataG(treeData);
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
          {/* 使没一个cell都不同 */}
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
    return <Content.Consumer>{this.renderCell}</Content.Consumer>;
  }
}
