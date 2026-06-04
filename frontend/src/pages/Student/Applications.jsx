import { useEffect, useState } from 'react';
import api from '../../api/axios';
import Loader from '../../components/Loader';
import toast from 'react-hot-toast';

const statusColors = {
  Applied: 'bg-blue-50 text-blue-700 ring-blue-600/20',
  Round1: 'bg-indigo-50 text-indigo-700 ring-indigo-600/20',
  Round2: 'bg-purple-50 text-purple-700 ring-purple-600/20',
  HR: 'bg-yellow-50 text-yellow-700 ring-yellow-600/20',
  Selected: 'bg-green-50 text-green-700 ring-green-600/20',
  Rejected: 'bg-red-50 text-red-700 ring-red-600/20',
};

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const { data } = await api.get('/application/my-applications');
        setApplications(data.applications || data || []);
      } catch (error) {
        toast.error('Failed to load applications');
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">My Applications</h1>
        <p className="mt-1 text-sm text-gray-500">
          Track the status of your placement applications.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-4 font-semibold text-gray-900">Company Name</th>
                <th scope="col" className="px-6 py-4 font-semibold text-gray-900">Applied Date</th>
                <th scope="col" className="px-6 py-4 font-semibold text-gray-900">Package (LPA)</th>
                <th scope="col" className="px-6 py-4 font-semibold text-gray-900">Current Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {applications.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                    You haven't applied to any companies yet.
                  </td>
                </tr>
              ) : (
                applications.map((app) => (
                  <tr key={app._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {app.companyId?.companyName || 'Unknown Company'}
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(app.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {app.companyId?.package || 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${statusColors[app.status] || 'bg-gray-50 text-gray-600 ring-gray-500/10'}`}>
                        {app.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Applications;
