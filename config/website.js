module.exports = {
  pathPrefix: '/', // Prefix for all links. If you deploy your site to example.com/blog your pathPrefix should be "blog"
  siteTitle: 'Bartekus.com', // Navigation and Site Title
  siteTitleAlt: "Coding is my forte", // Alternative Site title for SEO
  siteTitleShort: 'A personal blog', // short_name for manifest
  siteUrl: 'https://bartekus.com', // Domain of your site. No trailing slash!
  siteLanguage: 'en', // Language Tag on <html> element
  siteLogo: 'images/logo.png', // Used for SEO and manifest, path to your image you placed in the 'static' folder
  siteDescription: 'A personal blog of Bartek Kus',
  siteKeywords: ['gatsby, react, babel, webpack, software engineering, programming, development, hacking, node, javascript'],
  author: 'Bartek Kus', // Author for schemaORGJSONLD
  authorMinibio: `
  A pragmatic full-stack software engineer with over six years experience at both small start-ups & medium organizations,
    and extensive proficiency in building scalable backend services,
    dev-ops continuous integration & continuous delivery pipelines,
    and user centric frontend interfaces.
  `,

  organization: 'araphel.org',

  siteFBAppID: '123456789', // Facebook App ID - Optional
  userTwitter: '@bartekus', // Twitter Username
  ogSiteName: 'bartekus.com Gatsby Personal Blog', // Facebook Site Name
  ogLanguage: 'en_US',
  googleAnalyticsID: 'UA-73862241-1',

  // Manifest and Progress color
  themeColor: `#ffffff`,
  backgroundColor: `#ffffff`,

  githubUserName: 'bartekus', // Owner of the github where the site will be stored
  githubRepoName: 'bartekus.com', // The name of the repo that this project will use

  // Social component
  linkedin: 'https://www.linkedin.com/in/bartekus',
  twitter: 'https://mobile.twitter.com/bartekus',
  twitterHandle: '@bartekus',
  github: 'https://github.com/bartekus',
  stackOverflow: 'https://stackoverflow.com/users/4102907/bartekus?tab=profile',
};
