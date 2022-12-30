import axios from 'axios';
import { useState } from 'react';

const useRequest = ({ url, method, body, onSuccess }) => {
  const [errors, setErrors] = useState(null);

  // props = {} means optional args that would be merged to request body
  const doRequest = async (props = {}) => {
    try {
      // Reset errors for each request
      setErrors(null);

      // method could be get, post, patch
      const response = await axios[method](url, { ...body, ...props }); // merging additional args from props to body

      if (onSuccess) {
        onSuccess(response.data);
      }

      return response.data;
    } catch (err) {
      setErrors(
        <div className="alert alert-danger">
          <h4>Ooops</h4>
          <ul className="my-0">
            {err.response.data.errors.map((err) => (
              <li key={err.message}>{err.message}</li>
            ))}
          </ul>
        </div>
      );
    }
  };

  return { doRequest, errors };
};

export default useRequest;
