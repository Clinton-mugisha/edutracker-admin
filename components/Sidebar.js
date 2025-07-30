'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  Users, 
  BookOpen, 
  UserCheck, 
  LogOut,
  GraduationCap 
} from 'lucide-react';
import { logoutAdmin } from '../lib/auth';

const Sidebar = () => {
  const pathname = usePathname();

  const menuItems = [
    { href: '/', icon: Home, label: 'Dashboard' },
    { href: '/users', icon: Users, label: 'Users' },
    { href: '/courses', icon: BookOpen, label: 'Courses' },
    { href: '/enrollments', icon: UserCheck, label: 'Enrollments' },
  ];

  const handleLogout = async () => {
    await logoutAdmin();
    window.location.href = '/login';
  };

  return (
    <div className="bg-gray-900 text-white w-64 min-h-screen flex flex-col">
      <div className="p-6">
        <div className="flex items-center space-x-2">
          <GraduationCap className="h-8 w-8 text-blue-400" />
          <h1 className="text-xl font-bold">EduTracker Admin</h1>
        </div>
      </div>

      <nav className="flex-1 px-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4">
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-colors w-full"
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
