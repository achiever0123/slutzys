import { FunctionComponent } from 'react';

const PublicLayout: FunctionComponent<any> = ({ children }: any) => (
  <main role="main">{children}</main>
);

export default PublicLayout;
