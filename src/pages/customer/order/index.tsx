"use client";

import { useState, useEffect } from "react";
import OrderHistoryTemplate from "@/components/templates/order/OrderHistoryTemplate";
import { mockOrders } from "./mockOrders";
import OrderService from "@/services/OrderService";

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { getOrders } = OrderService();
  // Simulate API call
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      const response = await getOrders();
      if (response) {
        setOrders(response?.responseRequestModel.responseList.items);
      }
      setOrders(mockOrders);
      setLoading(false);
    };

    fetchOrders();
  }, []);

  const handleRefresh = async () => {
    setLoading(true);
    // Simulate API call to refresh data
    await new Promise((resolve) => setTimeout(resolve, 500));
    setOrders([...mockOrders]); // In real app, this would fetch fresh data
    setLoading(false);
  };

  return (
    <OrderHistoryTemplate
      initialOrders={orders}
      isLoading={loading}
      onRefresh={handleRefresh}
    />
  );
}
