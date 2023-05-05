import classNames from 'classnames'
import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head >
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css"></link>
      </Head>
      <body className={classNames('customScrollbar',
        //DarkMode
        'dark:bg-priBlack-700'
      )}>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
