const LandingPage = ({ currentUser, tickets }) => {
  const ticketList = tickets.map((ticket) => {
    return (
      <tr key={ticket.id}>
        <td>{ticket.title}</td>
        <td>{ticket.price}</td>
      </tr>
    );
  });

  return (
    <div>
      <h1>Tickets</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>{ticketList}</tbody>
      </table>
    </div>
  );
  return currentUser ? <h1>You are signed in</h1> : <h1>Not signed in</h1>;
};

// will be called while rendering app on server
// used to fetch data that this component needs during SSR
// data loading cannot occur in component, as components only rendered once in SSR
LandingPage.getInitialProps = async (context, client, currentUser) => {
  // window only exist in browser, does not exist in nodejs env

  const { data } = await client.get('/api/tickets');

  return { tickets: data };
};

export default LandingPage;
