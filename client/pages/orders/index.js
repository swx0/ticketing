import { OrderStatus } from '@ticx/common';
import Link from 'next/link';
import Router from 'next/router';

const OrderIndex = ({ orders }) => {
  const orderList = orders.map((order) => {
    return (
      <tr key={order.id}>
        <td>
          <Link href={''} as={``} className="nav-link">
            {order.ticket.title}
          </Link>
        </td>
        <td className="text-uppercase">{order.status}</td>
        <td>
          <button
            className="btn btn-primary"
            onClick={() =>
              Router.push(
                {
                  pathname: '/reviews/new',
                  query: { orderId: order.id },
                },
                '/reviews/new'
              )
            }
          >
            New Review
          </button>
        </td>
      </tr>
    );
  });

  return (
    <div>
      <h1>Orders</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>{orderList}</tbody>
      </table>
    </div>
  );
};

OrderIndex.getInitialProps = async (context, client) => {
  const { data } = await client.get('/api/orders');

  return { orders: data };
};

export default OrderIndex;
