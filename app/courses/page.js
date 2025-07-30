'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import Layout from '../../components/Layout';
import CourseForm from '../../components/CourseForm';
import { Search, Filter, Plus, Edit, Trash2, Eye, BookOpen } from 'lucide-react';
import { formatDate, truncateText } from '../../utils/helpers';

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    filterCourses();
  }, [courses, searchTerm, statusFilter]);

  const fetchCourses = async () => {
    try {
      const coursesQuery = query(collection(db, 'courses'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(coursesQuery);
      const coursesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCourses(coursesData);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterCourses = () => {
    let filtered = courses;

    if (searchTerm) {
      filtered = filtered.filter(course =>
        course.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.instructor?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(course => {
        if (statusFilter === 'active') return course.isActive;
        if (statusFilter === 'inactive') return !course.isActive;
        return true;
      });
    }

    setFilteredCourses(filtered);
  };

  const handleEdit = (course) => {
    setEditingCourse(course);
    setShowForm(true);
  };

  const handleDelete = async (courseId) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await deleteDoc(doc(db, 'courses', courseId));
        fetchCourses();
      } catch (error) {
        console.error('Error deleting course:', error);
      }
    }
  };

  const handleFormSave = () => {
    setShowForm(false);
    setEditingCourse(null);
    fetchCourses();
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingCourse(null);
  };

  if (loading) {
    return (
      <Layout title="Courses">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Courses">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Courses</h1>
            <p className="text-gray-600">Manage all courses in the system</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Course</span>
          </button>
        </div>

        {/* Course Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
            <div className="max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
              <CourseForm
                course={editingCourse}
                onSave={handleFormSave}
                onCancel={handleFormCancel}
              />
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search courses..."
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
                <option value="all">All Courses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-blue-600">{courses.length}</div>
            <div className="text-sm text-gray-600">Total Courses</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-green-600">
              {courses.filter(course => course.isActive).length}
            </div>
            <div className="text-sm text-gray-600">Active Courses</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-red-600">
              {courses.filter(course => !course.isActive).length}
            </div>
            <div className="text-sm text-gray-600">Inactive Courses</div>
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div key={course.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {course.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3">
                      {truncateText(course.description, 100)}
                    </p>
                  </div>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    course.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {course.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="font-medium">Instructor:</span>
                    <span className="ml-1">{course.instructor}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="font-medium">Duration:</span>
                    <span className="ml-1">{course.duration}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="font-medium">Created:</span>
                    <span className="ml-1">{formatDate(course.createdAt)}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-2">
                    <button className="text-blue-600 hover:text-blue-800 p-1">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleEdit(course)}
                      className="text-gray-600 hover:text-gray-800 p-1"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(course.id)}
                      className="text-red-600 hover:text-red-800 p-1"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <BookOpen className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No courses found</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
