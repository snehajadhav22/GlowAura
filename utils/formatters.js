export const formatPrice = (n) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

export const salePrice = (price, discount) =>
  Math.round(price * (1 - discount / 100));

export const statusColor = (status) => ({
  Pending:   'bg-yellow-100 text-yellow-700',
  Confirmed: 'bg-blue-100 text-blue-700',
  Shipped:   'bg-indigo-100 text-indigo-700',
  Delivered: 'bg-green-100 text-green-700',
  Cancelled: 'bg-red-100 text-red-700',
}[status] || 'bg-gray-100 text-gray-600');

export const paymentStatusColor = (s) => ({
  paid:     'bg-green-100 text-green-700',
  pending:  'bg-yellow-100 text-yellow-700',
  failed:   'bg-red-100 text-red-700',
  refunded: 'bg-purple-100 text-purple-700',
}[s] || 'bg-gray-100 text-gray-600');