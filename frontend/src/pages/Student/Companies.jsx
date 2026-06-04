import { useEffect, useState } from 'react';
import { Calendar, DollarSign, GraduationCap, Briefcase, ChevronRight, Clock, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import Loader from '../../components/Loader';

const Companies = () => {
  const { user } = useAuth();
  const [companies, setCompanies] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(null);

  const fetchData = async () => {
    try {
      const [companiesRes, appsRes] = await Promise.all([
        api.get('/company/all'),
        api.get('/application/my-applications')
      ]);
      const allCompanies = companiesRes.data.companies || companiesRes.data || [];
      const now = new Date();
      const activeCompanies = allCompanies.filter(company => !company.driveDeadline || new Date(company.driveDeadline) >= now);
      
      setCompanies(activeCompanies);
      setApplications(appsRes.data.applications || appsRes.data || []);
    } catch (error) {
      toast.error('Failed to load companies');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const hasApplied = (companyId) => {
    return applications.some(app => app.companyId._id === companyId || app.companyId === companyId);
  };

  const getApplyButtonState = (company) => {
    const now = new Date();
    const applied = hasApplied(company._id);
    
    if (applied) {
      return { disabled: true, text: 'Already Applied' };
    }
    
    if (company.driveStartDate && now < new Date(company.driveStartDate)) {
      const startDateStr = new Date(company.driveStartDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
      return { disabled: true, text: `Starts ${startDateStr}` };
    }
    
    if (company.driveDeadline && now > new Date(company.driveDeadline)) {
      return { disabled: true, text: 'Deadline Passed' };
    }
    
    return { disabled: false, text: 'Apply Now' };
  };

  const handleApply = async (company) => {
    // Basic Eligibility Check on Frontend (Backend also does this, but good for UX)
    if (user.cgpa < company.eligibilityCgpa) {
      toast.error(`Your CGPA is lower than required (${company.eligibilityCgpa})`);
      return;
    }
    
    if (company.allowedBranches?.length > 0 && !company.allowedBranches.includes(user.branch)) {
      toast.error(`Your branch ${user.branch} is not eligible for this drive`);
      return;
    }

    const now = new Date();
    if (company.driveStartDate && now < new Date(company.driveStartDate)) {
      toast.error('Registration for this placement drive has not started yet');
      return;
    }

    if (company.driveDeadline && now > new Date(company.driveDeadline)) {
      toast.error('Application deadline for this placement drive has passed');
      return;
    }

    try {
      setApplying(company._id);
      const { data } = await api.post(`/application/apply/${company._id}`);
      toast.success(data.message || 'Applied successfully');
      fetchData(); // Refresh to update "Applied" status
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to apply');
    } finally {
      setApplying(null);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Available Companies</h1>
        <p className="mt-1 text-sm text-gray-500">
          Browse and apply to upcoming placement drives.
        </p>
      </div>

      {companies.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50">
          <Briefcase className="h-10 w-10 text-gray-400 mb-2" />
          <p className="text-gray-500 font-medium">No upcoming drives found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {companies.map((company) => {
            const applied = hasApplied(company._id);
            const btnState = getApplyButtonState(company);

            return (
              <div key={company._id} className="flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-lg">
                <div className="p-6 flex-1">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900">{company.companyName}</h3>
                    {applied && (
                      <span className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                        Applied
                      </span>
                    )}
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-sm text-gray-600">
                      <DollarSign className="mr-2 h-4 w-4 text-gray-400" />
                      <span className="font-medium text-gray-900">{company.package} LPA</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <GraduationCap className="mr-2 h-4 w-4 text-gray-400" />
                      Min CGPA: <span className="font-medium text-gray-900 ml-1">{company.eligibilityCgpa}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Briefcase className="mr-2 h-4 w-4 text-gray-400" />
                      Branches: <span className="font-medium text-gray-900 ml-1">{company.allowedBranches?.join(', ') || 'All'}</span>
                    </div>
                    {company.driveStartDate && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="mr-2 h-4 w-4 text-gray-400" />
                        Starts: <span className="font-medium text-gray-900 ml-1">
                          {new Date(company.driveStartDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                    )}
                    {company.driveDeadline && (
                      <div className="flex items-center text-sm text-gray-600">
                        <AlertCircle className="mr-2 h-4 w-4 text-gray-400" />
                        Deadline: <span className="font-medium text-gray-900 ml-1">
                          {new Date(company.driveDeadline).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                    )}
                  </div>

                  <p className="text-sm text-gray-500 line-clamp-3">
                    {company.description || 'No description provided.'}
                  </p>
                </div>
                
                <div className="border-t border-gray-100 bg-gray-50 p-4">
                  <button
                    onClick={() => handleApply(company)}
                    disabled={btnState.disabled || applying === company._id}
                    className={`w-full flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                      btnState.disabled 
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-primary-600 text-white hover:bg-primary-700 shadow-sm'
                    }`}
                  >
                    {applying === company._id ? 'Applying...' : btnState.text}
                    {!btnState.disabled && <ChevronRight className="ml-2 h-4 w-4" />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Companies;
