import 'bootstrap/dist/css/bootstrap.css';
import buildClient from '../api/build-client';
import Header from '../components/header';

// This file is for global css that needs to appear in every page
// will always load up for users to this app
const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <div>
      <Header currentUser={currentUser} />
      <Component {...pageProps} />
    </div>
  );
};

AppComponent.getInitialProps = async (appContext) => {
  const client = buildClient(appContext.ctx);
  const { data } = await client.get('api/users/currentuser');

  // This is invoking the getInitialProps of the LandingPage (index.js) or signup.js etc
  let pageProps = {};
  // For the case where getInitialProps defined
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(appContext.ctx);
  }

  return { pageProps, currentUser: data.currentUser };
};

export default AppComponent;
