import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDeals } from '@/store/dealStore';
import { useAuth } from '@/context/AuthContext';

export default function AdminPage() {
  const { deals, fetchDeals, deleteDeal } = useDeals();
  const { user } = useAuth();

  useEffect(() => {
    fetchDeals();
  }, [fetchDeals]);

  if (!user?.isAdmin) {
    return <div>Access denied</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Deals Management</h1>
        <Link
          to="/admin/deals/create"
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
          Create New Deal
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <table className="min-w-full">
          <thead>
            <tr className="border-b dark:border-gray-700">
              <th className="px-6 py-3 text-left">Title</th>
              <th className="px-6 py-3 text-left">Category</th>
              <th className="px-6 py-3 text-left">Price</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {deals.map((deal) => (
              <tr key={deal.id} className="border-b dark:border-gray-700">
                <td className="px-6 py-4">{deal.title}</td>
                <td className="px-6 py-4">{deal.category}</td>
                <td className="px-6 py-4">${deal.discountedPrice}</td>
                <td className="px-6 py-4 space-x-2">
                  <Link
                    to={`/admin/deals/edit/${deal.id}`}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => deleteDeal(deal.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
