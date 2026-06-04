import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, User, FileText, Check, X, Search, RotateCcw } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import Loader from '../../components/Loader';

const STATUS_OPTIONS = [
  'Applied',
  'Round1',
  'Round2',
  'HR',
  'Selected',
  'Rejected'
];

const Applicants = () => {
  const { companyId } = useParams();
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  // Search & Filter States
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [branchFilter, setBranchFilter] = useState('');
  const [minCgpa, setMinCgpa] = useState('');
  const [maxCgpa, setMaxCgpa] = useState('');

  const fetchApplicants = async () => {
    try {
      const { data } = await api.get(`/application/company/${companyId}`);
      setApplicants(data.applications || data || []);
    } catch (error) {
      toast.error('Failed to load applicants');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, [companyId]);

  const handleStatusUpdate = async (applicationId, newStatus) => {
    setUpdating(applicationId);
    try {
      await api.put(`/application/update-status/${applicationId}`, { status: newStatus });
      toast.success('Status updated successfully');
      setApplicants(applicants.map(app => 
        app._id === applicationId ? { ...app, status: newStatus } : app
      ));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdating(null);
    }
  };

  // Get dynamic unique branches from applicants
  const branches = [...new Set(applicants.map(app => app.studentId?.branch).filter(Boolean))].sort();

  // Filter Logic
  const filteredApplicants = applicants.filter(app => {
    const student = app.studentId || {};
    const nameMatch = student.name?.toLowerCase().includes(search.toLowerCase());
    const emailMatch = student.email?.toLowerCase().includes(search.toLowerCase());
    const rollMatch = student.rollNumber?.toLowerCase().includes(search.toLowerCase());
    const searchMatch = !search || nameMatch || emailMatch || rollMatch;

    const statusMatch = !statusFilter || app.status === statusFilter;
    const branchMatch = !branchFilter || student.branch === branchFilter;

    const cgpaValue = student.cgpa != null ? Number(student.cgpa) : 0;
    const minCgpaMatch = !minCgpa || cgpaValue >= Number(minCgpa);
    const maxCgpaMatch = !maxCgpa || cgpaValue <= Number(maxCgpa);

    return searchMatch && statusMatch && branchMatch && minCgpaMatch && maxCgpaMatch;
  });

  const handleResetFilters = () => {
    setSearch('');
    setStatusFilter('');
    setBranchFilter('');
    setMinCgpa('');
    setMaxCgpa('');
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link 
          to="/admin/companies" 
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white border border-gray-200 text-gray-500 hover:text-primary-600 hover:border-primary-200 transition-colors shadow-sm"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Applicants</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage candidates and their interview rounds.
          </p>
        </div>
      </div>

      {/* Search and Filters Panel */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search Bar */}
          <div className="relative w-full md:max-w-md">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
              <Search className="h-5 w-5" />
            </span>
            <input
              type="text"
              placeholder="Search by name, email, roll number..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 text-sm focus:outline-none transition-colors border-solid"
            />
          </div>
          
          {/* Stats & Reset */}
          <div className="flex w-full md:w-auto items-center justify-between md:justify-end gap-4">
            <span className="text-sm font-medium text-gray-500">
              Found <span className="text-gray-900 font-semibold">{filteredApplicants.length}</span> {filteredApplicants.length === 1 ? 'applicant' : 'applicants'}
            </span>
            {(search || statusFilter || branchFilter || minCgpa || maxCgpa) && (
              <button
                onClick={handleResetFilters}
                className="inline-flex items-center text-sm font-semibold text-red-600 hover:text-red-800 transition-colors cursor-pointer border-none bg-transparent"
              >
                <RotateCcw className="mr-1.5 h-4 w-4" /> Reset Filters
              </button>
            )}
          </div>
        </div>

        {/* Filter Inputs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-100">
          {/* Status Filter */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-lg border border-gray-300 py-1.5 px-3 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 focus:outline-none bg-white transition-colors border-solid"
            >
              <option value="">All Statuses</option>
              {STATUS_OPTIONS.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>

          {/* Branch Filter */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Branch</label>
            <select
              value={branchFilter}
              onChange={(e) => setBranchFilter(e.target.value)}
              className="w-full rounded-lg border border-gray-300 py-1.5 px-3 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 focus:outline-none bg-white transition-colors border-solid"
            >
              <option value="">All Branches</option>
              {branches.map(branch => (
                <option key={branch} value={branch}>{branch}</option>
              ))}
            </select>
          </div>

          {/* Min CGPA */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Min CGPA</label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="10"
              placeholder="e.g. 7.5"
              value={minCgpa}
              onChange={(e) => setMinCgpa(e.target.value)}
              className="w-full rounded-lg border border-gray-300 py-1.5 px-3 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 focus:outline-none transition-colors border-solid"
            />
          </div>

          {/* Max CGPA */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Max CGPA</label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="10"
              placeholder="e.g. 9.5"
              value={maxCgpa}
              onChange={(e) => setMaxCgpa(e.target.value)}
              className="w-full rounded-lg border border-gray-300 py-1.5 px-3 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 focus:outline-none transition-colors border-solid"
            />
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-4 font-semibold text-gray-900">Student Info</th>
                <th scope="col" className="px-6 py-4 font-semibold text-gray-900">Academic Details</th>
                <th scope="col" className="px-6 py-4 font-semibold text-gray-900">Resume</th>
                <th scope="col" className="px-6 py-4 font-semibold text-gray-900">Current Status</th>
                <th scope="col" className="px-6 py-4 font-semibold text-gray-900 text-right">Update Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {filteredApplicants.map((app) => (
                <tr key={app._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0 rounded-full bg-primary-100 flex items-center justify-center">
                        <User className="h-5 w-5 text-primary-600" />
                      </div>
                      <div className="ml-4">
                        <div className="font-medium text-gray-900">{app.studentId?.name || 'Unknown'}</div>
                        <div className="text-gray-500">{app.studentId?.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-gray-900">CGPA: <span className="font-medium">{app.studentId?.cgpa}</span></div>
                    <div className="text-gray-500">{app.studentId?.branch} - {app.studentId?.rollNumber}</div>
                  </td>
                  <td className="px-6 py-4">
                    {app.studentId?.resume ? (
                      <a 
                        href={app.studentId.resume} 
                        target="_blank" 
                        rel="noreferrer"
                        className="inline-flex items-center text-primary-600 hover:text-primary-800"
                      >
                        <FileText className="mr-1 h-4 w-4" /> View Resume
                      </a>
                    ) : (
                      <span className="text-gray-400 italic">Not provided</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${
                      app.status === 'Selected' ? 'bg-green-50 text-green-700 ring-green-600/20' : 
                      app.status === 'Rejected' ? 'bg-red-50 text-red-700 ring-red-600/20' : 
                      'bg-blue-50 text-blue-700 ring-blue-600/20'
                    }`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <select 
                        disabled={updating === app._id}
                        value={app.status}
                        onChange={(e) => handleStatusUpdate(app._id, e.target.value)}
                        className="block w-full max-w-[140px] rounded-md border-gray-300 py-1.5 pl-3 pr-8 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 border disabled:opacity-50 shadow-sm"
                      >
                        {STATUS_OPTIONS.map(status => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
              {applicants.length > 0 && filteredApplicants.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center">
                      <Search className="h-10 w-10 text-gray-300 mb-3" />
                      <p className="font-semibold text-gray-700">No Records Found</p>
                      <p className="text-sm mt-1">Try adjusting or resetting your search and filter criteria.</p>
                    </div>
                  </td>
                </tr>
              )}
              {applicants.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center">
                      <User className="h-10 w-10 text-gray-300 mb-3" />
                      <p>No students have applied to this drive yet.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Applicants;
