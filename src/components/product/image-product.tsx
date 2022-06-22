import { PureComponent } from 'react';
import { IProduct } from 'src/interfaces';
import Link from 'next/link';

interface IProps {
  product: IProduct;
  style?: Record<string, string>;
}

export class ImageProduct extends PureComponent<IProps> {
  render() {
    const { product, style } = this.props;
    const thumbUrl = (product?.images && product?.images[0]?.thumbnails && product?.images[0]?.thumbnails[0]) || (product?.images && product?.images[0]?.url) || '/empty_product.svg';
    return <Link href={{ pathname: '/store/details', query: { id: product?.slug || product?._id } }} as={`/store/${product?.slug || product?._id}`}><a><img alt="" src={thumbUrl} style={style || { width: 65 }} /></a></Link>;
  }
}
