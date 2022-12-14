import 'bootstrap/dist/css/bootstrap.css';

// This file is for global css that needs to appear in every page
// will always load up for users to this app
const wrapper = ({ Component, pageProps }) => {
  return <Component {...pageProps} />;
};

export default wrapper;
