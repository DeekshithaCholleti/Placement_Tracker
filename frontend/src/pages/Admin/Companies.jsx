import { useEffect, useState } from 'react';
import { Plus, Trash2, Users, Edit, Search, RotateCcw, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import Loader from '../../components/Loader';

const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCompanyForModal, setSelectedCompanyForModal] = useState(null);
  
  const [showForm, setShowForm] = useState(false);
  const [editingCompanyId, setEditingCompanyId] = useState(null);
  const [formData, setFormData] = useState({
    companyName: '',
    package: '',
    eligibilityCgpa: '',
    allowedBranches: '',
    driveStartDate: '',
    driveDeadline: '',
    description: ''
  });
  const [adding, setAdding] = useState(false);

  // Search, Filter, and Sorting States
  const [search, setSearch] = useState('');
  const [minPackage, setMinPackage] = useState('');
  const [maxPackage, setMaxPackage] = useState('');
  const [minApplicants, setMinApplicants] = useState('');
  const [minSelected, setMinSelected] = useState('');
  const [sortField, setSortField] = useState(''); // 'package' | 'applicants'
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc' | 'desc'

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const filteredCompanies = companies
    .filter(company => {
      const companyNameMatch = company.companyName?.toLowerCase().includes(search.toLowerCase());
      
      const pkg = company.package != null ? Number(company.package) : 0;
      const minPkgMatch = !minPackage || pkg >= Number(minPackage);
      const maxPkgMatch = !maxPackage || pkg <= Number(maxPackage);
      
      const applicantsCount = company.totalApplicants || 0;
      const minApplicantsMatch = !minApplicants || applicantsCount >= Number(minApplicants);
      
      const selectedCount = company.totalSelected || 0;
      const minSelectedMatch = !minSelected || selectedCount >= Number(minSelected);

      return companyNameMatch && minPkgMatch && maxPkgMatch && minApplicantsMatch && minSelectedMatch;
    })
    .sort((a, b) => {
      if (!sortField) return 0;
      
      let valA = 0;
      let valB = 0;
      
      if (sortField === 'package') {
        valA = a.package != null ? Number(a.package) : 0;
        valB = b.package != null ? Number(b.package) : 0;
      } else if (sortField === 'applicants') {
        valA = a.totalApplicants || 0;
        valB = b.totalApplicants || 0;
      }
      
      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

  const handleResetFilters = () => {
    setSearch('');
    setMinPackage('');
    setMaxPackage('');
    setMinApplicants('');
    setMinSelected('');
    setSortField('');
    setSortOrder('desc');
  };

  const fetchCompanies = async () => {
    try {
      const { data } = await api.get('/company/all');
      setCompanies(data.companies || data || []);
    } catch (error) {
      toast.error('Failed to load companies');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this company?')) return;
    
    try {
      await api.delete(`/company/${id}`);
      toast.success('Company deleted successfully');
      setCompanies(companies.filter(c => c._id !== id));
    } catch (error) {
      toast.error('Failed to delete company');
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleToggleForm = () => {
    if (showForm) {
      setShowForm(false);
      setEditingCompanyId(null);
      setFormData({
        companyName: '', package: '', eligibilityCgpa: '', allowedBranches: '', driveStartDate: '', driveDeadline: '', description: ''
      });
    } else {
      setShowForm(true);
    }
  };

  const handleEdit = (company) => {
    let startDateStr = '';
    if (company.driveStartDate) {
      startDateStr = new Date(company.driveStartDate).toISOString().split('T')[0];
    }
    let deadlineStr = '';
    if (company.driveDeadline) {
      deadlineStr = new Date(company.driveDeadline).toISOString().split('T')[0];
    }

    setFormData({
      companyName: company.companyName || '',
      package: company.package || '',
      eligibilityCgpa: company.eligibilityCgpa || '',
      allowedBranches: company.allowedBranches ? company.allowedBranches.join(', ') : '',
      driveStartDate: startDateStr,
      driveDeadline: deadlineStr,
      description: company.description || ''
    });
    setEditingCompanyId(company._id);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAdding(true);
    
    const branches = formData.allowedBranches.split(',').map(b => b.trim()).filter(b => b);

    const payload = {
      ...formData,
      package: Number(formData.package),
      eligibilityCgpa: Number(formData.eligibilityCgpa),
      allowedBranches: branches.length > 0 ? branches : ['CSE', 'ECE', 'MECH', 'CIVIL', 'IT']
    };

    try {
      if (editingCompanyId) {
        await api.put(`/company/${editingCompanyId}`, payload);
        toast.success('Company updated successfully');
      } else {
        await api.post('/company/add', payload);
        toast.success('Company added successfully');
      }
      setShowForm(false);
      setEditingCompanyId(null);
      fetchCompanies();
      setFormData({
        companyName: '', package: '', eligibilityCgpa: '', allowedBranches: '', driveStartDate: '', driveDeadline: '', description: ''
      });
    } catch (error) {
      toast.error(error.response?.data?.message || `Failed to ${editingCompanyId ? 'update' : 'add'} company`);
    } finally {
      setAdding(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Manage Companies</h1>
          <p className="mt-1 text-sm text-gray-500">
            Add new placement drives and manage existing ones.
          </p>
        </div>
        <button
          onClick={handleToggleForm}
          className="inline-flex items-center justify-center rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 cursor-pointer"
        >
          {showForm ? 'Cancel' : <><Plus className="mr-2 h-4 w-4" /> Add Company</>}
        </button>
      </div>

      {showForm && (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {editingCompanyId ? 'Edit Placement Drive' : 'Add New Placement Drive'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Company Name</label>
                <input required type="text" name="companyName" value={formData.companyName} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-3 py-2 border" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Package (LPA)</label>
                <input required type="number" step="0.1" name="package" value={formData.package} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-3 py-2 border" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Eligibility CGPA</label>
                <input required type="number" step="0.1" name="eligibilityCgpa" value={formData.eligibilityCgpa} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-3 py-2 border" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Drive Start Date</label>
                <input required type="date" name="driveStartDate" value={formData.driveStartDate} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-3 py-2 border" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Application Deadline</label>
                <input required type="date" name="driveDeadline" value={formData.driveDeadline} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-3 py-2 border" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Allowed Branches (comma separated)</label>
                <input type="text" name="allowedBranches" value={formData.allowedBranches} onChange={handleInputChange} placeholder="e.g. CSE, ECE, IT" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-3 py-2 border" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Description / JD</label>
                <textarea rows="3" name="description" value={formData.description} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-3 py-2 border"></textarea>
              </div>
            </div>
            <div className="flex justify-end">
              <button type="submit" disabled={adding} className="inline-flex justify-center rounded-md border border-transparent bg-primary-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-70 cursor-pointer">
                {adding ? 'Saving...' : editingCompanyId ? 'Update Company' : 'Save Company'}
              </button>
            </div>
          </form>
        </div>
      )}

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
              placeholder="Search by company name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 text-sm focus:outline-none transition-colors border-solid"
            />
          </div>
          
          {/* Stats & Reset */}
          <div className="flex w-full md:w-auto items-center justify-between md:justify-end gap-4">
            <span className="text-sm font-medium text-gray-500">
              Found <span className="text-gray-900 font-semibold">{filteredCompanies.length}</span> {filteredCompanies.length === 1 ? 'company' : 'companies'}
            </span>
            {(search || minPackage || maxPackage || minApplicants || minSelected || sortField) && (
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
          {/* Min Package */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Min Package (LPA)</label>
            <input
              type="number"
              step="0.5"
              min="0"
              placeholder="e.g. 5.0"
              value={minPackage}
              onChange={(e) => setMinPackage(e.target.value)}
              className="w-full rounded-lg border border-gray-300 py-1.5 px-3 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 focus:outline-none transition-colors border-solid"
            />
          </div>

          {/* Max Package */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Max Package (LPA)</label>
            <input
              type="number"
              step="0.5"
              min="0"
              placeholder="e.g. 20.0"
              value={maxPackage}
              onChange={(e) => setMaxPackage(e.target.value)}
              className="w-full rounded-lg border border-gray-300 py-1.5 px-3 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 focus:outline-none transition-colors border-solid"
            />
          </div>

          {/* Min Applicants */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Min Applicants</label>
            <input
              type="number"
              min="0"
              placeholder="e.g. 5"
              value={minApplicants}
              onChange={(e) => setMinApplicants(e.target.value)}
              className="w-full rounded-lg border border-gray-300 py-1.5 px-3 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 focus:outline-none transition-colors border-solid"
            />
          </div>

          {/* Min Selected */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Min Selected Count</label>
            <input
              type="number"
              min="0"
              placeholder="e.g. 2"
              value={minSelected}
              onChange={(e) => setMinSelected(e.target.value)}
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
                <th scope="col" className="px-6 py-4 font-semibold text-gray-900">Company Name</th>
                <th 
                  scope="col" 
                  onClick={() => handleSort('package')}
                  className="px-6 py-4 font-semibold text-gray-900 cursor-pointer select-none hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center">
                    Package
                    {sortField === 'package' ? (
                      sortOrder === 'asc' ? <ArrowUp className="ml-1 h-4 w-4 text-primary-600" /> : <ArrowDown className="ml-1 h-4 w-4 text-primary-600" />
                    ) : (
                      <ArrowUpDown className="ml-1 h-4 w-4 text-gray-400" />
                    )}
                  </div>
                </th>
                <th 
                  scope="col" 
                  onClick={() => handleSort('applicants')}
                  className="px-6 py-4 font-semibold text-gray-900 text-center cursor-pointer select-none hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center justify-center">
                    Total Applicants
                    {sortField === 'applicants' ? (
                      sortOrder === 'asc' ? <ArrowUp className="ml-1 h-4 w-4 text-primary-600" /> : <ArrowDown className="ml-1 h-4 w-4 text-primary-600" />
                    ) : (
                      <ArrowUpDown className="ml-1 h-4 w-4 text-gray-400" />
                    )}
                  </div>
                </th>
                <th scope="col" className="px-6 py-4 font-semibold text-gray-900 text-center">Selected</th>
                <th scope="col" className="px-6 py-4 font-semibold text-gray-900 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {filteredCompanies.map((company) => (
                <tr key={company._id} className="hover:bg-gray-50 transition-colors">
                  <td 
                    className="px-6 py-4 font-semibold text-primary-600 hover:text-primary-800 cursor-pointer hover:underline"
                    onClick={() => setSelectedCompanyForModal(company)}
                    title="Click to view detailed stats"
                  >
                    {company.companyName}
                  </td>
                  <td className="px-6 py-4 text-gray-500">{company.package} LPA</td>
                  <td className="px-6 py-4 text-center">
                    <span 
                      onClick={() => setSelectedCompanyForModal(company)}
                      className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 ring-1 ring-inset ring-blue-700/10 cursor-pointer hover:bg-blue-100 transition-colors"
                      title="Click to view stats details"
                    >
                      {company.totalApplicants || 0}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span 
                      onClick={() => setSelectedCompanyForModal(company)}
                      className="inline-flex items-center rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700 ring-1 ring-inset ring-green-700/10 cursor-pointer hover:bg-green-100 transition-colors"
                      title="Click to view stats details"
                    >
                      {company.totalSelected || 0}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-3">
                      <Link
                        to={`/admin/company/${company._id}/applicants`}
                        className="text-primary-600 hover:text-primary-900 flex items-center bg-primary-50 px-3 py-1 rounded-md animate-duration-150"
                        title="View Applicants"
                      >
                        <Users className="h-4 w-4 mr-1" /> Applicants
                      </Link>
                      <button
                        onClick={() => handleEdit(company)}
                        className="text-primary-600 hover:text-primary-900 bg-primary-50 p-2 rounded-md transition-colors cursor-pointer border-none"
                        title="Edit Company"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(company._id)}
                        className="text-red-600 hover:text-red-900 bg-red-50 p-2 rounded-md transition-colors cursor-pointer border-none"
                        title="Delete Company"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {companies.length > 0 && filteredCompanies.length === 0 && (
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
              {companies.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    No companies added yet. Click "Add Company" to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details & Statistics Modal */}
      {selectedCompanyForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 backdrop-blur-sm transition-opacity duration-300">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-4 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{selectedCompanyForModal.companyName} Details</h3>
                <p className="text-xs text-gray-500 mt-0.5">Placement Drive Overview & Stats</p>
              </div>
              <button 
                onClick={() => setSelectedCompanyForModal(null)}
                className="rounded-lg p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer border border-transparent hover:border-gray-200"
              >
                <span className="sr-only">Close</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              {/* Stats Cards Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-center">
                  <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Total Applied</p>
                  <p className="text-3xl font-extrabold text-blue-900 mt-1">{selectedCompanyForModal.totalApplicants || 0}</p>
                </div>
                <div className="bg-green-50 border border-green-100 rounded-xl p-4 text-center">
                  <p className="text-xs font-semibold text-green-600 uppercase tracking-wider">Selected</p>
                  <p className="text-3xl font-extrabold text-green-900 mt-1">{selectedCompanyForModal.totalSelected || 0}</p>
                </div>
                <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-4 text-center">
                  <p className="text-xs font-semibold text-yellow-600 uppercase tracking-wider">In Progress</p>
                  <p className="text-3xl font-extrabold text-yellow-900 mt-1">
                    {(selectedCompanyForModal.totalApplied || 0) + 
                     (selectedCompanyForModal.totalRound1 || 0) + 
                     (selectedCompanyForModal.totalRound2 || 0) + 
                     (selectedCompanyForModal.totalHR || 0)}
                  </p>
                </div>
                <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-center">
                  <p className="text-xs font-semibold text-red-600 uppercase tracking-wider">Rejected</p>
                  <p className="text-3xl font-extrabold text-red-900 mt-1">{selectedCompanyForModal.totalRejected || 0}</p>
                </div>
              </div>

              {/* Status Breakdown list */}
              <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
                <h4 className="text-sm font-bold text-gray-900 mb-3">Interview Round Breakdown</h4>
                <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                  <div className="flex justify-between py-1.5 border-b border-gray-100">
                    <span className="text-gray-500">Initial Applied:</span>
                    <span className="font-semibold text-gray-900">{selectedCompanyForModal.totalApplied || 0}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-gray-100">
                    <span className="text-gray-500">Round 1:</span>
                    <span className="font-semibold text-gray-900">{selectedCompanyForModal.totalRound1 || 0}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-gray-100">
                    <span className="text-gray-500">Round 2:</span>
                    <span className="font-semibold text-gray-900">{selectedCompanyForModal.totalRound2 || 0}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-gray-100">
                    <span className="text-gray-500">HR Round:</span>
                    <span className="font-semibold text-gray-900">{selectedCompanyForModal.totalHR || 0}</span>
                  </div>
                </div>
              </div>

              {/* Company Info Details */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2">Company Specifications</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500 block">Package (LPA)</span>
                    <span className="font-semibold text-gray-900">{selectedCompanyForModal.package} LPA</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Eligibility CGPA</span>
                    <span className="font-semibold text-gray-900">&ge; {selectedCompanyForModal.eligibilityCgpa}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Drive Start Date</span>
                    <span className="font-semibold text-gray-900">
                      {selectedCompanyForModal.driveStartDate ? new Date(selectedCompanyForModal.driveStartDate).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Application Deadline</span>
                    <span className="font-semibold text-gray-900">
                      {selectedCompanyForModal.driveDeadline ? new Date(selectedCompanyForModal.driveDeadline).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-gray-500 block">Allowed Branches</span>
                    <span className="font-semibold text-gray-900">{selectedCompanyForModal.allowedBranches?.join(', ') || 'All'}</span>
                  </div>
                  {selectedCompanyForModal.description && (
                    <div className="sm:col-span-2 bg-gray-50/50 rounded-xl p-4 border border-gray-100">
                      <span className="text-gray-500 block font-semibold mb-1">Job Description / Instructions</span>
                      <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{selectedCompanyForModal.description}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-100 px-6 py-4 bg-gray-50/50 flex justify-between items-center">
              <Link
                to={`/admin/company/${selectedCompanyForModal._id}/applicants`}
                className="inline-flex items-center justify-center rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 transition-colors cursor-pointer"
              >
                Manage Candidates &rarr;
              </Link>
              <button
                onClick={() => setSelectedCompanyForModal(null)}
                className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Companies;
