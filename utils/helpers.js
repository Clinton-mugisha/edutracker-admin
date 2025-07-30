export const formatDate = (timestamp) => {
  if (!timestamp) return 'N/A';
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};

export const getStatusColor = (status) => {
  switch (status) {
    case 'active':
      return 'text-green-600 bg-green-100';
    case 'inactive':
      return 'text-red-600 bg-red-100';
    case 'enrolled':
      return 'text-blue-600 bg-blue-100';
    case 'completed':
      return 'text-purple-600 bg-purple-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
};
