import { APIRequest } from './api-request';

export class ProductService extends APIRequest {
  createProduct(
    files: [{ fieldname: string; file: any }],
    payload: any,
    onProgress?: Function
  ) {
    return this.upload('/performer/performer-assets/products', files, {
      onProgress,
      customData: payload
    });
  }

  uploadImage(
    file: File,
    payload: any,
    onProgress?: Function
  ) {
    return this.upload('/performer/performer-assets/products/image', [{
      fieldname: 'image',
      file
    }], {
      onProgress,
      customData: payload
    });
  }

  update(
    id: string,
    files: [{ fieldname: string; file: any }],
    payload: any,
    onProgress?: Function
  ) {
    return this.upload(`/performer/performer-assets/products/${id}`, files, {
      onProgress,
      customData: payload,
      method: 'PUT'
    });
  }

  search(query?: { [key: string]: any }) {
    return this.get(
      this.buildUrl('/performer/performer-assets/products/search', query)
    );
  }

  userSearch(query?: { [key: string]: any }) {
    return this.get(
      this.buildUrl('/user/performer-assets/products/search', query)
    );
  }

  userView(productId: string) {
    return this.get(`/user/performer-assets/products/${encodeURI(productId)}`);
  }

  findById(id: string) {
    return this.get(`/performer/performer-assets/products/${id}/view`);
  }

  delete(id: string) {
    return this.del(`/performer/performer-assets/products/${id}`);
  }
}

export const productService = new ProductService();
