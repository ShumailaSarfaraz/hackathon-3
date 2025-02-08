"use client";

import React, { useEffect, useState } from "react";
import { auth } from "../../../firebase/firebase";
import { Header } from "@/components/Header";
import NewsletterSection from "@/components/Newsletter";
import Footer from "@/components/PageFooter";
import { Clock, Package, CreditCard, ChevronRight } from "lucide-react";

interface Order {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  date: string;
}

const ProfilePage: React.FC = () => {
  const [userOrders, setUserOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const retrieveOrders = () => {
      const currentUser = auth.currentUser;
      if (!currentUser) return;

      const ordersKey = `${currentUser.uid}_orders`;
      const storedOrders = JSON.parse(localStorage.getItem(ordersKey) || "[]");
      setUserOrders(storedOrders);
      setLoading(false);
    };

    retrieveOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <p className="text-[#2A254B] text-xl font-clash">Loading...</p>
      </div>
    );
  }

  const currentUser = auth.currentUser;
  if (!currentUser) {
    return (
      <p className="text-[#2A254B] text-xl text-center mt-8 font-clash">
        No user found
      </p>
    );
  }

  const totalOrders = userOrders.length;
  const totalSpent = userOrders.reduce((acc, order) => acc + order.price * order.quantity, 0);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-white font-clash">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="bg-[#2A254B] text-white rounded-3xl p-8 mb-8">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center text-3xl">
                {currentUser.displayName ? currentUser.displayName[0].toUpperCase() : "U"}
              </div>
              <div>
                <h1 className="text-2xl font-semibold mb-1">{currentUser.displayName}</h1>
                <p className="text-white/70">{currentUser.email}</p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white border border-[#2A254B]/10 rounded-2xl p-6">
              <Package className="w-6 h-6 text-[#2A254B] mb-4" />
              <p className="text-[#2A254B]/60 mb-1">Total Orders</p>
              <p className="text-3xl font-semibold text-[#2A254B]">{totalOrders}</p>
            </div>
            <div className="bg-white border border-[#2A254B]/10 rounded-2xl p-6">
              <CreditCard className="w-6 h-6 text-[#2A254B] mb-4" />
              <p className="text-[#2A254B]/60 mb-1">Total Spent</p>
              <p className="text-3xl font-semibold text-[#2A254B]">${totalSpent.toFixed(2)}</p>
            </div>
            <div className="bg-white border border-[#2A254B]/10 rounded-2xl p-6">
              <Clock className="w-6 h-6 text-[#2A254B] mb-4" />
              <p className="text-[#2A254B]/60 mb-1">Member Since</p>
              <p className="text-3xl font-semibold text-[#2A254B]">
                {currentUser.metadata.creationTime
                  ? new Date(currentUser.metadata.creationTime).getFullYear()
                  : "N/A"}
              </p>
            </div>
          </div>

          <div className="bg-white border border-[#2A254B]/10 rounded-2xl p-6">
            <h2 className="text-2xl font-semibold text-[#2A254B] mb-6">Recent Orders</h2>
            {userOrders.length === 0 ? (
              <p className="text-center text-[#2A254B]/60 py-8">No orders yet</p>
            ) : (
              <div className="space-y-4">
                {userOrders.map((order) => (
                  <div
                    key={order._id}
                    className="flex items-center justify-between p-4 hover:bg-[#2A254B]/5 rounded-xl transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-[#2A254B]/5 rounded-xl flex items-center justify-center">
                        <Package className="w-6 h-6 text-[#2A254B]" />
                      </div>
                      <div>
                        <p className="font-medium text-[#2A254B] mb-1">{order.name}</p>
                        <p className="text-sm text-[#2A254B]/60">
                          {new Date(order.date).toLocaleDateString()} • Qty: {order.quantity}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="font-semibold text-[#2A254B]">
                        ${(order.price * order.quantity).toFixed(2)}
                      </p>
                      <ChevronRight className="w-5 h-5 text-[#2A254B]/40 group-hover:text-[#2A254B] transition-colors" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <NewsletterSection />
      <Footer />
    </>
  );
};

export default ProfilePage;
