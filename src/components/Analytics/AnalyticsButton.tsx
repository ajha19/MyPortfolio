import { FC } from 'react';
import { BarChart3 } from 'lucide-react';

interface AnalyticsButtonProps {
  onClick: () => void;
}

const AnalyticsButton: FC<AnalyticsButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-8 left-8 z-40 p-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-110 group"
      title="View Analytics"
    >
      <BarChart3 
        size={24} 
        className="group-hover:animate-pulse transition-transform duration-300" 
      />
    </button>
  );
};

export default AnalyticsButton;