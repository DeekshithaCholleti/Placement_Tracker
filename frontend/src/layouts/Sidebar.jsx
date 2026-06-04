import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Building2, 
  FileText, 
  UserCircle,
  Briefcase,
  LineChart
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { user } = useAuth();
  const location = useLocation();

  const studentLinks = [
    { name: 'Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
    { name: 'Companies', path: '/student/companies', icon: Building2 },
    { name: 'My Applications', path: '/student/applications', icon: FileText },
    { name: 'Profile', path: '/student/profile', icon: UserCircle },
  ];

  const adminLinks = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Manage Companies', path: '/admin/companies', icon: Briefcase },
    { name: 'Placement Analytics', path: '/admin/analytics', icon: LineChart },
  ];

  const links = user?.role === 'admin' ? adminLinks : studentLinks;

  return (
    <aside className="hidden w-64 flex-col border-r border-gray-200 bg-white md:flex">
      <div className="flex h-16 items-center justify-center border-b border-gray-200 px-6">
        <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-indigo-600 bg-clip-text text-transparent">
          Placement Tracker
        </h1>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {links.map((link) => {
          const isActive = location.pathname === link.path || location.pathname.startsWith(`${link.path}/`);
          const Icon = link.icon;
          
          return (
            <Link
              key={link.name}
              to={link.path}
              className={`flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <Icon 
                className={`mr-3 h-5 w-5 flex-shrink-0 ${
                  isActive ? 'text-primary-700' : 'text-gray-400 group-hover:text-gray-500'
                }`} 
              />
              {link.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
