import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Building, User, Mail, Lock, Hash, BookOpen, GraduationCap } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    rollNumber: '',
    branch: '',
    cgpa: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    const dataToSubmit = { 
      ...formData,
      cgpa: Number(formData.cgpa)
    };

    const success = await register(dataToSubmit);
    setIsLoading(false);
    if (success) {
      navigate('/login');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-8 shadow-xl border border-gray-100">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary-100">
            <Building className="h-8 w-8 text-primary-600" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 tracking-tight">
            Create an Account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Join the smart placement tracker
          </p>
        </div>
        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <User className="h-4 w-4 text-gray-400" />
              </div>
              <input name="name" type="text" required className="block w-full rounded-lg border border-gray-300 pl-10 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 sm:text-sm" placeholder="Full Name" value={formData.name} onChange={handleChange} />
            </div>
            
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Hash className="h-4 w-4 text-gray-400" />
              </div>
              <input name="rollNumber" type="text" required className="block w-full rounded-lg border border-gray-300 pl-10 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 sm:text-sm" placeholder="Roll No." value={formData.rollNumber} onChange={handleChange} />
            </div>
          </div>

          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Mail className="h-4 w-4 text-gray-400" />
            </div>
            <input name="email" type="email" required className="block w-full rounded-lg border border-gray-300 pl-10 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 sm:text-sm" placeholder="Email Address" value={formData.email} onChange={handleChange} />
          </div>

          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Lock className="h-4 w-4 text-gray-400" />
            </div>
            <input name="password" type="password" required className="block w-full rounded-lg border border-gray-300 pl-10 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 sm:text-sm" placeholder="Password" value={formData.password} onChange={handleChange} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <BookOpen className="h-4 w-4 text-gray-400" />
              </div>
              <input name="branch" type="text" required className="block w-full rounded-lg border border-gray-300 pl-10 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 sm:text-sm" placeholder="Branch (e.g. CSE)" value={formData.branch} onChange={handleChange} />
            </div>
            
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <GraduationCap className="h-4 w-4 text-gray-400" />
              </div>
              <input name="cgpa" type="number" step="0.01" min="0" max="10" required className="block w-full rounded-lg border border-gray-300 pl-10 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 sm:text-sm" placeholder="CGPA" value={formData.cgpa} onChange={handleChange} />
            </div>
          </div>


          <div>
            <button type="submit" disabled={isLoading} className="mt-4 group relative flex w-full justify-center rounded-lg border border-transparent bg-primary-600 py-2.5 px-4 text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-70 transition-all">
              {isLoading ? 'Creating account...' : 'Create Account'}
            </button>
          </div>
          
          <div className="text-center text-sm mt-4">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
