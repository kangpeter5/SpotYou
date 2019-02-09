import React from 'react'
import PropTypes from 'prop-types'
import { StaticQuery, graphql } from 'gatsby'

import Header from './header'
import '../css/style.css'

const Layout = ({ children }) => (
  <StaticQuery
    query={graphql`
      query SiteTitleQuery {
        site {
          siteMetadata {
            title
            description
          }
        }
      }
    `}
    render={data => (
      <div className="flex flex-col font-sans min-h-screen text-grey-darkest">
        <Header siteTitle={data.site.siteMetadata.title} siteDescription={data.site.siteMetadata.description} />

        <div className="flex flex-col flex-1 md:justify-center max-w-xl mx-auto px-4 py-8 md:p-8 w-full">
          {children}
        </div>

        <footer className="bg-blue">
          <div className="flex justify-between max-w-xl mx-auto p-4 md:p-8 text-sm">
            <p className="text-white">
              A {' '}
              <a
                href="https://www.linkedin.com/in/joshglazer/"
                className="font-bold no-underline text-white"
                target="_blank"
              >
                Josh Glazer
              </a>
              {' '} Project
            </p>

            <p>
              <a
                href="https://github.com/joshglazer/SpotYou"
                className="font-bold no-underline text-white"
                target="_blank"
              >
                Source Code on GitHub
              </a>
            </p>
          </div>
        </footer>
      </div>
    )}
  />
)

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
