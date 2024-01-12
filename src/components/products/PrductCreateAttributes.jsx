
import { Form, Select, Row, Col } from 'antd';

import ProductSectionTitle from './ProuctSectionTitle';

const PrductCreateAttributes = () => {
    return (
        <>
            <ProductSectionTitle title='Thuộc tính sản phẩm' />
            <Row gutter={30}>
                <Col span={8}>
                    <Form.Item label='Loại cài đặt' name='installation-type'>
                        <Select
                            defaultValue="lucy"
                            onChange={() => {}} 
                            options={[
                                { value: 'freestanding', label: 'Freestanding' },
                                { value: 'lucy', label: 'Lucy' },
                                { value: 'Yiminghe', label: 'yiminghe' },
                                { value: 'disabled', label: 'Disabled', disabled: true },
                            ]}
                        />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item label='Scratcher Surface' name='scratcher-surface'>
                        <Select />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item label='Tính năng' name='feature'>
                        <Select />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item label='Fil Material' name='fill-material'>
                        <Select />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item label='Pattern' name='pattern'>
                        <Select />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item label='Pet Size' name='pet-sie'>
                        <Select />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item label='Style' name='style'>
                        <Select />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item label='Pet Type' name='pet-type'>
                        <Select />
                    </Form.Item>
                </Col>

                <Col span={8}>
                    <Form.Item label='Cover Material' name='cover-material'>
                        <Select />
                    </Form.Item>
                </Col>
            </Row>
        </>
    );
}
 
export default PrductCreateAttributes;