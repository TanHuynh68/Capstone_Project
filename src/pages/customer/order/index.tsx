"use client";

import { useState, useEffect } from "react";
import OrderHistoryTemplate from "@/components/templates/order/OrderHistoryTemplate";
import OrderService from "@/services/OrderService";

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { getOrders } = OrderService();

  useEffect(() => {
    console.log("loading: ", loading);
    fetchOrders();
    console.log("loading: ", loading);
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    const response = await getOrders();
    if (response) {
      console.log('response: ', response)
      setOrders(response?.responseRequestModel?.responseList?.items);
      setLoading(false); // Chỉ gọi setLoading(false) khi có dữ liệu
    } else {
      setLoading(false); // Cũng có thể gọi ở đây nếu không có dữ liệu
    }
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
    />
  );
}
