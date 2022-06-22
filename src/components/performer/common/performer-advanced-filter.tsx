import { PureComponent } from 'react';
import {
  Input, Button, Select
} from 'antd';
import { omit } from 'lodash';
import { ArrowUpOutlined, ArrowDownOutlined, FilterOutlined } from '@ant-design/icons';
import { ICountry, IBody } from '@interfaces/index';

interface IProps {
  onSubmit: Function;
  countries: ICountry[];
  bodyInfo: IBody;
}

export class PerformerAdvancedFilter extends PureComponent<IProps> {
  state = {
    q: '',
    showMore: false
  };

  handleSubmit() {
    const { onSubmit } = this.props;
    onSubmit(omit(this.state, ['showMore']));
  }

  render() {
    const { countries, bodyInfo } = this.props;
    const {
      heights = [], weights = [], bodyTypes = [], genders = [], sexualOrientations = [], ethnicities = [],
      ages = [], hairs = [], pubicHairs = [], eyes = [], butts = []
    } = bodyInfo;
    const { showMore } = this.state;
    return (
      <div style={{ width: '100%' }}>
        <div className="filter-block">
          <div className="filter-item custom">
            <Input
              style={{ width: '100%' }}
              placeholder="Enter keyword"
              onChange={(evt) => this.setState({ q: evt.target.value })}
              onPressEnter={this.handleSubmit.bind(this)}
            />
          </div>
          <div className="filter-item">
            <Select style={{ width: '100%' }} defaultValue="" onChange={(val) => this.setState({ sortBy: val }, () => this.handleSubmit())}>
              <Select.Option value="" disabled>
                <FilterOutlined />
                {' '}
                Sort By
              </Select.Option>
              <Select.Option value="popular">
                Popular
              </Select.Option>
              <Select.Option label="" value="latest">
                Latest
              </Select.Option>
              <Select.Option value="oldest">
                Oldest
              </Select.Option>
            </Select>
          </div>
          <div className="filter-item">
            <Button
              type="primary"
              className="primary"
              style={{ width: '100%' }}
              onClick={() => this.setState({ showMore: !showMore })}
            >
              Advanced search
              {' '}
              {showMore ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
            </Button>
          </div>
        </div>
        <div className={!showMore ? 'filter-block hide' : 'filter-block'}>
          {countries && countries.length > 0 && (
          <div className="filter-item">
            <Select
              onChange={(val) => this.setState({ country: val }, () => this.handleSubmit())}
              style={{ width: '100%' }}
              placeholder="Countries"
              defaultValue=""
              showSearch
              optionFilterProp="label"
            >
              <Select.Option key="All" label="" value="">
                All countries
              </Select.Option>
              {countries.map((c) => (
                <Select.Option key={c.code} label={c.name} value={c.code}>
                  <img alt="flag" src={c.flag} width="25px" />
                  &nbsp;
                  {c.name}
                </Select.Option>
              ))}
            </Select>
          </div>
          )}
          <div className="filter-item">
            <Select
              onChange={(val) => this.setState({ gender: val }, () => this.handleSubmit())}
              style={{ width: '100%' }}
              placeholder="Gender"
              defaultValue=""
            >
              {' '}
              <Select.Option key="all" value="">
                All gender
              </Select.Option>
              {genders.map((gen) => (
                <Select.Option key={gen.value} value={gen.value}>
                  {gen.text || gen.value}
                </Select.Option>
              ))}
            </Select>
          </div>
          <div className="filter-item">
            <Select
              onChange={(val) => this.setState({ sexualPreference: val }, () => this.handleSubmit())}
              style={{ width: '100%' }}
              defaultValue=""
            >
              <Select.Option key="all" value="">
                All sexual orientation
              </Select.Option>
              {sexualOrientations.map((gen) => (
                <Select.Option key={gen.value} value={gen.value}>
                  {gen.text || gen.value}
                </Select.Option>
              ))}
            </Select>
          </div>
          <div className="filter-item">
            <Select
              onChange={(val) => this.setState({ age: val }, () => this.handleSubmit())}
              style={{ width: '100%' }}
              placeholder="Age"
              defaultValue=""
            >
              <Select.Option key="all" value="">
                All age
              </Select.Option>
              {ages.map((i) => (
                <Select.Option key={i.value} value={i.value}>
                  {i.text || i.value}
                </Select.Option>
              ))}
            </Select>
          </div>
          <div className="filter-item">
            <Select
              onChange={(val) => this.setState({ eyes: val }, () => this.handleSubmit())}
              style={{ width: '100%' }}
              placeholder="Eye color"
              defaultValue=""
            >
              <Select.Option key="all" value="">
                All eye color
              </Select.Option>
              {eyes.map((i) => (
                <Select.Option key={i.value} value={i.value}>
                  {i.text || i.value}
                </Select.Option>
              ))}
            </Select>
          </div>
          <div className="filter-item">
            <Select
              onChange={(val) => this.setState({ hair: val }, () => this.handleSubmit())}
              style={{ width: '100%' }}
              placeholder="Hair color"
              defaultValue=""
            >
              <Select.Option key="all" value="">
                All hair
              </Select.Option>
              {hairs.map((i) => (
                <Select.Option key={i.value} value={i.value}>
                  {i.text || i.value}
                </Select.Option>
              ))}
            </Select>
          </div>
          <div className="filter-item">
            <Select
              onChange={(val) => this.setState({ pubicHair: val }, () => this.handleSubmit())}
              style={{ width: '100%' }}
              placeholder="Pubic hair"
              defaultValue=""
            >
              <Select.Option key="all" value="">
                All pubic hair
              </Select.Option>
              {pubicHairs.map((i) => (
                <Select.Option key={i.value} value={i.value}>
                  {i.text || i.value}
                </Select.Option>
              ))}
            </Select>
          </div>
          <div className="filter-item">
            <Select
              onChange={(val) => this.setState({ bust: val }, () => this.handleSubmit())}
              style={{ width: '100%' }}
              placeholder="Butt size"
              defaultValue=""
            >
              <Select.Option key="all" value="">
                All butt size
              </Select.Option>
              {butts.map((i) => (
                <Select.Option key={i.value} value={i.value}>
                  {i.text || i.value}
                </Select.Option>
              ))}
            </Select>
          </div>
          {heights.length > 0 && (
          <div className="filter-item">
            <Select
              onChange={(val) => this.setState({ height: val }, () => this.handleSubmit())}
              style={{ width: '100%' }}
              placeholder="Height"
              defaultValue=""
            >
              <Select.Option key="all" value="">
                All height
              </Select.Option>
              {heights.map((i) => (
                <Select.Option key={i.text} value={i.text}>
                  {i.text}
                </Select.Option>
              ))}
            </Select>
          </div>
          )}
          {weights.length > 0 && (
          <div className="filter-item">
            <Select
              onChange={(val) => this.setState({ weight: val }, () => this.handleSubmit())}
              style={{ width: '100%' }}
              placeholder="Weight"
              defaultValue=""
            >
              <Select.Option key="all" value="">
                All weight
              </Select.Option>
              {weights.map((i) => (
                <Select.Option key={i.text} value={i.text}>
                  {i.text}
                </Select.Option>
              ))}
            </Select>
          </div>
          )}
          <div className="filter-item">
            <Select
              onChange={(val) => this.setState({ ethnicity: val }, () => this.handleSubmit())}
              style={{ width: '100%' }}
              placeholder="Select ethnicity"
              defaultValue=""
            >
              <Select.Option key="all" value="">
                All ethnicity
              </Select.Option>
              {ethnicities.map((i) => (
                <Select.Option key={i.value} value={i.value}>
                  {i.text || i.value}
                </Select.Option>
              ))}
            </Select>
          </div>
          {bodyTypes.length > 0 && (
          <div className="filter-item">
            <Select
              onChange={(val) => this.setState({ bodyType: val }, () => this.handleSubmit())}
              style={{ width: '100%' }}
              placeholder="Select body type"
              defaultValue=""
            >
              <Select.Option key="all" value="">
                All body
              </Select.Option>
              {bodyTypes.map((i) => (
                <Select.Option key={i.value} value={i.value}>
                  {i.text || i.value}
                </Select.Option>
              ))}
            </Select>
          </div>
          )}
        </div>
      </div>
    );
  }
}
