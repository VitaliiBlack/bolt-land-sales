import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DealForm from '@/components/DealForm';
import { useDeals } from '@/store/dealStore';
import { Deal } from '@/types';

export default function AdminDealEdit() {
  const { id } = useParams<{ id: string }>();
  const { getDeal, updateDeal } = useDeals();
  const [deal, setDeal] = useState<Deal | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      const dealData = getDeal(id);
      setDeal(dealData);
    }
  }, [id, getDeal]);

  const handleSubmit = async (dealData: Partial<Deal>) => {
    if (id) {
      await updateDeal(id, dealData);
      navigate('/admin');
    }
  };

  if (!deal) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Edit Deal</h1>
      <DealForm deal={deal} onSubmit={handleSubmit} />
    </div>
  );
}
