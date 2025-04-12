import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiUsers, FiPackage, FiDollarSign, FiCreditCard } from "react-icons/fi";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { getAdminStats } from "../../services/adminService";
import { toast } from "react-toastify";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdmin = async () => {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        navigate("/admin/login");
        return;
      }
      
      try {
        const data = await getAdminStats();
        setStats(data.stats);
        setRecentTransactions(data.recentTransactions);
      } catch (error) {
        console.error("Error fetching admin stats:", error);
        if (error.response?.status === 403) {
          toast.error("Access denied. Admin privileges required.");
          navigate("/admin/login");
        } else {
          toast.error("Failed to load dashboard data.");
        }
      } finally {
        setLoading(false);
      }
    };
    
    checkAdmin();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />
      
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard Overview</h1>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard
              title="Total Users"
              value={stats?.totalUsers || 0}
              icon={<FiUsers size={24} />}
              color="bg-blue-600"
              trend="+12%"
              description="Total registered users"
            />
            <StatsCard
              title="Total Skills"
              value={stats?.totalSkills || 0}
              icon={<FiPackage size={24} />}
              color="bg-green-600"
              trend="+5%"
              description="Available skills"
            />
            <StatsCard
              title="Total Transactions"
              value={stats?.totalTransactions || 0}
              icon={<FiDollarSign size={24} />}
              color="bg-yellow-600"
              trend="+18%"
              description="Completed transactions"
            />
            <StatsCard
              title="Total Credits"
              value={stats?.totalCredits || 0}
              icon={<FiCreditCard size={24} />}
              color="bg-purple-600"
              trend="+7%"
              description="Credits in circulation"
            />
          </div>
          
          {/* Recent Transactions */}
          <div className="bg-white rounded-xl shadow-card p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Recent Transactions</h2>
              <button 
                onClick={() => navigate("/admin/transactions")}
                className="text-sm font-medium text-indigo-600 hover:text-indigo-800 flex items-center"
              >
                View All <span className="ml-1">→</span>
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Skill</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentTransactions.map((transaction) => (
                    <tr key={transaction._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-600">
                              {transaction.user?.name?.charAt(0) || '?'}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{transaction.user?.name || 'Unknown User'}</div>
                            <div className="text-sm text-gray-500">{transaction.user?.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{transaction.skill?.name || 'Unknown Skill'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${transaction.type === 'earn' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                        >
                          {transaction.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        {transaction.amount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(transaction.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {recentTransactions.length === 0 && (
                <p className="text-center py-4 text-gray-500">No recent transactions found</p>
              )}
            </div>
          </div>
          
          {/* System Status */}
          <div className="bg-white rounded-xl shadow-card p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">System Status</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatusCard title="Server Status" value="Online" color="bg-green-500" />
              <StatusCard title="Database" value="Connected" color="bg-green-500" />
              <StatusCard title="Last Backup" value="Today, 03:45 AM" color="bg-blue-500" />
              <StatusCard title="System Load" value="23%" color="bg-yellow-500" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper component for stats cards with enhanced design
const StatsCard = ({ title, value, icon, color, trend, description }) => (
  <div className="bg-white rounded-xl shadow-card p-6 overflow-hidden relative">
    <div className={`absolute right-0 top-0 h-full w-1 ${color}`}></div>
    <div className="flex justify-between mb-4">
      <div className={`p-3 rounded-lg ${color.replace('bg-', 'bg-') + '/10'}`}>
        <span className={`text-${color.replace('bg-', '')}`}>{icon}</span>
      </div>
      {trend && (
        <span className="text-xs font-medium bg-green-100 text-green-800 px-2 py-1 rounded-full flex items-center">
          {trend}
        </span>
      )}
    </div>
    <div>
      <h3 className="text-3xl font-bold text-gray-800">{value}</h3>
      <p className="text-sm text-gray-500 mt-1">{title}</p>
      {description && <p className="text-xs text-gray-400 mt-2">{description}</p>}
    </div>
  </div>
);

// Helper component for status cards
const StatusCard = ({ title, value, color }) => (
  <div className="bg-gray-50 rounded-lg p-4">
    <div className="flex justify-between items-center">
      <span className="text-sm text-gray-500">{title}</span>
      <span className={`h-2 w-2 rounded-full ${color}`}></span>
    </div>
    <div className="mt-2 font-medium text-gray-800">{value}</div>
  </div>
);

export default AdminDashboard;
