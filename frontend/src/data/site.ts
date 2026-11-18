// Single source of truth for the site's public identity. Canonical URLs, Open
// Graph tags, the sitemap, robots.txt and structured data all derive from
// here, so the domain is never hard-coded anywhere else.

// The one origin search engines should index. Every other domain that serves
// this app must permanently redirect to it (Vercel -> Project -> Domains);
// otherwise the same pages are live on several hosts and compete with each other.
export const SITE_URL = 'https://www.degstn.com';

// Bare domain for use in copy, e.g. "degstn.com".
export const SITE_DOMAIN = new URL(SITE_URL).hostname.replace(/^www\./, '');

export const PERSON_NAME = 'Drew Goldstein';

// Shown as the site name in search results and appended to every page title.
export const SITE_NAME = PERSON_NAME;

const PERSON_BIO =
  'Drew Goldstein is the founder of Aremac and a Materials Science & Engineering (IBE Honors) student at Lehigh University.';

// Default meta description: the snippet under the homepage's search result.
export const SITE_DESCRIPTION = `${PERSON_BIO} Projects, CV, writing, and photography.`;

// Profiles that belong to the same person. Emitted as schema.org `sameAs`,
// which is how search engines tie this site to those accounts.
export const SOCIAL_PROFILES = [
  'https://github.com/degstn',
  'https://www.linkedin.com/in/degstn',
  'https://x.com/aegstn',
  'https://www.instagram.com/degstn/',
];

const PERSON_ID = `${SITE_URL}/#person`;

// schema.org graph describing the site and the person it is about.
export const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      alternateName: 'degstn.com',
      inLanguage: 'en-US',
      publisher: { '@id': PERSON_ID },
    },
    {
      '@type': 'Person',
      '@id': PERSON_ID,
      name: PERSON_NAME,
      alternateName: 'degstn',
      url: SITE_URL,
      description: PERSON_BIO,
      jobTitle: 'Founder & CEO',
      worksFor: {
        '@type': 'Organization',
        name: 'Aremac',
        url: 'https://aremac.tech',
      },
      affiliation: {
        '@type': 'CollegeOrUniversity',
        name: 'Lehigh University',
        sameAs: 'https://en.wikipedia.org/wiki/Lehigh_University',
      },
      alumniOf: {
        '@type': 'HighSchool',
        name: 'Pine Crest School',
        sameAs: 'https://en.wikipedia.org/wiki/Pine_Crest_School',
      },
      sameAs: SOCIAL_PROFILES,
    },
  ],
};
