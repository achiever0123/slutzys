import React from 'react'
import { Instagram } from 'react-content-loader'
import { Row, Col } from 'antd';

const LoaderList = ({
    row = 2,
    column = 4,
    padding = 12,
}) => {
    const columnWidth = 24 / column
    return <>
        {(Array.from(Array(row).keys()).map(i => {
            return <Row>
                {Array.from(Array(column).keys()).map(index => {
                    return <Col xs={columnWidth * 2} sm={columnWidth * 2} md={columnWidth} lg={columnWidth} key={index}>
                        <Instagram backgroundColor="#d9d9d9" foregroundColor="#bababa" />
                    </Col>
                })}
            </Row>
        }))}
    </>
}
export default LoaderList;