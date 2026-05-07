/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://andesvirustracker.com',
  generateRobotsTxt: true,
  changefreq: 'hourly',
  priority: 1.0,
  additionalPaths: async (config) => [
    await config.transform(config, '/andes-virus-symptoms'),
    await config.transform(config, '/andes-virus-transmission'),
    await config.transform(config, '/andes-virus-vs-hantavirus'),
    await config.transform(config, '/andes-virus-incubation-period'),
    await config.transform(config, '/andes-virus-news'),
  ],
}
