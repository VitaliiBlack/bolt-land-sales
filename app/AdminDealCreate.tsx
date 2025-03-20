import DealForm from '@/components/DealForm';
import { useDeals } from '@/store/dealStore';
import { useNavigate } from 'react-router-dom';
import { Deal } from '@/types';

export default function AdminDealCreate() {
  const { createDeal } = useDeals();
  const navigate = useNavigate();

  const handleSubmit = async (dealData: Partial<Deal>) => {
    await createDeal(dealData);
    navigate('/admin');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Create New Deal</h1>
      <DealForm onSubmit={handleSubmit} />
    </div>
  );
}
