import { useEffect, useState } from 'react';
import { Building2, Users, FileCheck, AlertCircle, X, FileText, Search, RotateCcw, ArrowUp, ArrowDown, Percent, Award, TrendingUp, Briefcase } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import Loader from '../../components/Loader';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Popup Modal States
  const [modalType, setModalType] = useState(null); // 'applications' | 'selected'
  const [modalData, setModalData] = useState([]);
  const [modalLoading, setModalLoading] = useState(false);

  // Modal Search, Filter, Sort, Pagination States
  const [modalSearch, setModalSearch] = useState('');
  const [modalStatusFilter, setModalStatusFilter] = useState('');
  const [modalBranchFilter, setModalBranchFilter] = useState('');
  const [modalMinCgpa, setModalMinCgpa] = useState('');
  const [modalMaxCgpa, setModalMaxCgpa] = useState('');
  const [modalSortField, setModalSortField] = useState(''); // 'cgpa' | 'date' | 'company'
  const [modalSortOrder, setModalSortOrder] = useState('desc'); // 'asc' | 'desc'
  const [modalCurrentPage, setModalCurrentPage] = useState(1);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/admin/dashboard-stats');
        setStats(data);
      } catch (error) {
        toast.error('Failed to load dashboard statistics');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const openModal = async (type) => {
    setModalType(type);
    setModalLoading(true);
    setModalSearch('');
    setModalStatusFilter('');
    setModalBranchFilter('');
    setModalMinCgpa('');
    setModalMaxCgpa('');
    setModalSortField('');
    setModalSortOrder('desc');
    setModalCurrentPage(1);
    try {
      const endpoint = type === 'applications' ? '/admin/applications' : '/admin/selected-students';
      const { data } = await api.get(endpoint);
      setModalData(data);
    } catch (error) {
      toast.error(`Failed to load ${type === 'applications' ? 'applications' : 'selected students'} details`);
      setModalType(null);
    } finally {
      setModalLoading(false);
    }
  };

  // Reset page to 1 when filters change
  useEffect(() => {
    setModalCurrentPage(1);
  }, [modalSearch, modalStatusFilter, modalBranchFilter, modalMinCgpa, modalMaxCgpa, modalSortField, modalSortOrder]);

  // Extract unique branches from modalData
  const modalBranches = [...new Set(modalData.map(app => app.studentId?.branch).filter(Boolean))].sort();

  // Filter & Sort modal data
  const filteredModalData = modalData
    .filter(app => {
      const student = app.studentId || {};
      const company = app.companyId || {};
      
      const searchLower = modalSearch.toLowerCase();
      const nameMatch = student.name?.toLowerCase().includes(searchLower);
      const rollMatch = student.rollNumber?.toLowerCase().includes(searchLower);
      const companyMatch = company.companyName?.toLowerCase().includes(searchLower);
      const searchMatch = !modalSearch || nameMatch || rollMatch || companyMatch;

      const statusMatch = modalType === 'selected' || !modalStatusFilter || app.status === modalStatusFilter;
      const branchMatch = !modalBranchFilter || student.branch === modalBranchFilter;

      const cgpaValue = student.cgpa != null ? Number(student.cgpa) : 0;
      const minCgpaMatch = !modalMinCgpa || cgpaValue >= Number(modalMinCgpa);
      const maxCgpaMatch = !modalMaxCgpa || cgpaValue <= Number(modalMaxCgpa);

      return searchMatch && statusMatch && branchMatch && minCgpaMatch && maxCgpaMatch;
    })
    .sort((a, b) => {
      if (!modalSortField) return 0;
      
      let valA = 0;
      let valB = 0;
      
      if (modalSortField === 'cgpa') {
        valA = a.studentId?.cgpa != null ? Number(a.studentId.cgpa) : 0;
        valB = b.studentId?.cgpa != null ? Number(b.studentId.cgpa) : 0;
      } else if (modalSortField === 'date') {
        valA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        valB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      } else if (modalSortField === 'company') {
        valA = a.companyId?.companyName || '';
        valB = b.companyId?.companyName || '';
      }
      
      if (valA < valB) return modalSortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return modalSortOrder === 'asc' ? 1 : -1;
      return 0;
    });

  const totalPages = Math.ceil(filteredModalData.length / 10);
  const paginatedModalData = filteredModalData.slice((modalCurrentPage - 1) * 10, modalCurrentPage * 10);

  if (loading) return <Loader />;

  const statCards = [
    { title: 'Total Students', value: stats?.totalStudents || 0, icon: Users, color: 'bg-blue-50 text-blue-600', link: '/admin/companies' },
    { title: 'Total Companies', value: stats?.totalCompanies || 0, icon: Building2, color: 'bg-purple-50 text-purple-600', link: '/admin/companies' },
    { title: 'Total Applications', value: stats?.totalApplications || 0, icon: FileCheck, color: 'bg-indigo-50 text-indigo-600', action: () => openModal('applications') },
    { title: 'Selected Students', value: stats?.selectedStudents || 0, icon: AlertCircle, color: 'bg-green-50 text-green-600', action: () => openModal('selected') },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Admin Overview</h1>
        <p className="mt-1 text-sm text-gray-500">
          Monitor placement activities and statistics.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          const isInteractive = card.link || card.action;
          return (
            <div
              key={index}
              onClick={() => {
                if (card.link) navigate(card.link);
                if (card.action) card.action();
              }}
              className={`flex items-center overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:shadow-md ${isInteractive ? 'cursor-pointer hover:border-primary-300' : ''}`}
            >
              <div className={`mr-5 flex h-14 w-14 items-center justify-center rounded-full ${card.color}`}>
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <p className="truncate text-sm font-medium text-gray-500">{card.title}</p>
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Quick Actions */}
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm max-w-2xl">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 font-bold tracking-tight">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button 
            onClick={() => navigate('/admin/companies')} 
            className="flex items-center justify-between rounded-xl bg-gray-50 p-5 hover:bg-gray-100 transition-all cursor-pointer border border-transparent hover:border-gray-200 hover:shadow-sm"
          >
            <span className="font-semibold text-gray-700">Add New Company</span>
            <span className="text-primary-600 font-bold text-lg">+</span>
          </button>
          <button 
            onClick={() => navigate('/admin/companies')} 
            className="flex items-center justify-between rounded-xl bg-gray-50 p-5 hover:bg-gray-100 transition-all cursor-pointer border border-transparent hover:border-gray-200 hover:shadow-sm"
          >
            <span className="font-semibold text-gray-700">Manage Applicants</span>
            <span className="text-primary-600 font-bold text-lg">→</span>
          </button>
        </div>
      </div>

      {/* Popup Modal */}
      {modalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="relative w-full max-w-6xl rounded-2xl bg-white shadow-2xl border border-gray-100 flex flex-col max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  {modalType === 'applications' ? 'Total Applications Details' : 'Selected Students Details'}
                </h3>
                <p className="text-sm text-gray-500 mt-0.5">
                  Showing detailed record of candidate applications
                </p>
              </div>
              <button
                onClick={() => setModalType(null)}
                className="rounded-full p-1.5 text-gray-400 hover:bg-gray-105 hover:text-gray-700 transition-colors cursor-pointer"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Search and Filters */}
            <div className="bg-gray-50/50 border-b border-gray-100 p-6 space-y-4">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                {/* Search input */}
                <div className="relative w-full md:max-w-md">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                    <Search className="h-5 w-5" />
                  </span>
                  <input
                    type="text"
                    placeholder="Search by student, roll no, company..."
                    value={modalSearch}
                    onChange={(e) => setModalSearch(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 text-sm focus:outline-none transition-colors bg-white border-solid"
                  />
                </div>

                {/* Stats & Reset */}
                <div className="flex w-full md:w-auto items-center justify-between md:justify-end gap-4">
                  <span className="text-sm font-medium text-gray-500">
                    Found <span className="text-gray-900 font-semibold">{filteredModalData.length}</span> {filteredModalData.length === 1 ? 'student' : 'students'}
                  </span>
                  {(modalSearch || modalStatusFilter || modalBranchFilter || modalMinCgpa || modalMaxCgpa || modalSortField) && (
                    <button
                      onClick={() => {
                        setModalSearch('');
                        setModalStatusFilter('');
                        setModalBranchFilter('');
                        setModalMinCgpa('');
                        setModalMaxCgpa('');
                        setModalSortField('');
                        setModalSortOrder('desc');
                      }}
                      className="inline-flex items-center text-sm font-semibold text-red-600 hover:text-red-800 transition-colors cursor-pointer border-none bg-transparent"
                    >
                      <RotateCcw className="mr-1.5 h-4 w-4" /> Reset Filters
                    </button>
                  )}
                </div>
              </div>

              {/* Filters and Sorting Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 pt-2">
                {/* Status Filter (Applications Modal only) */}
                {modalType === 'applications' && (
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Status</label>
                    <select
                      value={modalStatusFilter}
                      onChange={(e) => setModalStatusFilter(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 py-1.5 px-3 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 focus:outline-none bg-white transition-colors border-solid"
                    >
                      <option value="">All Statuses</option>
                      <option value="Applied">Applied</option>
                      <option value="Round1">Round 1</option>
                      <option value="Round2">Round 2</option>
                      <option value="HR">HR Round</option>
                      <option value="Selected">Selected</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>
                )}

                {/* Branch Filter */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Branch</label>
                  <select
                    value={modalBranchFilter}
                    onChange={(e) => setModalBranchFilter(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 py-1.5 px-3 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 focus:outline-none bg-white transition-colors border-solid"
                  >
                    <option value="">All Branches</option>
                    {modalBranches.map(branch => (
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
                    value={modalMinCgpa}
                    onChange={(e) => setModalMinCgpa(e.target.value)}
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
                    value={modalMaxCgpa}
                    onChange={(e) => setModalMaxCgpa(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 py-1.5 px-3 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 focus:outline-none transition-colors border-solid"
                  />
                </div>

                {/* Sorting Field */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Sort By</label>
                  <div className="flex gap-1.5">
                    <select
                      value={modalSortField}
                      onChange={(e) => {
                        setModalSortField(e.target.value);
                        if (!modalSortField && e.target.value) {
                          setModalSortOrder('desc');
                        }
                      }}
                      className="w-full rounded-lg border border-gray-300 py-1.5 px-3 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 focus:outline-none bg-white transition-colors border-solid"
                    >
                      <option value="">None</option>
                      <option value="cgpa">CGPA</option>
                      {modalType === 'applications' ? (
                        <option value="date">Applied Date</option>
                      ) : (
                        <option value="company">Company Name</option>
                      )}
                    </select>
                    {modalSortField && (
                      <button
                        onClick={() => setModalSortOrder(modalSortOrder === 'asc' ? 'desc' : 'asc')}
                        className="p-1.5 border border-gray-300 rounded-lg hover:bg-gray-150 transition-colors bg-white cursor-pointer"
                        title={modalSortOrder === 'asc' ? 'Ascending' : 'Descending'}
                      >
                        {modalSortOrder === 'asc' ? <ArrowUp className="h-4 w-4 text-primary-600" /> : <ArrowDown className="h-4 w-4 text-primary-600" />}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto flex-1 min-h-[300px]">
              {modalLoading ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-100 border-t-primary-600"></div>
                  <p className="text-sm text-gray-500 mt-4">Loading details...</p>
                </div>
              ) : modalData.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                  <Users className="h-12 w-12 text-gray-300 mb-3" />
                  <p className="font-medium text-gray-700">No applications found</p>
                </div>
              ) : filteredModalData.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                  <Search className="h-12 w-12 text-gray-300 mb-3" />
                  <p className="font-semibold text-gray-700">No Records Found</p>
                  <p className="text-sm mt-1">Try adjusting or resetting your search and filter criteria.</p>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-gray-200">
                  <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-4 font-semibold text-gray-900">Student Info</th>
                        <th scope="col" className="px-6 py-4 font-semibold text-gray-900">Roll No</th>
                        <th 
                          scope="col" 
                          onClick={() => {
                            setModalSortField('cgpa');
                            setModalSortOrder(prev => modalSortField === 'cgpa' && prev === 'desc' ? 'asc' : 'desc');
                          }}
                          className="px-6 py-4 font-semibold text-gray-900 cursor-pointer select-none hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-center">
                            CGPA
                            {modalSortField === 'cgpa' && (
                              modalSortOrder === 'asc' ? <ArrowUp className="ml-1 h-4 w-4 text-primary-600" /> : <ArrowDown className="ml-1 h-4 w-4 text-primary-600" />
                            )}
                          </div>
                        </th>
                        <th 
                          scope="col" 
                          onClick={() => {
                            if (modalType === 'selected') {
                              setModalSortField('company');
                              setModalSortOrder(prev => modalSortField === 'company' && prev === 'desc' ? 'asc' : 'desc');
                            }
                          }}
                          className={`px-6 py-4 font-semibold text-gray-900 select-none transition-colors ${modalType === 'selected' ? 'cursor-pointer hover:bg-gray-100' : ''}`}
                        >
                          <div className="flex items-center">
                            Company Details
                            {modalType === 'selected' && modalSortField === 'company' && (
                              modalSortOrder === 'asc' ? <ArrowUp className="ml-1 h-4 w-4 text-primary-600" /> : <ArrowDown className="ml-1 h-4 w-4 text-primary-600" />
                            )}
                          </div>
                        </th>
                        <th 
                          scope="col" 
                          onClick={() => {
                            if (modalType === 'applications') {
                              setModalSortField('date');
                              setModalSortOrder(prev => modalSortField === 'date' && prev === 'desc' ? 'asc' : 'desc');
                            }
                          }}
                          className={`px-6 py-4 font-semibold text-gray-900 select-none transition-colors ${modalType === 'applications' ? 'cursor-pointer hover:bg-gray-100' : ''}`}
                        >
                          <div className="flex items-center">
                            Applied Date
                            {modalType === 'applications' && modalSortField === 'date' && (
                              modalSortOrder === 'asc' ? <ArrowUp className="ml-1 h-4 w-4 text-primary-600" /> : <ArrowDown className="ml-1 h-4 w-4 text-primary-600" />
                            )}
                          </div>
                        </th>
                        <th scope="col" className="px-6 py-4 font-semibold text-gray-900">Resume</th>
                        <th scope="col" className="px-6 py-4 font-semibold text-gray-900">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {paginatedModalData.map((app) => (
                        <tr key={app._id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="font-semibold text-gray-900">{app.studentId?.name || 'N/A'}</div>
                            <div className="text-xs text-gray-505">{app.studentId?.email}</div>
                            <div className="text-xs text-gray-400 font-medium">{app.studentId?.branch || 'N/A'}</div>
                          </td>
                          <td className="px-6 py-4 text-gray-700 font-medium">{app.studentId?.rollNumber || 'N/A'}</td>
                          <td className="px-6 py-4 text-gray-700 font-semibold">{app.studentId?.cgpa != null ? app.studentId.cgpa : 'N/A'}</td>
                          <td className="px-6 py-4">
                            <div className="font-semibold text-gray-900">{app.companyId?.companyName || 'Unknown'}</div>
                            <div className="text-xs text-primary-600 font-semibold">{app.companyId?.package ? `${app.companyId.package} LPA` : 'N/A'}</div>
                          </td>
                          <td className="px-6 py-4 text-gray-500 font-medium">{new Date(app.createdAt).toLocaleDateString()}</td>
                          <td className="px-6 py-4">
                            {app.studentId?.resume ? (
                              <a
                                href={app.studentId.resume}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center text-primary-600 hover:text-primary-800 font-semibold transition-colors"
                              >
                                <FileText className="mr-1 h-4 w-4" /> View PDF
                              </a>
                            ) : (
                              <span className="text-gray-400 italic">No resume</span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${
                              app.status === 'Selected' ? 'bg-green-50 text-green-700 ring-green-600/20' : 
                              app.status === 'Rejected' ? 'bg-red-50 text-red-700 ring-red-600/20' : 
                              app.status === 'Applied' ? 'bg-blue-50 text-blue-700 ring-blue-600/20' :
                              'bg-indigo-50 text-indigo-700 ring-indigo-600/20'
                            }`}>
                              {app.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            
            {/* Footer */}
            <div className="border-t border-gray-100 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50">
              {/* Pagination Controls */}
              {totalPages > 1 ? (
                <div className="flex items-center space-x-2">
                  <button
                    disabled={modalCurrentPage === 1}
                    onClick={() => setModalCurrentPage(prev => Math.max(prev - 1, 1))}
                    className="px-3 py-1.5 text-xs font-semibold rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors cursor-pointer border-solid"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-gray-600 font-medium">
                    Page {modalCurrentPage} of {totalPages}
                  </span>
                  <button
                    disabled={modalCurrentPage === totalPages}
                    onClick={() => setModalCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    className="px-3 py-1.5 text-xs font-semibold rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors cursor-pointer border-solid"
                  >
                    Next
                  </button>
                </div>
              ) : (
                <div className="text-xs text-gray-400">
                  Showing all matching records
                </div>
              )}
              
              <button
                onClick={() => setModalType(null)}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none cursor-pointer border-solid"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
