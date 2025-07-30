'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import Layout from '../../components/Layout';
import EnrollmentTable from '../../components/EnrollmentTable';
import { Search, Filter, UserCheck, TrendingUp, Users, BookOpen } from 'lucide-react';

export default function EnrollmentsPage() {
  const [enrollments, setEnrollments] = useState([]);
  const [filteredEnrollments, setFilteredEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchEnrollments();
  }, []);

  useEffect(() => {
    filterEnrollments();
  }, [enrollments, searchTerm, statusFilter]);

  const fetchEnrollments = async () => {
    try {
      const enrollmentsQuery = query(collection(db, 'enrollments'), orderBy('enrolledAt', 'desc'));
      const snapshot = await getDocs(enrollmentsQuery);
      const enrollmentsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setEnrollments(enrollmentsData);
    } catch (error) {
      console.error('Error fetching enrollments:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterEnrollments = () => {
    let filtered = enrollments;

    if (searchTerm) {
      filtered = filtered.filter(enrollment =>
        enrollment.userId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        enrollment.courseId?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(enrollment => enrollment.status === statusFilter);
    }

    setFilteredEnrollments(filtered);
  };

  const getStatusStats = () => {
    return {
      total: enrollments.length,
      enrolled: enrollments.filter(e => e.status === 'enrolled').length,
      completed: enrollments.filter(e => e.status === 'completed').length,
      dropped: enrollments.filter(e => e.status === 'dropped').length
    };
  };

  const stats = getStatusStats();

  if (loading) {
    return (
      <Layout title="Enrollments">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Enrollments">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Enrollments</h1>
            <p className="text-gray-600">Manage student course enrollments</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search by user ID or course ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="enrolled">Enrolled</option>
                <option value="completed">Completed</option>
                <option value="dropped">Dropped</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-500">
                <UserCheck className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                <div className="text-sm text-gray-600">Total Enrollments</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-500">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">{stats.enrolled}</div>
                <div className="text-sm text-gray-600">Active Enrollments</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-500">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">{stats.completed}</div>
                <div className="text-sm text-gray-600">Completed</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-red-500">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">{stats.dropped}</div>
                <div className="text-sm text-gray-600">Dropped</div>
              </div>
            </div>
          </div>
        </div>

        {/* Enrollments Table */}
        <EnrollmentTable 
          enrollments={filteredEnrollments} 
          onEnrollmentUpdate={fetchEnrollments} 
        />

        {/* Empty State */}
        {filteredEnrollments.length === 0 && !loading && (
          <div className="text-center py-12">
            <UserCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No enrollments found</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
