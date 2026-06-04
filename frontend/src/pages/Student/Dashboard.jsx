import { useEffect, useState } from 'react';
import { Building2, FileText, CheckCircle, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import Loader from '../../components/Loader';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalCompanies: 0,
    applied: 0,
    selected: 0,
    inProgress: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [companiesRes, appsRes] = await Promise.all([
          api.get('/company/all'),
          api.get('/application/my-applications'),
        ]);

        const companies = companiesRes.data.companies || companiesRes.data || [];
        const apps = appsRes.data.applications || appsRes.data || [];

        const now = new Date();
        const availableCompanies = companies.filter(c => !c.driveDeadline || new Date(c.driveDeadline) >= now);

        const selected = apps.filter(a => a.status === 'Selected').length;
        const inProgress = apps.filter(a => ['Applied', 'Round1', 'Round2', 'HR'].includes(a.status)).length;

        setStats({
          totalCompanies: availableCompanies.length,
          applied: apps.length,
          selected,
          inProgress,
        });
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <Loader />;

  const statCards = [
    { title: 'Available Drives', value: stats.totalCompanies, icon: Building2, color: 'bg-blue-50 text-blue-600', link: '/student/companies' },
    { title: 'Total Applied', value: stats.applied, icon: FileText, color: 'bg-indigo-50 text-indigo-600', link: '/student/applications' },
    { title: 'In Progress', value: stats.inProgress, icon: Clock, color: 'bg-yellow-50 text-yellow-600' },
    { title: 'Selected', value: stats.selected, icon: CheckCircle, color: 'bg-green-50 text-green-600' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Welcome back, {user?.name}! 👋</h1>
        <p className="mt-1 text-sm text-gray-500">
          Here is what's happening with your placement drives today.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={index}
              onClick={() => card.link && navigate(card.link)}
              className={`flex items-center overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:shadow-md ${card.link ? 'cursor-pointer hover:border-primary-300' : ''}`}
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

      <div className="mt-8 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">Quick Tips for Placements</h2>
        <ul className="mt-4 space-y-3 text-sm text-gray-600">
          <li className="flex items-start">
            <span className="mr-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-700">1</span>
            Ensure your resume is updated and uploaded in the Profile section.
          </li>
          <li className="flex items-start">
            <span className="mr-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-700">2</span>
            Check company eligibility criteria (CGPA and Branch) before applying.
          </li>
          <li className="flex items-start">
            <span className="mr-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-700">3</span>
            Regularly monitor the 'My Applications' tab for round status updates.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
