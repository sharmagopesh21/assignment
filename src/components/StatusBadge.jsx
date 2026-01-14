import { clsx } from 'clsx';
import { useMemo } from 'react';

const StatusBadge = ({ status }) => {
  const styles = useMemo(() => {
    switch (status.toLowerCase()) {
      case 'open':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'assigned':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'inprogress':
      case 'in progress':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'invoiced':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'interest expressed':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'payment initiated':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'paid':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }, [status]);

  return (
    <span className={clsx("px-2.5 py-0.5 rounded-full text-xs font-medium border", styles)}>
      {status === 'Paid' ? 'Payment Completed' : status}
    </span>
  );
};

export default StatusBadge;
