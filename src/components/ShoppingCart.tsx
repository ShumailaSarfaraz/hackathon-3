"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { auth } from "../../firebase/firebase";
import { User } from "firebase/auth";
import { Trash2, ShoppingBag, Minus, Plus } from "lucide-react";

interface Category {
  name: string;
  slug: string;
}

interface Dimensions {
  width: string;
  height: string;
  depth: string;
}

interface Products {
  name: string;
  description: string;
  image: string;
  _id: string;
  features: string[];
  dimensions: Dimensions;
  category: Category;
  price: number;
  tags: string[];
  quantity: number;
}

export default function ShoppingCart() {
  const [cartItems, setCartItems] = useState<Products[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      const savedCart = localStorage.getItem(user.uid + "_cart");
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
    }
  }, [user]);

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    const updatedCart = cartItems.map((item) =>
      item._id === id ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedCart);
    if (user) {
      localStorage.setItem(user.uid + "_cart", JSON.stringify(updatedCart));
    }
  };

  const removeItem = (id: string) => {
    const updatedCart = cartItems.filter((item) => item._id !== id);
    setCartItems(updatedCart);
    if (user) {
      localStorage.setItem(user.uid + "_cart", JSON.stringify(updatedCart));
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * (item.quantity || 1),
      0
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-primary/5 to-primary/10">
        <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-primary/10 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg text-center">
          <ShoppingBag className="w-16 h-16 text-primary mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-primary mb-4 font-clash">Shopping Cart</h1>
          <p className="text-gray-600 mb-8 font-clash">
            Please sign in or create an account to view your cart
          </p>
          <Link href="/user-creation">
            <Button className="w-full bg-primary hover:bg-primary/90 text-white py-3 rounded-lg font-clash">
              Sign In / Sign Up
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-primary/10">
      <div className="max-w-[1440px] mx-auto px-4 py-16">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-primary font-clash">Shopping Cart</h1>
            <p className="text-gray-600 font-clash">
              {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
            </p>
          </div>

          {cartItems.length === 0 ? (
            <div className="text-center py-16">
              <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 font-clash text-lg">Your cart is empty</p>
            </div>
          ) : (
            <>
              <div className="space-y-6">
                {cartItems.map((item) => (
                  <div key={item._id} className="bg-gray-50 rounded-lg p-4 flex flex-col md:flex-row gap-6">
                    <div className="relative w-full md:w-48 h-48 md:h-32 rounded-lg overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-grow flex flex-col md:flex-row justify-between">
                      <div className="space-y-2">
                        <h2 className="font-clash text-lg font-medium">{item.name}</h2>
                        <p className="text-primary font-clash text-lg">£{item.price}</p>
                        <button
                          onClick={() => removeItem(item._id)}
                          className="flex items-center text-red-500 hover:text-red-600 font-clash"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Remove
                        </button>
                      </div>
                      <div className="mt-4 md:mt-0 flex items-center gap-4">
                        <div className="flex items-center bg-white rounded-lg border">
                          <button
                            onClick={() => updateQuantity(item._id, (item.quantity || 1) - 1)}
                            className="p-2 hover:bg-gray-100 rounded-l-lg"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <Input
                            type="number"
                            value={item.quantity || 1}
                            min="1"
                            onChange={(e) => updateQuantity(item._id, parseInt(e.target.value))}
                            className="w-16 text-center border-0"
                          />
                          <button
                            onClick={() => updateQuantity(item._id, (item.quantity || 1) + 1)}
                            className="p-2 hover:bg-gray-100 rounded-r-lg"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="font-clash text-lg font-medium">
                          £{(item.price * (item.quantity || 1)).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 border-t pt-8">
                <div className="flex flex-col items-end gap-4">
                  <div className="flex gap-8 text-lg font-clash">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">£{calculateTotal().toFixed(2)}</span>
                  </div>
                  <Link href="/checkout">
                    <Button className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-lg font-clash">
                      Proceed to Checkout
                    </Button>
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}