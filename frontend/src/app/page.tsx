import HomeClient from './HomeClient'

// The build's branch and version stamp are read here, on the server, so they
// travel in the HTML. Read inside HomeClient they were compiled into its
// JavaScript file, which renamed that file on every deploy. A crawler that
// fetched this page before a deploy and rendered it afterwards then asked for a
// file that no longer existed, and the page was replaced by Next's
// "Application error" screen. That is the copy Google indexed.
export default function Home() {
  return (
    <HomeClient
      branch={process.env.NEXT_PUBLIC_GIT_BRANCH || 'local'}
      version={process.env.NEXT_PUBLIC_VERSION}
    />
  )
}
