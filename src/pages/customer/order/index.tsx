"use client";

import { useState, useEffect } from "react";
import OrderHistoryTemplate from "@/components/templates/order/OrderHistoryTemplate";
import OrderService from "@/services/OrderService";

interface OrderHistoryPageProps {
  onOrderCreated?: () => void;
}

export default function OrderHistoryPage({
  onOrderCreated,
}: OrderHistoryPageProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { getOrders } = OrderService();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    const response = await getOrders();
    if (response) {
      setOrders(response?.responseRequestModel.responseList.items);
    }
    setLoading(false);
  };

  const handleRefresh = async () => {
    setLoading(true);
    await fetchOrders();
    setLoading(false);
  };

  return (
    <OrderHistoryTemplate
      initialOrders={orders}
      isLoading={loading}
      onRefresh={handleRefresh}
      onOrderCreated={onOrderCreated}
    />
  );
}
