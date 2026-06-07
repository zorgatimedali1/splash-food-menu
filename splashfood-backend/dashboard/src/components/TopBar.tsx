import { FiLogOut, FiUser } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { logout, getUser } from '../lib/auth';

interface Props { title: string; }

export default function TopBar({ title }: Props) {
  const navigate = useNavigate();
  const user = getUser();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="h-16 bg-white border-b border-splash-border flex items-center justify-between px-6 shrink-0">
      <h1 className="font-montserrat font-bold text-lg">{title}</h1>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-sm text-splash-gray">
          <div className="w-7 h-7 rounded-full bg-splash-light-gray flex items-center justify-center">
            <FiUser size={14} />
          </div>
          <span className="font-medium text-black">{user?.name || 'Admin'}</span>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 text-sm text-splash-gray hover:text-black transition-colors px-3 py-1.5 rounded-xl hover:bg-splash-light-gray"
        >
          <FiLogOut size={15} />
          <span>Déconnexion</span>
        </button>
      </div>
    </header>
  );
}
