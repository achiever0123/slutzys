export interface ISettings {
  verotelEnabled: boolean;
  ccbillEnabled: boolean;
  cookiePolicyEnabled: boolean;
  cookiePolicyContentId: string;
  maintenanceMode: boolean;
  popup18Enabled: boolean;
  popup18ContentId: string;
  metaDescription: string;
  metaKeywords: string;
  contactContentId:string;
}

export interface IContact {
  email: string;
  message: any;
  name: string;
}

export interface IError {
  statusCode: number;
  message: string;
}
