import React, { Fragment } from 'react';
import profilePic from '../assets/profile-pic.png';
import { rhythm } from '../utils/typography';
import config from '../../config/website';

class Bio extends React.Component {
  render() {
    return (
      <Fragment>
        <div
          style={{
            display: 'flex',
          }}
        >
          <img
            src={profilePic}
            alt={config.author}
            style={{
              marginRight: rhythm(1 / 2),
              marginBottom: 0,
              width: rhythm(2),
              height: rhythm(2),
              borderRadius: '50%',
            }}
          />
          <p style={{ maxWidth: 310 }}>
            {config.siteTitleAlt}.
            <br />
            {config.siteTitleShort} of {config.author}.
          </p>
        </div>
        <div>{config.authorMinibio}</div>
      </Fragment>
    );
  }
}

export default Bio;
