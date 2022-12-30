import axios from 'axios';

const buildClient = ({ req }) => {
  // window only exist in browser, does not exist in nodejs env
  if (typeof window === 'undefined') {
    // Rendering app In server
    // requests should be made to http://ingress-nginx-controller.ingress-nginx.svc.cluster.local

    // Domain is not specified for server, ingress wont know which set of rules to use (need to forward headers)

    //preconfigured axios
    return axios.create({
      baseURL:
        'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
      headers: req.headers,
    });
  } else {
    // Rendering app In browser
    // requests can be made with base url of ''
    return axios.create({ baseURL: '/' });
  }
};

export default buildClient;
