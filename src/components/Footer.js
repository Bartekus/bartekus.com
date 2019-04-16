import React from 'react';

import { rhythm } from '../utils/typography';
import config from '../../config/website';

const Footer = ({ openResumeModal }) => {
  return (
    <footer
      style={{
        marginTop: rhythm(1),
        marginBottom: rhythm(2),
      }}
    >
      <div style={{ float: 'right' }}>
        <a href="/rss.xml" target="_blank" rel="noopener noreferrer">
          rss
        </a>
      </div>
      <a href="#" rel="noopener noreferrer" style={{ cursor: 'pointer' }} onClick={openResumeModal}>
        resume
      </a>{' '}
      &bull;{' '}
      <a href={config.twitter} target="_blank" rel="noopener noreferrer">
        twitter
      </a>{' '}
      &bull;{' '}
      <a href={config.github} target="_blank" rel="noopener noreferrer">
        github
      </a>{' '}
      {/*&bull;{' '}*/}
      {/*<a href={config.stackOverflow} target="_blank" rel="noopener noreferrer">*/}
      {/*  stack overflow*/}
      {/*</a>*/}
    </footer>
  );
};

export default Footer;
