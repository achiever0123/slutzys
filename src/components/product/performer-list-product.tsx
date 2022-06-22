import { PureComponent } from 'react';
import { Row, Col } from 'antd';
import ProductCard from './product-card';
import { IProduct } from '../../interfaces/product';

interface IProps {
  products: IProduct[];
}

export class PerformerListProduct extends PureComponent<IProps> {
  render() {
    const { products } = this.props;
    return (
      <Row>
        {products.length > 0
          && products.map((product: IProduct) => (
            <Col xs={12} sm={12} md={6} lg={6} key={product._id}>
              <ProductCard product={product} />
            </Col>
          ))}
      </Row>
    );
  }
}
