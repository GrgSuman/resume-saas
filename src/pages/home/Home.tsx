import { useNavigate } from 'react-router';
import { useEffect } from 'react';

export default function Home() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/signin");
  }, [navigate]);
  return (
    <div className="bg-white">
      <div className="flex justify-center items-center h-screen">
        <div className="w-20 h-20 rounded-full border-4 border-gray-200 border-t-blue-600 animate-spin"></div>
      </div>
    </div>
  )
}