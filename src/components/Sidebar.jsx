import { Home, Bell, Users, Car, LogOut, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'reminders', label: 'Reminders', icon: Bell },
    { id: 'clients', label: 'Clients', icon: Users },
    { id: 'vehicles', label: 'Vehicles', icon: Car }
  ];

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const handleLogout = () => {
    console.log('Logout clicked');
    alert('Logout functionality - Add your logout logic here');
  };

  const handleNavClick = (itemId) => {
    setActiveTab(itemId);
    setIsMenuOpen(false);
  };

  if (isMobile) {
    return (
      <>
        {/* Bottom Navigation Bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 shadow-lg">
          <div className="flex items-center justify-around py-2">
            {navItems.map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex flex-col items-center justify-center px-3 py-2 transition-all ${
                    activeTab === item.id
                      ? 'text-blue-600'
                      : 'text-gray-600'
                  }`}
                >
                  <Icon className={`w-6 h-6 ${activeTab === item.id ? 'stroke-2' : ''}`} />
                  <span className="text-xs mt-1 font-medium">{item.label}</span>
                </button>
              );
            })}
            <button
              onClick={() => setIsMenuOpen(true)}
              className="flex flex-col items-center justify-center px-3 py-2 text-gray-600"
            >
              <Menu className="w-6 h-6" />
              <span className="text-xs mt-1 font-medium">Menu</span>
            </button>
          </div>
        </div>

        {/* Overlay */}
      {isMenuOpen && (
          <div 
            className="fixed inset-0 bg-white/20 bg-opacity-40 backdrop-blur-sm z-40 transition-all"
            onClick={() => setIsMenuOpen(false)}
          />
        )}

        {/* Slide-out Menu */}
      <div className={`fixed top-0 right-0 h-full w-64 bg-white bg-opacity-70 backdrop-blur-xl shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`} style={{ backdropFilter: 'blur(20px)' }}>
          <div className="flex flex-col h-full">
            {/* Menu Header */}
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Car className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-gray-900">  RTO-SMS</h2>
                  <p className="text-xs text-gray-500">Admin Panel</p>
                </div>
              </div>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Menu Items */}
            <nav className="flex-1 p-4 space-y-2">
              {navItems.map(item => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      activeTab === item.id
                        ? 'bg-blue-50 text-blue-600 font-semibold'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </button>
                );
              })}
            </nav>

            {/* Logout Button */}
            <div className="p-4 border-t border-gray-200">
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-all"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }
  
  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-full">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <Car className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-gray-900">  RTO-SMS</h2>
            <p className="text-xs text-gray-500">Admin Panel</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map(item => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                activeTab === item.id
                  ? 'bg-blue-50 text-blue-600 font-semibold'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </button>
          );
        })}
      </nav>
      <div className="p-4 border-t border-gray-200">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-all"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;