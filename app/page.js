'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import Layout from '../components/Layout';
import { Users, BookOpen, UserCheck, TrendingUp } from 'lucide-react';
import { formatDate } from '../utils/helpers';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCourses: 0,
    totalEnrollments: 0,
    activeUsers: 0
  });
  const [recentEnrollments, setRecentEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch users
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const users = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // Fetch courses
      const coursesSnapshot = await getDocs(collection(db, 'courses'));
      const courses = coursesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // Fetch enrollments
      const enrollmentsQuery = query(collection(db, 'enrollments'), orderBy('enrolledAt', 'desc'));
      const enrollmentsSnapshot = await getDocs(enrollmentsQuery);
      const enrollments = enrollmentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      setStats({
        totalUsers: users.length,
        totalCourses: courses.length,
        totalEnrollments: enrollments.length,
        activeUsers: users.filter(user => user.isActive).length
      });
      
      setRecentEnrollments(enrollments.slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <Layout title="Dashboard">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Dashboard">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Users"
            value={stats.totalUsers}
            icon={Users}
            color="bg-blue-500"
          />
          <StatCard
            title="Total Courses"
            value={stats.totalCourses}
            icon={BookOpen}
            color="bg-green-500"
          />
          <StatCard
            title="Total Enrollments"
            value={stats.totalEnrollments}
            icon={UserCheck}
            color="bg-purple-500"
          />
          <StatCard
            title="Active Users"
            value={stats.activeUsers}
            icon={TrendingUp}
            color="bg-orange-500"
          />
        </div>

        {/* Recent Enrollments */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Recent Enrollments</h3>
          </div>
          <div className="p-6">
            {recentEnrollments.length > 0 ? (
              <div className="space-y-4">
                {recentEnrollments.map((enrollment) => (
                  <div key={enrollment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">User ID: {enrollment.userId}</p>
                      <p className="text-sm text-gray-600">Course ID: {enrollment.courseId}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">{formatDate(enrollment.enrolledAt)}</p>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        enrollment.status === 'enrolled' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {enrollment.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No enrollments yet</p>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="/courses"
              className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-center"
            >
              <BookOpen className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-900">Add New Course</p>
            </a>
            <a
              href="/users"
              className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors text-center"
            >
              <Users className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-900">Manage Users</p>
            </a>
            <a
              href="/enrollments"
              className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors text-center"
            >
              <UserCheck className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-900">View Enrollments</p>
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
}
