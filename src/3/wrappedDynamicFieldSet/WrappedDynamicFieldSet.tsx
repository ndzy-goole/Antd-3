import React from 'react';
import { Form, Input, Icon, Button } from 'antd';
import './WrappedDynamicFieldSet.scss';
interface Props {
  [propsName: string]: any;
}
interface State {
  [propsName: string]: any;
}

let id = 0;

class DynamicFieldSet extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { id: 0 };
  }
  remove = (k: any) => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    // We need at least one passenger
    if (keys.length === 1) {
      return;
    }

    // can use data-binding to set
    form.setFieldsValue({
      keys: keys.filter((key: any) => key !== k)
    });
  };

  add = () => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat(id++);
    // can use data-binding to set
    // important! notify form to detect changes
    form.setFieldsValue({
      keys: nextKeys
    });
  };

  handleSubmit = (e: any) => {
    e.preventDefault();
    this.props.form.validateFields((err: any, values: any) => {
      if (!err) {
        console.log(values);
        const { keys, names } = values;
        console.log('Received values of form: ', values);
        console.log(
          'Merged values:',
          keys.map((key: any) => names[key])
        );
      }
    });
  };
  data = [
    { label: 'zhangyi', value: '1' },
    { label: 'zhangyi', value: '1' }
  ];
  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;

    getFieldDecorator('keys', { initialValue: [0, 1] });

    const keys = getFieldValue('keys');

    const formItems = keys.map((k: any, index: number) => (
      <div key={k} className="dynamic-item">
        <Form.Item>
          {getFieldDecorator(`data[${k}].label`, {
            initialValue: this.data[k].label,
            validateTrigger: ['onChange', 'onBlur'],
            rules: [
              {
                required: true,
                whitespace: true,
                message: '请输入'
              }
            ]
          })(
            <Input
              value={1}
              placeholder="passenger name"
              style={{ width: '100%', marginRight: 8 }}
            />
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator(`data[${k}].value`, {
            validateTrigger: ['onChange', 'onBlur'],
            initialValue: this.data[k].value,
            rules: [
              {
                required: true,
                whitespace: true,
                message: '请输入'
              }
            ]
          })(
            <Input
              placeholder="passenger name"
              style={{ width: '100%', marginRight: 8 }}
            />
          )}
        </Form.Item>
        {keys.length > 1 ? (
          <Icon
            className="dynamic-delete-button"
            type="minus-circle-o"
            onClick={() => this.remove(k)}
          />
        ) : null}
      </div>

      // <Form.Item
      //   {...formItemLayoutWithOutLabel}
      //   label={''}
      //   required={false}
      //   key={k}
      // >

      // </Form.Item>
    ));
    return (
      <Form onSubmit={this.handleSubmit}>
        {formItems}
        {/* {this.props.form.setFieldsValue({
          data: [{ label: '111', value: '111' }]
        })} */}
        <Form.Item>
          <Button type="dashed" onClick={this.add} style={{ width: '60%' }}>
            <Icon type="plus" /> Add field
          </Button>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

const WrappedDynamicFieldSet = Form.create({ name: 'dynamic_form_item' })(
  DynamicFieldSet
);

export default WrappedDynamicFieldSet;
