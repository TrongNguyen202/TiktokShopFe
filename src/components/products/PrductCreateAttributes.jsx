
import { Form, Select, Row, Col } from 'antd';

import ProductSectionTitle from './ProuctSectionTitle';

const PrductCreateAttributes = () => {
    return (
        <>
            <ProductSectionTitle title='Thuộc tính sản phẩm' />
            <Row>
                <Col span={8}>
                    <Form.Item label='Loại cài đặt' name='installation-type'>
                        <Select
                            defaultValue="lucy"
                            onChange={() => {}} 
                            options={[
                                { value: 'jack', label: 'Jack' },
                                { value: 'lucy', label: 'Lucy' },
                                { value: 'Yiminghe', label: 'yiminghe' },
                                { value: 'disabled', label: 'Disabled', disabled: true },
                            ]}
                        />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item label='Scratcher Surface'>
                        <Select />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item label='Tính năng'>
                        <Select />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item label='Fil Material'>
                        <Select />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item label='Pattern'>
                        <Select />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item label='Pet Size'>
                        <Select />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item label='Style'>
                        <Select />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item label='Pet Type'>
                        <Select />
                    </Form.Item>
                </Col>

                <Col span={8}>
                    <Form.Item label='Cover Material'>
                        <Select />
                    </Form.Item>
                </Col>
            </Row>
        </>
    );
}
 
export default PrductCreateAttributes;