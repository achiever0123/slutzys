import { APIRequest } from './api-request';

class GalleryService extends APIRequest {
  create(payload) {
    return this.post('/performer/performer-assets/galleries', payload);
  }

  search(param?: any) {
    return this.get(this.buildUrl('/performer/performer-assets/galleries/search', param));
  }

  userSearch(param?: any) {
    return this.get(this.buildUrl('/user/performer-assets/galleries/search', param));
  }

  update(id: string, payload) {
    return this.put(`/performer/performer-assets/galleries/${id}`, payload);
  }

  findById(id: string, headers?: any) {
    return this.get(`/performer/performer-assets/galleries/${encodeURI(id)}/view`, headers);
  }

  userViewDetails(id: string, headers?: any) {
    return this.get(`/user/performer-assets/galleries/${encodeURI(id)}/view`, headers);
  }

  delete(id: string) {
    return this.del(`/performer/performer-assets/galleries/${id}`);
  }
}

export const galleryService = new GalleryService();
