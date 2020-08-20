import React from 'react';
import './EditTable.scss';
import { Table, Form, Button } from 'antd';
import { treeDataToTableDataG, columnsG, getDataG } from './utils';

import Content from './context';
import EditableCell from './EditableCell';

class EditableTable extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      treeData: []
    };
  }
  componentDidMount() {
    this.handleTreeData();
  }
  setTreeData = (treeData: any) => {
    this.setState({
      treeData
    });
  };
  handleTreeData = () => {
    this.setState({
      treeData: getDataG()
    });
  };

  render() {
    const components = {
      body: {
        cell: EditableCell
      }
    };
    const columns = columnsG(this).map((col: any) => {
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
      <Content.Provider value={this.props.form}>
        <div className="EditTable">
          <div className="EditTable-page-table">
            <div className="EditTable-page-table-wrap">
              <Table
                components={components}
                bordered
                dataSource={
                  this.state.treeData.length > 0
                    ? treeDataToTableDataG(this.state.treeData)
                    : []
                }
                columns={columns}
                pagination={false}
              />
            </div>
          </div>
          <div className="EditTable-group">
            <Button
              className="EditTable-group-btn"
              onClick={this.handleTreeData.bind(this)}
            >
              重置
            </Button>
            <Button
              disabled={this.state.isButtonDisabled}
              type="primary"
              onClick={this.handleTreeData.bind(this)}
            >
              保存
            </Button>
          </div>
        </div>
      </Content.Provider>
    );
  }
}

const EditableFormTable = Form.create()(EditableTable);

export default EditableFormTable;
