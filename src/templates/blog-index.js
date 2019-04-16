import React from 'react';
import { Link, graphql } from 'gatsby';
import get from 'lodash/get';

import Bio from '../components/Bio';
import Layout from '../components/Layout';
import SEO from '../components/SEO';
import Footer from '../components/Footer';
import { formatPostDate, formatReadingTime } from '../utils/helpers';
import { rhythm } from '../utils/typography';
import Panel from '../components/Panel';
import Modal from '../components/Modal';
import Resume from '../components/Resume';

class BlogIndexTemplate extends React.Component {
  constructor(props) {
    super(props);
    this.state = { openModal: false };
  }

  handleResumeModal = () => {
    this.setState({ openModal: !this.state.openModal });
  };

  render() {
    const siteTitle = get(this, 'props.data.site.siteMetadata.title');
    const langKey = this.props.pageContext.langKey;

    const posts = get(this, 'props.data.allMarkdownRemark.edges');

    return (
      <Layout location={this.props.location} title={siteTitle}>
        <SEO />
        <aside>
          <Bio />
          <Footer openResumeModal={() => this.handleResumeModal()} />
        </aside>
        <main>
          {langKey !== 'en' && <Panel>These articles have been translated.</Panel>}

          {posts &&
            posts.map(({ node }) => {
              const title = get(node, 'frontmatter.title') || node.fields.slug;
              return (
                <article key={node.fields.slug}>
                  <header>
                    <h3
                      style={{
                        fontFamily: 'Montserrat, sans-serif',
                        fontSize: rhythm(1),
                        marginBottom: rhythm(1 / 4),
                      }}
                    >
                      <Link style={{ boxShadow: 'none' }} to={node.fields.slug} rel="bookmark">
                        {title}
                      </Link>
                    </h3>
                    <small>
                      {formatPostDate(node.frontmatter.date, 'en')}
                      {` • ${formatReadingTime(node.timeToRead)}`}
                    </small>
                  </header>
                  <p dangerouslySetInnerHTML={{ __html: node.frontmatter.spoiler }} />
                </article>
              );
            })}
        </main>
        <Modal open={this.state.openModal} closeModal={() => this.handleResumeModal()}>
          <Resume />
        </Modal>
      </Layout>
    );
  }
}

export default BlogIndexTemplate;

export const pageQuery = graphql`
  query($langKey: String!) {
    site {
      siteMetadata {
        title
        description
      }
    }
    allMarkdownRemark(filter: { fields: { langKey: { eq: $langKey } } }, sort: { fields: [frontmatter___date], order: DESC }) {
      edges {
        node {
          fields {
            slug
            langKey
          }
          timeToRead
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            title
            spoiler
          }
        }
      }
    }
  }
`;
