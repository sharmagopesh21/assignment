import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { UserCircle, Hammer, ArrowLeft, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const { login, register, logout } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    logout();
  }, []);
  
  const [step, setStep] = useState('role'); // 'role' | 'auth'
  const [selectedRole, setSelectedRole] = useState(null);
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: ''
  });

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setStep('auth');
    setError('');
    setFormData({ name: '', email: '', password: '', phone: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      const result = await login(formData.email, formData.password, selectedRole);
      if (result.success) {
        navigate(selectedRole === 'agent' ? '/agent' : '/contractor');
      } else {
        setError(result.message);
      }
    } else {
        if (!formData.name) {
            setError('Name is required');
            return;
        }
      const result = await register({ ...formData, role: selectedRole });
      if (result.success) {
        alert("Account successfully created! Please sign in.");
        setIsLogin(true); // Switch to Login mode
        setFormData({ name: '', email: '', password: '', phone: '' }); // Clear form
      } else {
        setError(result.message);
      }
    }
  };

  if (step === 'role') {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="glass-card max-w-md w-full text-center animate-in fade-in zoom-in-95 duration-300">
          <h1 className="text-3xl font-bold mb-2 text-gray-900">Welcome</h1>
          <p className="text-gray-500 mb-8">Select your role to continue</p>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => handleRoleSelect('agent')}
              className="flex flex-col items-center p-6 border-2 border-transparent hover:border-indigo-100 hover:bg-indigo-50 rounded-xl transition-all group"
            >
              <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <UserCircle size={32} />
              </div>
              <span className="font-semibold text-gray-900">Agent</span>
              <span className="text-xs text-gray-500 mt-1">Manage Properties</span>
            </button>

            <button
              onClick={() => handleRoleSelect('contractor')}
              className="flex flex-col items-center p-6 border-2 border-transparent hover:border-emerald-100 hover:bg-emerald-50 rounded-xl transition-all group"
            >
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Hammer size={32} />
              </div>
              <span className="font-semibold text-gray-900">Contractor</span>
              <span className="text-xs text-gray-500 mt-1">Find & Do Work</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="glass-card max-w-md w-full animate-in slide-in-from-right-8 duration-300">
        <button 
          onClick={() => setStep('role')} 
          className="flex items-center text-gray-400 hover:text-gray-600 mb-6 transition-colors"
        >
          <ArrowLeft size={16} className="mr-1" /> Back to Role Selection
        </button>

        <h2 className="text-2xl font-bold text-gray-900 mb-1">
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h2>
        <p className="text-gray-500 mb-6">
          {isLogin ? 'Sign in as' : 'Registering as'} <span className="capitalize font-semibold text-gray-800">{selectedRole}</span>
        </p>

        {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 border border-red-100">
                {error}
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400"><User size={18} /></div>
                    <input 
                        type="text" 
                        required 
                        className="input-field pl-10" 
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400"><Mail size={18} /></div>
                <input 
                    type="email" 
                    required 
                    className="input-field pl-10" 
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400"><Lock size={18} /></div>
                <input 
                    type={showPassword ? "text" : "password"} 
                    required 
                    className="input-field pl-10 pr-10" 
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={e => setFormData({...formData, password: e.target.value})}
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
            </div>
          </div>

          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l2.27-2.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                  </div>
                  <input 
                      type="tel" 
                      required 
                      className="input-field pl-10" 
                      placeholder="+1 234 567 8900"
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                  />
              </div>
            </div>
          )}

          <button type="submit" className={`w-full btn-primary mt-4 ${selectedRole === 'contractor' ? 'bg-emerald-600 hover:bg-emerald-700' : ''}`}>
            {isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button 
            onClick={() => setIsLogin(!isLogin)} 
            className={`font-semibold hover:underline ${selectedRole === 'agent' ? 'text-indigo-600' : 'text-emerald-600'}`}
          >
            {isLogin ? 'Sign Up' : 'Log In'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
