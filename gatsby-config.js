const { typeNameFromDir } = require("gatsby-transformer-csv")


module.exports = {
  pathPrefix: '/visualization-sketches',
    // pathPrefix: '/',

  siteMetadata: {
    siteUrl: "https://www.yourdomain.tld",
    title: "Visualization Sketches",
  },
  plugins: [
    {
    resolve: `gatsby-plugin-styled-components`,
    options: {
    },
  },
    "gatsby-plugin-sass",

    "gatsby-plugin-mdx",
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "pages",
        path: "./src/pages/",
      },
      __key: "pages",
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `data`,
        path: `${__dirname}/src/data/`,
      },
    },
    {
      resolve: `gatsby-plugin-offline`,
      options: {
        precachePages: [`/*`],
      },
    },
    {
      resolve: `gatsby-transformer-csv`,
      options: {
        noheader: false,
        typeName: typeNameFromDir,
        nodePerFile: true,
      },
    },
  ],
};




const path = require("path")
exports.createPages = async ({ graphql, actions, reporter }) => {
  // Destructure the createPage function from the actions object
  const { createPage } = actions
  const result = await graphql(`
    query {
      allMdx {
        edges {
          node {
            id
            slug
          }
        }
      }
    }
  `)
  if (result.errors) {
    reporter.panicOnBuild('🚨  ERROR: Loading "createPages" query')
  }
  // Create blog post pages.
  const posts = result.data.allMdx.edges
  // you'll call `createPage` for each result
  posts.forEach(({ node }, index) => {
    createPage({
      // The slug generated by gatsby-plugin-mdx doesn't contain a slash at the beginning
      // You can prepend it with any prefix you want
      path: `/blog/${node.slug}`,
      // This component will wrap our MDX content
      component: path.resolve(`./src/components/posts-page-layout.js`),
      // You can use the values in this context in
      // our page layout component
      context: { id: node.id },
    })
  })
}
