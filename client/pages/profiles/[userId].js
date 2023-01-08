import useRequest from '../../hooks/use-request';
import Router from 'next/router';

const ProfileShow = ({ userId, profile }) => {
  const reviewList = profile.reviews.map((review) => {
    return (
      <tr key={review.id}>
        <td>{review.content}</td>
        <td>{review.rating.toString()}</td>
      </tr>
    );
  });

  return (
    <div>
      <h1>Reviews</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Description</th>
            <th>Rating</th>
            <th></th>
          </tr>
        </thead>
        <tbody>{reviewList}</tbody>
      </table>
    </div>
  );
};

ProfileShow.getInitialProps = async (context, client) => {
  // based on name of file
  const { userId } = context.query;
  const { data } = await client.get(`/api/profiles/${userId}`);

  return { profile: data, userId };
};

export default ProfileShow;
