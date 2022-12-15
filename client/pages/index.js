import buildClient from '../api/build-client';
import axios from 'axios';
const LandingPage = ({ currentUser }) => {
  console.log(currentUser);
  return <h1>Landing page</h1>;
};

// will be called while rendering app on server
// used to fetch data that this component needs during SSR
// data loading cannot occur in component, as components only rendered once in SSR
LandingPage.getInitialProps = async (context) => {
  // window only exist in browser, does not exist in nodejs env
  const client = buildClient(context);
  const { data } = await client.get('/api/users/currentuser');
  return data;
};

export default LandingPage;
