import {
  Descriptions, Tag, Collapse
} from 'antd';
import { PureComponent } from 'react';
import { ICountry, IPerformer } from 'src/interfaces';
import { getDiffDate } from '@lib/date';

interface IProps {
  performer: IPerformer;
  countries: ICountry[];
}

export class PerformerInfo extends PureComponent<IProps> {
  render() {
    const { performer, countries = [] } = this.props;
    const country = countries.length && countries.find((c) => c.name === performer?.country || c.code === performer?.country);
    return (
      <div className="per-infor">
        <Collapse defaultActiveKey={['1']} bordered={false} accordion>
          <Collapse.Panel
            header={country ? (
              <>
                <img alt="performer-country" src={country?.flag} height="25px" />
                &nbsp;
                {country?.name}
              </>
            ) : 'About me'}
            key="1"
          >
            <p className="bio">{performer?.bio || 'No bio yet'}</p>
            {performer?.languages && performer?.languages.length > 0 && (
            <Descriptions>
              <Descriptions.Item label="Languages">
                {performer?.languages.map((lang) => <Tag key={lang}>{lang}</Tag>)}
              </Descriptions.Item>
            </Descriptions>
            )}
            <Descriptions>
              {performer?.ethnicity && <Descriptions.Item label="Ethnicity">{performer?.ethnicity}</Descriptions.Item>}
              {performer?.dateOfBirth && (
              <Descriptions.Item label="Age">
                {`${getDiffDate(performer?.dateOfBirth)}+`}
              </Descriptions.Item>
              )}
              {performer?.gender && (
              <Descriptions.Item label="Gender">
                {performer?.gender}
              </Descriptions.Item>
              )}
              {performer?.sexualPreference && (
              <Descriptions.Item label="Sexual Orientation">
                {performer?.sexualPreference}
              </Descriptions.Item>
              )}
              {performer?.height && <Descriptions.Item label="Height">{performer?.height}</Descriptions.Item>}
              {performer?.weight && <Descriptions.Item label="Weight">{performer?.weight}</Descriptions.Item>}
              {performer?.eyes && <Descriptions.Item label="Eyes color">{performer?.eyes}</Descriptions.Item>}
              {performer?.butt && <Descriptions.Item label="Butt size">{performer?.butt}</Descriptions.Item>}
              {performer?.hair && <Descriptions.Item label="Hair color">{performer?.hair}</Descriptions.Item>}
              {performer?.pubicHair && <Descriptions.Item label="Pubic hair">{performer?.pubicHair}</Descriptions.Item>}
              {performer?.bodyType && <Descriptions.Item label="Body type">{performer?.bodyType}</Descriptions.Item>}
              {performer?.state && <Descriptions.Item label="State">{performer?.state}</Descriptions.Item>}
              {performer?.city && <Descriptions.Item label="City">{performer?.city}</Descriptions.Item>}
              {performer?.address && <Descriptions.Item label="Address">{performer?.address}</Descriptions.Item>}
              {performer?.zipcode && <Descriptions.Item label="Zip code">{performer?.zipcode}</Descriptions.Item>}
            </Descriptions>
          </Collapse.Panel>
        </Collapse>
      </div>
    );
  }
}
