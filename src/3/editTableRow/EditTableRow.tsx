import React from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Button } from 'antd';

const data: any[] = [];
for (let i = 0; i < 100; i++) {
  data.push({
    key: i.toString(),
    key1: `Edrward ${i}`,
    key2: `London Park no. ${i}`,
    key3: 32
  });
}

const handleColumns = (that: any) => {
  const columns = [
    {
      title: '项目名称',
      dataIndex: 'key1',
      width: '25%',
      editable: true,
      inputType: 'text'
    },
    {
      title: '评分项',
      dataIndex: 'key2',
      width: '40%',
      editable: true,
      inputType: 'input'
    },
    {
      title: '总分',
      dataIndex: 'key3',
      width: '15%',
      editable: true,
      inputType: 'number'
    },
    {
      title: 'operation',
      dataIndex: 'operation',
      render: (text: any, record: any) => {
        const { editingKey } = that.state;
        const editable = that.isEditing(record);
        return editable ? (
          <span>
            <EditableContext.Consumer>
              {(form) => (
                <Button
                  type="link"
                  onClick={() => that.save(form, record.key)}
                  style={{ marginRight: 8 }}
                >
                  保存
                </Button>
              )}
            </EditableContext.Consumer>
            <Popconfirm title="确定要取消吗？" onConfirm={() => that.cancel()}>
              <Button type="link">取消</Button>
            </Popconfirm>
          </span>
        ) : (
          <Button
            type="link"
            disabled={editingKey !== ''}
            onClick={() => that.edit(record.key)}
          >
            Edit
          </Button>
        );
      }
    }
  ];
  return columns;
};
const validate = () => {};

const EditableContext = React.createContext(null);

class EditableCell extends React.Component<any, any> {
  getInput = () => {
    if (this.props.inputType === 'number') {
      return <InputNumber />;
    } else if (this.props.inputType === 'input') {
      return <Input />;
    }
    return <span>{this.props.record.key1}</span>;
  };
  handleValidate = (rule: any, value: any, callback: any) => {
    console.log(value);
    // console.log(dataIndex);
  };

  renderCell = ({ getFieldDecorator }: any) => {
    const {
      editing,
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
        {editing ? (
          <Form.Item style={{ margin: 0 }}>
            {getFieldDecorator(dataIndex, {
              rules: [
                {
                  required: true,
                  message: `请输入 ${title}!`
                },
                {
                  validator: this.handleValidate.bind(this)
                }
              ],
              initialValue: record[dataIndex]
            })(this.getInput())}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };

  render() {
    return (
      <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>
    );
  }
}

class EditableTable extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = { data, editingKey: '' };
  }

  isEditing = (record: any) => record.key === this.state.editingKey;

  cancel = () => {
    this.setState({ editingKey: '' });
  };

  save(form: any, key: any) {
    form.validateFields((error: any, row: any) => {
      if (error) {
        return;
      }
      const newData = [...this.state.data];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row
        });
        this.setState({ data: newData, editingKey: '' });
      } else {
        newData.push(row);
        this.setState({ data: newData, editingKey: '' });
      }
    });
  }

  edit(key: any) {
    this.setState({ editingKey: key });
  }

  render() {
    const components = {
      body: {
        cell: EditableCell
      }
    };
    const columns = handleColumns(this).map((col: any) => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: (record: any) => ({
          record,
          inputType: col.inputType || 'text',
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isEditing(record)
        })
      };
    });

    return (
      <EditableContext.Provider value={this.props.form}>
        <Table
          components={components}
          bordered
          dataSource={this.state.data}
          columns={columns}
          // rowClassName="editable-row"
          pagination={{
            onChange: this.cancel
          }}
        />
      </EditableContext.Provider>
    );
  }
}

const EditableFormTable = Form.create()(EditableTable);

export default EditableFormTable;
