import { APIRequest } from './api-request';

export class SearchService extends APIRequest {
  countTotal(query?: { [key: string]: any }) {
    return this.get(
      this.buildUrl('/search/total', query)
    );
  }
}

export const searchService = new SearchService();
