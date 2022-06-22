import { APIRequest } from './api-request';

export class ReportService extends APIRequest {
  search(data) {
    return this.get(this.buildUrl('/reports/performers', data));
  }

  create(payload: any) {
    return this.post('/reports', payload);
  }
}

export const reportService = new ReportService();
