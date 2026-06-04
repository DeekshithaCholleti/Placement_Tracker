import { useEffect, useState } from 'react';
import { 
  Percent, 
  Award, 
  TrendingUp, 
  Briefcase, 
  Search, 
  RotateCcw, 
  ArrowUp, 
  ArrowDown, 
  Building2 
} from 'lucide-react';
import api from '../../api/axios';
import Loader from '../../components/Loader';
import toast from 'react-hot-toast';

const Analytics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Company Details Table State
  const [companySearch, setCompanySearch] = useState('');
  const [companySortField, setCompanySortField] = useState('companyName'); // 'companyName' | 'appliedCount' | 'selectedCount' | 'ratio'
  const [companySortOrder, setCompanySortOrder] = useState('asc'); // 'asc' | 'desc'
  const [companyCurrentPage, setCompanyCurrentPage] = useState(1);

  // Department Table Sort State
  const [deptSortField, setDeptSortField] = useState('branch');
  const [deptSortOrder, setDeptSortOrder] = useState('asc');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/admin/dashboard-stats');
        setStats(data);
      } catch (error) {
        toast.error('Failed to load placement analytics stats');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <Loader />;

  // 1. Process Department Stats (with sorting)
  const sortedDepartmentStats = [...(stats?.departmentStats || [])].sort((a, b) => {
    let valA = a[deptSortField];
    let valB = b[deptSortField];

    if (typeof valA === 'string') {
      valA = valA.toLowerCase();
      valB = valB.toLowerCase();
    }

    if (valA < valB) return deptSortOrder === 'asc' ? -1 : 1;
    if (valA > valB) return deptSortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const handleDeptSort = (field) => {
    if (deptSortField === field) {
      setDeptSortOrder(deptSortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setDeptSortField(field);
      setDeptSortOrder('asc');
    }
  };

  // 2. Process Company Stats (with search, sorting, and pagination)
  const processedCompanyStats = (stats?.companyStats || []).map(company => {
    const ratio = company.appliedCount > 0 
      ? Number(((company.selectedCount / company.appliedCount) * 100).toFixed(1))
      : 0;
    return {
      ...company,
      ratio
    };
  });

  const filteredCompanyStats = processedCompanyStats.filter(c => 
    c.companyName.toLowerCase().includes(companySearch.toLowerCase())
  );

  const sortedCompanyStats = [...filteredCompanyStats].sort((a, b) => {
    let valA = a[companySortField];
    let valB = b[companySortField];

    if (typeof valA === 'string') {
      valA = valA.toLowerCase();
      valB = valB.toLowerCase();
    }

    if (valA < valB) return companySortOrder === 'asc' ? -1 : 1;
    if (valA > valB) return companySortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const companyPageSize = 10;
  const totalCompanyPages = Math.ceil(sortedCompanyStats.length / companyPageSize);
  const paginatedCompanyStats = sortedCompanyStats.slice(
    (companyCurrentPage - 1) * companyPageSize,
    companyCurrentPage * companyPageSize
  );

  const handleCompanySort = (field) => {
    if (companySortField === field) {
      setCompanySortOrder(companySortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setCompanySortField(field);
      setCompanySortOrder('asc');
    }
    setCompanyCurrentPage(1);
  };

  const handleCompanySearchChange = (e) => {
    setCompanySearch(e.target.value);
    setCompanyCurrentPage(1);
  };

  const performanceCards = [
    { title: 'Placement Rate', value: `${stats?.placementPercentage || 0}%`, icon: Percent, color: 'bg-emerald-50 text-emerald-600' },
    { title: 'Highest Package', value: `${stats?.highestPackage || 0} LPA`, icon: Award, color: 'bg-amber-50 text-amber-600' },
    { title: 'Average Package', value: `${stats?.averagePackage || 0} LPA`, icon: TrendingUp, color: 'bg-blue-50 text-blue-600' },
    { title: 'Lowest Package', value: `${stats?.lowestPackage || 0} LPA`, icon: Briefcase, color: 'bg-rose-50 text-rose-600' },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Placement Analytics</h1>
        <p className="mt-1 text-sm text-gray-505 text-gray-500">
          Detailed metrics, charts, department insights, and selection ratios per company drive.
        </p>
      </div>

      {/* Performance Metric Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {performanceCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={index}
              className="flex items-center overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 shadow-sm hover:shadow-md transition-all"
            >
              <div className={`mr-5 flex h-14 w-14 items-center justify-center rounded-full ${card.color}`}>
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <p className="truncate text-sm font-medium text-gray-505 text-gray-500">{card.title}</p>
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Department-wise Placement Data Table */}
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2">
          <h3 className="text-lg font-bold text-gray-900 tracking-tight">Department-wise Placement Data</h3>
          <span className="text-xs text-gray-500">Click headers to sort departments</span>
        </div>
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  scope="col" 
                  onClick={() => handleDeptSort('branch')}
                  className="px-6 py-4 font-semibold text-gray-900 cursor-pointer select-none hover:bg-gray-105 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center">
                    Department Name
                    {deptSortField === 'branch' && (
                      deptSortOrder === 'asc' ? <ArrowUp className="ml-1 h-4 w-4 text-primary-600" /> : <ArrowDown className="ml-1 h-4 w-4 text-primary-600" />
                    )}
                  </div>
                </th>
                <th 
                  scope="col" 
                  onClick={() => handleDeptSort('totalStudents')}
                  className="px-6 py-4 font-semibold text-gray-900 text-center cursor-pointer select-none hover:bg-gray-105 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center justify-center">
                    Total Students
                    {deptSortField === 'totalStudents' && (
                      deptSortOrder === 'asc' ? <ArrowUp className="ml-1 h-4 w-4 text-primary-600" /> : <ArrowDown className="ml-1 h-4 w-4 text-primary-600" />
                    )}
                  </div>
                </th>
                <th 
                  scope="col" 
                  onClick={() => handleDeptSort('placedStudents')}
                  className="px-6 py-4 font-semibold text-gray-900 text-center cursor-pointer select-none hover:bg-gray-105 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center justify-center">
                    Selected Students
                    {deptSortField === 'placedStudents' && (
                      deptSortOrder === 'asc' ? <ArrowUp className="ml-1 h-4 w-4 text-primary-600" /> : <ArrowDown className="ml-1 h-4 w-4 text-primary-600" />
                    )}
                  </div>
                </th>
                <th 
                  scope="col" 
                  onClick={() => handleDeptSort('placementPercentage')}
                  className="px-6 py-4 font-semibold text-gray-900 cursor-pointer select-none hover:bg-gray-105 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center">
                    Placement Percentage
                    {deptSortField === 'placementPercentage' && (
                      deptSortOrder === 'asc' ? <ArrowUp className="ml-1 h-4 w-4 text-primary-600" /> : <ArrowDown className="ml-1 h-4 w-4 text-primary-600" />
                    )}
                  </div>
                </th>
                <th 
                  scope="col" 
                  onClick={() => handleDeptSort('highestPackage')}
                  className="px-6 py-4 font-semibold text-gray-900 text-center cursor-pointer select-none hover:bg-gray-105 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center justify-center">
                    Highest Package
                    {deptSortField === 'highestPackage' && (
                      deptSortOrder === 'asc' ? <ArrowUp className="ml-1 h-4 w-4 text-primary-600" /> : <ArrowDown className="ml-1 h-4 w-4 text-primary-600" />
                    )}
                  </div>
                </th>
                <th 
                  scope="col" 
                  onClick={() => handleDeptSort('lowestPackage')}
                  className="px-6 py-4 font-semibold text-gray-900 text-center cursor-pointer select-none hover:bg-gray-105 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center justify-center">
                    Lowest Package
                    {deptSortField === 'lowestPackage' && (
                      deptSortOrder === 'asc' ? <ArrowUp className="ml-1 h-4 w-4 text-primary-600" /> : <ArrowDown className="ml-1 h-4 w-4 text-primary-600" />
                    )}
                  </div>
                </th>
                <th 
                  scope="col" 
                  onClick={() => handleDeptSort('averagePackage')}
                  className="px-6 py-4 font-semibold text-gray-900 text-center cursor-pointer select-none hover:bg-gray-105 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center justify-center">
                    Average Package
                    {deptSortField === 'averagePackage' && (
                      deptSortOrder === 'asc' ? <ArrowUp className="ml-1 h-4 w-4 text-primary-600" /> : <ArrowDown className="ml-1 h-4 w-4 text-primary-600" />
                    )}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {sortedDepartmentStats.length > 0 ? (
                sortedDepartmentStats.map((dept, index) => (
                  <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-gray-900">{dept.branch}</td>
                    <td className="px-6 py-4 text-center text-gray-700 font-medium">{dept.totalStudents}</td>
                    <td className="px-6 py-4 text-center text-gray-700 font-semibold text-emerald-700">{dept.placedStudents}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-full bg-gray-100 rounded-full h-2.5 max-w-[100px]">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2.5 rounded-full transition-all duration-500" 
                            style={{ width: `${dept.placementPercentage}%` }}
                          ></div>
                        </div>
                        <span className="font-bold text-gray-800 text-sm">{dept.placementPercentage}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center font-bold text-amber-700">{dept.highestPackage ? `${dept.highestPackage} LPA` : '0 LPA'}</td>
                    <td className="px-6 py-4 text-center font-bold text-rose-700">{dept.lowestPackage ? `${dept.lowestPackage} LPA` : '0 LPA'}</td>
                    <td className="px-6 py-4 text-center font-bold text-blue-700">{dept.averagePackage ? `${dept.averagePackage} LPA` : '0 LPA'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-gray-500 italic">No department data available.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Applications vs. Selections Company Details Table */}
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-gray-900 tracking-tight">Applications vs. Selections Company Details</h3>
            <p className="text-xs text-gray-500 mt-0.5">Comprehensive grid showing selection rates and ratios per drive</p>
          </div>

          <div className="flex flex-col sm:flex-row w-full md:w-auto items-stretch sm:items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-64">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                <Search className="h-4 w-4" />
              </span>
              <input
                type="text"
                placeholder="Search by company name..."
                value={companySearch}
                onChange={handleCompanySearchChange}
                className="pl-9 pr-3 py-1.5 w-full rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 text-sm focus:outline-none transition-colors bg-white border-solid"
              />
            </div>
            
            {/* Reset Filters */}
            {(companySearch || companySortField !== 'companyName' || companySortOrder !== 'asc') && (
              <button
                onClick={() => {
                  setCompanySearch('');
                  setCompanySortField('companyName');
                  setCompanySortOrder('asc');
                  setCompanyCurrentPage(1);
                }}
                className="inline-flex items-center justify-center text-sm font-semibold text-red-600 hover:text-red-800 transition-colors border-none bg-transparent cursor-pointer"
              >
                <RotateCcw className="mr-1.5 h-4 w-4" /> Reset
              </button>
            )}
          </div>
        </div>

        {/* Table container */}
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  scope="col" 
                  onClick={() => handleCompanySort('companyName')}
                  className="px-6 py-4 font-semibold text-gray-900 cursor-pointer select-none hover:bg-gray-105 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center">
                    Company Name
                    {companySortField === 'companyName' && (
                      companySortOrder === 'asc' ? <ArrowUp className="ml-1 h-4 w-4 text-primary-600" /> : <ArrowDown className="ml-1 h-4 w-4 text-primary-600" />
                    )}
                  </div>
                </th>
                <th 
                  scope="col" 
                  onClick={() => handleCompanySort('appliedCount')}
                  className="px-6 py-4 font-semibold text-gray-900 text-center cursor-pointer select-none hover:bg-gray-105 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center justify-center">
                    Applied Count
                    {companySortField === 'appliedCount' && (
                      companySortOrder === 'asc' ? <ArrowUp className="ml-1 h-4 w-4 text-primary-600" /> : <ArrowDown className="ml-1 h-4 w-4 text-primary-600" />
                    )}
                  </div>
                </th>
                <th 
                  scope="col" 
                  onClick={() => handleCompanySort('selectedCount')}
                  className="px-6 py-4 font-semibold text-gray-900 text-center cursor-pointer select-none hover:bg-gray-105 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center justify-center">
                    Selected Count
                    {companySortField === 'selectedCount' && (
                      companySortOrder === 'asc' ? <ArrowUp className="ml-1 h-4 w-4 text-primary-600" /> : <ArrowDown className="ml-1 h-4 w-4 text-primary-600" />
                    )}
                  </div>
                </th>
                <th 
                  scope="col" 
                  onClick={() => handleCompanySort('ratio')}
                  className="px-6 py-4 font-semibold text-gray-900 cursor-pointer select-none hover:bg-gray-105 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center">
                    Selection Ratio
                    {companySortField === 'ratio' && (
                      companySortOrder === 'asc' ? <ArrowUp className="ml-1 h-4 w-4 text-primary-600" /> : <ArrowDown className="ml-1 h-4 w-4 text-primary-600" />
                    )}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {paginatedCompanyStats.length > 0 ? (
                paginatedCompanyStats.map((company, index) => (
                  <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900 flex items-center">
                        <Building2 className="h-4 w-4 mr-2.5 text-gray-400" />
                        {company.companyName}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center text-gray-700 font-medium">{company.appliedCount}</td>
                    <td className="px-6 py-4 text-center text-gray-700 font-semibold text-emerald-700">{company.selectedCount}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-full bg-gray-100 rounded-full h-2.5 max-w-[150px]">
                          <div 
                            className="bg-gradient-to-r from-emerald-500 to-teal-600 h-2.5 rounded-full transition-all duration-500" 
                            style={{ width: `${company.ratio}%` }}
                          ></div>
                        </div>
                        <span className="font-bold text-gray-800 text-sm">{company.ratio}%</span>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-gray-500 italic">No company analytics data found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table pagination */}
        {totalCompanyPages > 1 && (
          <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50 px-6 py-4 mt-4 rounded-xl">
            <div className="text-xs text-gray-500 font-medium">
              Showing {(companyCurrentPage - 1) * companyPageSize + 1} to {Math.min(companyCurrentPage * companyPageSize, sortedCompanyStats.length)} of {sortedCompanyStats.length} companies
            </div>
            <div className="flex items-center space-x-2">
              <button
                disabled={companyCurrentPage === 1}
                onClick={() => setCompanyCurrentPage(prev => Math.max(prev - 1, 1))}
                className="px-3 py-1.5 text-xs font-semibold rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors cursor-pointer border-solid"
              >
                Previous
              </button>
              <span className="text-sm text-gray-600 font-medium">
                Page {companyCurrentPage} of {totalCompanyPages}
              </span>
              <button
                disabled={companyCurrentPage === totalCompanyPages}
                onClick={() => setCompanyCurrentPage(prev => Math.min(prev + 1, totalCompanyPages))}
                className="px-3 py-1.5 text-xs font-semibold rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors cursor-pointer border-solid"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;
