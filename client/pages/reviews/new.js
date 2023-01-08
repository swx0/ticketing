import { useState } from 'react';
import useRequest from '../../hooks/use-request';
import Router from 'next/router';
import { withRouter } from 'next/router';

const NewReview = (props) => {
  const [rating, setRating] = useState();
  const [content, setContent] = useState('');

  const orderId = props.router.query.orderId;

  const { doRequest, errors } = useRequest({
    url: '/api/reviews',
    method: 'post',
    body: {
      rating,
      content,
      orderId,
    },
    onSuccess: (review) => {
      console.log(review);
      Router.push('/');
    },
  });

  const onSubmit = (event) => {
    event.preventDefault();

    doRequest();
  };

  return (
    <div>
      <h1>Create a review{orderId}</h1>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Rating</label>
          <input
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Content</label>
          <input
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="form-control"
          />
        </div>
        {errors}
        <button className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
};

export default withRouter(NewReview);
