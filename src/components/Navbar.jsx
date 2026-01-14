import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { LogOut, Home, Briefcase, PlusCircle, FileText } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) return null;

  return (
    <nav className="glass sticky top-0 z-50 px-6 py-4 mb-8">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-indigo-400 bg-clip-text text-transparent">
          PropManage
        </Link>

        <div className="flex items-center gap-6">
          {user.role === 'agent' ? (
            <>
              <Link to="/agent" className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors">
                <Home size={18} /> Dashboard
              </Link>

            </>
          ) : (
            <>
              <Link to="/contractor" className="flex items-center gap-2 text-gray-600 hover:text-emerald-600 transition-colors">
                <Briefcase size={18} /> Jobs
              </Link>
              {/* Added My Jobs link for contractor if needed */}
            </>
          )}

          <div className="flex items-center gap-4 pl-4 border-l border-gray-200">
            <div className="text-sm text-right">
              <p className="font-medium text-gray-900">{user.name}</p>
              <p className="text-xs text-gray-500 capitalize">{user.role}</p>
            </div>
            <button 
              onClick={handleLogout}
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
