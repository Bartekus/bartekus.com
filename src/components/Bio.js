import React from 'react';
import profilePic from '../assets/profile-pic.png';
import { rhythm } from '../utils/typography';
import config from '../../config/website';

class Bio extends React.Component {
  render() {
    return (
      <div
        style={{
          display: 'flex',
          // marginBottom: rhythm(2),
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
          {config.siteTitleShort} of <a href={config.twitter}>{config.author}</a>. <br />
          {config.siteTitleAlt}.
        </p>
      </div>
    );
  }
}

export default Bio;
