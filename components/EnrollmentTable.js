'use client';

import { useState } from 'react';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Eye, Edit, Trash2, User, BookOpen } from 'lucide-react';
import { formatDate, getStatusColor } from '../utils/helpers';

const EnrollmentTable = ({ enrollments, onEnrollmentUpdate }) => {
  const [loading, setLoading] = useState(null);

  const handleStatusUpdate = async (enrollmentId, newStatus) => {
    setLoading(enrollmentId);
    try {
      await updateDoc(doc(db, 'enrollments', enrollmentId), {
        status: newStatus
      });
      onEnrollmentUpdate();
    } catch (error) {
      console.error('Error updating enrollment status:', error);
    } finally {
      setLoading(null);
    }
  };

  const handleDelete = async (enrollmentId) => {
    if (window.confirm('Are you sure you want to delete this enrollment?')) {
      try {
        await deleteDoc(doc(db, 'enrollments', enrollmentId));
        onEnrollmentUpdate();
      } catch (error) {
        console.error('Error deleting enrollment:', error);
      }
    }
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Student
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Course
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Enrolled Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {enrollments.map((enrollment) => (
              <tr key={enrollment.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        User ID: {enrollment.userId}
                      </div>
                      <div className="text-sm text-gray-500">
                        Enrollment ID: {enrollment.id}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                      <BookOpen className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        Course ID: {enrollment.courseId}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={enrollment.status}
                    onChange={(e) => handleStatusUpdate(enrollment.id, e.target.value)}
                    disabled={loading === enrollment.id}
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 ${getStatusColor(enrollment.status)} ${
                      loading === enrollment.id ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                    }`}
                  >
                    <option value="enrolled">Enrolled</option>
                    <option value="completed">Completed</option>
                    <option value="dropped">Dropped</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(enrollment.enrolledAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    <button className="text-blue-600 hover:text-blue-900">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="text-gray-600 hover:text-gray-900">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(enrollment.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {enrollments.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No enrollments found</p>
        </div>
      )}
    </div>
  );
};

export default EnrollmentTable;
