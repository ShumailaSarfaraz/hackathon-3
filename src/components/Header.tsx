"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, Menu, Heart, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { auth } from "../../firebase/firebase";
import { signOut, User } from "firebase/auth";

export const Header = () => {
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSearch = () => {
    if (searchInput.trim()) {
      const query = encodeURIComponent(searchInput.trim());
      router.push(`/product-listing?search=${query}`);
      setShowSearchModal(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      if (user) {
        localStorage.removeItem(`${user.uid}`);
      }
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <nav className="border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left: Search Icon */}
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:text-gray-500"
            onClick={() => setShowSearchModal(true)}
          >
            <Search className="h-6 w-6" />
            <span className="sr-only">Search</span>
          </Button>

          {/* Center: Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-2xl" style={{ fontFamily: "var(--font-clash-reg)" }}>
              Avion
            </span>
          </Link>

          {/* Right: Mobile Menu Toggle */}
          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-400 hover:text-gray-500"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              <Menu className="h-6 w-6" />
              <span className="sr-only">Open menu</span>
            </Button>
          </div>

          {/* Right: Desktop Navigation */}
          <div className="hidden lg:flex items-center">
            {/* Cart (Always Visible) */}
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="ml-4 text-gray-400 hover:text-gray-500">
                <Image
                  src="/icons/Shopping--cart.svg"
                  alt="Shopping cart"
                  width={16}
                  height={16}
                  style={{ display: "block" }} // Ensure the image is visible
                />
                <span className="sr-only">Shopping cart</span>
              </Button>
            </Link>

            {/* Profile */}
            {user && (
              <Link href="/profile">
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-500">
                  <UserRound className="h-6 w-6" />
                  <span className="sr-only">Profile</span>
                </Button>
              </Link>
            )}

            {/* Sign In / Sign Out */}
            {user ? (
              <Button variant="ghost" size="sm" className="ml-2 text-gray-700 hover:bg-gray-100" onClick={handleSignOut}>
                Sign Out
              </Button>
            ) : (
              <Link href="/user-creation">
                <Button variant="ghost" size="sm" className="ml-4 text-gray-700 hover:bg-gray-100">
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Search Modal */}
      {showSearchModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={() => setShowSearchModal(false)}
        >
          <div className="bg-white p-6 w-4/5 max-w-xl relative z-60" onClick={(e) => e.stopPropagation()}>
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              onClick={() => setShowSearchModal(false)}
            >
              &times;
            </button>
            <h2 className="text-xl font-semibold text-gray-700 mb-4 font-clash">Looking for something?</h2>
            <p className="text-gray-600 mb-4 font-clash">Input the name of the product and find out if we have it.</p>
            <div className="items-center space-y-2 font-clash">
              <Input
                type="search"
                placeholder="Search..."
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-grow border-gray-300"
              />
              <Button onClick={handleSearch} style={{ backgroundColor: "#2A254B", color: "white" }} className="px-4 py-2">
                Search
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};