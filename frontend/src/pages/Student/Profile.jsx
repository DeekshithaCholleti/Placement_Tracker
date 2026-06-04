import { useState, useEffect } from 'react';
import { User, Mail, GraduationCap, BookOpen, Hash, UploadCloud, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

const Profile = () => {
  const { user, setUser } = useAuth();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: '',
    rollNumber: '',
    branch: '',
    cgpa: ''
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setEditData({
        name: user.name || '',
        rollNumber: user.rollNumber || '',
        branch: user.branch || '',
        cgpa: user.cgpa || ''
      });
    }
  }, [user]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a file first');
      return;
    }

    const formData = new FormData();
    formData.append('resume', file);

    try {
      setUploading(true);
      const { data } = await api.put('/auth/upload-resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Resume uploaded successfully');
      setUser({ ...user, resume: data.resume });
      setFile(null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to upload resume');
    } finally {
      setUploading(false);
    }
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (user) {
      setEditData({
        name: user.name || '',
        rollNumber: user.rollNumber || '',
        branch: user.branch || '',
        cgpa: user.cgpa || ''
      });
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = {
        ...editData,
        cgpa: editData.cgpa ? Number(editData.cgpa) : undefined
      };

      const { data } = await api.put('/auth/profile/update', payload);
      toast.success(data.message || 'Profile updated successfully');
      setUser(data.user);
      setIsEditing(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">My Profile</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your personal details and resume.
          </p>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="inline-flex items-center justify-center rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors cursor-pointer"
          >
            Edit Profile
          </button>
        )}
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
          <h3 className="text-lg font-medium text-gray-900">Personal Information</h3>
        </div>
        <div className="p-6">
          {isEditing ? (
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Full Name</label>
                  <input
                    required
                    type="text"
                    name="name"
                    value={editData.name}
                    onChange={handleEditChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-3 py-2 border"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email Address (Cannot change)</label>
                  <input
                    disabled
                    type="email"
                    value={user?.email || ''}
                    className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm sm:text-sm px-3 py-2 border cursor-not-allowed text-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Roll Number</label>
                  <input
                    type="text"
                    name="rollNumber"
                    value={editData.rollNumber}
                    onChange={handleEditChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-3 py-2 border"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Branch</label>
                  <input
                    type="text"
                    name="branch"
                    value={editData.branch}
                    onChange={handleEditChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-3 py-2 border"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">CGPA</label>
                  <input
                    type="number"
                    step="0.01"
                    name="cgpa"
                    value={editData.cgpa}
                    onChange={handleEditChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-3 py-2 border"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex justify-center rounded-md border border-transparent bg-primary-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none disabled:opacity-70 cursor-pointer"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-50">
                  <User className="h-5 w-5 text-primary-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Full Name</p>
                  <p className="font-semibold text-gray-900">{user?.name}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-50">
                  <Mail className="h-5 w-5 text-primary-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Email Address</p>
                  <p className="font-semibold text-gray-900">{user?.email}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-50">
                  <Hash className="h-5 w-5 text-primary-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Roll Number</p>
                  <p className="font-semibold text-gray-900">{user?.rollNumber || 'N/A'}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-50">
                  <BookOpen className="h-5 w-5 text-primary-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Branch</p>
                  <p className="font-semibold text-gray-900">{user?.branch || 'N/A'}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-50">
                  <GraduationCap className="h-5 w-5 text-primary-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">CGPA</p>
                  <p className="font-semibold text-gray-900">{user?.cgpa || 'N/A'}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm mt-6">
        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
          <h3 className="text-lg font-medium text-gray-900">Resume Upload</h3>
        </div>
        <div className="p-6">
          {user?.resume && (
            <div className="mb-6 flex items-center justify-between rounded-lg border border-green-200 bg-green-50 p-4">
              <div className="flex items-center">
                <FileText className="mr-3 h-6 w-6 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-green-900">Current Resume Uploaded</p>
                  <a href={user.resume} target="_blank" rel="noreferrer" className="text-xs text-green-700 hover:underline">
                    View Resume
                  </a>
                </div>
              </div>
              <CheckCircleIcon className="h-5 w-5 text-green-600" />
            </div>
          )}

          <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-8 hover:bg-gray-50 transition-colors">
            <UploadCloud className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-sm text-gray-600 text-center mb-4">
              Upload your updated resume (PDF). Maximum size 5MB.
            </p>
            <div className="flex items-center space-x-4">
              <label className="cursor-pointer bg-white px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus-within:ring-2 focus-within:ring-primary-500">
                <span>Select File</span>
                <input type="file" className="sr-only" accept=".pdf" onChange={handleFileChange} />
              </label>
              {file && <span className="text-sm text-gray-500 truncate max-w-[150px]">{file.name}</span>}
              <button
                onClick={handleUpload}
                disabled={!file || uploading}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-70"
              >
                {uploading ? 'Uploading...' : 'Upload'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper component for check circle since lucide doesn't export CheckCircle directly? Oh wait, it does. Let me just use a quick SVG here to be safe if CheckCircle wasn't imported.
const CheckCircleIcon = (props) => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

export default Profile;
