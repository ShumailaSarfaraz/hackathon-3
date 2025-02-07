"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { Header } from "@/components/Header";
import Footer2 from "@/components/footer2";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import sanityClient from "@sanity/client";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import { auth } from "../../../firebase/firebase";
import { User } from "firebase/auth";

const client = sanityClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: "production",
  apiVersion: "2024-01-04",
  useCdn: true,
});

type CategoryType = {
  name: string;
  slug: string;
};

type ProductDimensions = {
  width: string;
  height: string;
  depth: string;
};

type ProductType = {
  name: string;
  description: string;
  image: string;
  _id: string;
  features: string[];
  dimensions: ProductDimensions;
  category: CategoryType;
  price: number;
  tags: string[];
  quantity: number;
};

type FilterSettings = {
  categories: string[];
  priceRange: string;
  page: number;
  itemsPerPage: number;
};

async function getCategories() {
  const result = await client.fetch(`*[_type == "category"]{ name, slug }`);
  return result;
}

async function getFilteredProducts(
  filters: FilterSettings,
  searchQuery?: string
) {
  const { categories, priceRange, page, itemsPerPage } = filters;

  let priceCondition = "";
  if (priceRange) {
    if (priceRange === "250+") {
      priceCondition = "price >= 250";
    } else {
      const [min, max] = priceRange.split(" - ").map(Number);
      priceCondition = `price >= ${min} && price <= ${max}`;
    }
  }

  const categoryCondition =
    categories.length > 0
      ? `category->name in [${categories.map((c) => `"${c}"`).join(", ")}]`
      : "";

  const searchCondition = searchQuery ? `name match "${searchQuery}*"` : "";

  const conditions = [
    `_type == "product"`,
    categoryCondition,
    priceCondition,
    searchCondition,
  ]
    .filter(Boolean)
    .join(" && ");

  const query = `*[${conditions}]{
      _id,
      name,
      "image": image.asset->url,
      price,
      features,
      dimensions,
      category->,
      tags,
      quantity
    }[${(page - 1) * itemsPerPage}...${page * itemsPerPage}]`;

  const items = await client.fetch(query);
  return items;
}

function ProductList() {
  const params = useSearchParams();
  const query = params.get("search") || "";

  const [activeCategories, setActiveCategories] = useState<string[]>([]);
  const [selectedPrice, setSelectedPrice] = useState<string>("");
  const [items, setItems] = useState<ProductType[]>([]);
  const [categoryList, setCategoryList] = useState<CategoryType[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const [totalItems, setTotalItems] = useState(0);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const initializeData = async () => {
      try {
        setLoading(true);
        const categories = await getCategories();
        const uniqueCategories = Array.from(
          new Set(categories.map((cat: CategoryType) => cat.name))
        ).map((name) =>
          categories.find((cat: CategoryType) => cat.name === name)
        );
        setCategoryList(uniqueCategories);

        const products = await getFilteredProducts(
          {
            categories: [],
            priceRange: "",
            page: page,
            itemsPerPage: itemsPerPage,
          },
          query ? decodeURIComponent(query) : undefined
        );
        setItems(products);
      } catch (error) {
        console.error("Error initializing data:", error);
      } finally {
        setLoading(false);
      }
    };
    initializeData();
  }, [query, page]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const products = await getFilteredProducts(
          {
            categories: activeCategories,
            priceRange: selectedPrice,
            page: page,
            itemsPerPage: itemsPerPage,
          },
          query ? decodeURIComponent(query) : undefined
        );
        setItems(products);
      } catch (error) {
        console.error("Error loading products:", error);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, [activeCategories, selectedPrice, query, page]);

  const toggleCategory = (category: string) => {
    setActiveCategories((prev) =>
      prev.includes(category)
        ? prev.filter((cat) => cat !== category)
        : [...prev, category]
    );
  };

  const togglePriceRange = (range: string) => {
    setSelectedPrice((prev) => (prev === range ? "" : range));
  };

  const filters = {
    "Product type": categoryList.map((cat) => cat.name),
    Price: ["0 - 100", "101 - 250", "250+"],
  };

  const totalPages = Math.ceil(3);

  return (
    <>
      <Toaster />
      <Header />
      <div className="min-h-screen bg-white">
        <div className="relative h-[300px] w-full">
          <Image
            src="/Frame 143.png"
            alt="All Products"
            fill
            className="object-cover brightness-75"
          />
          <h1 className="font-clash absolute bottom-8 left-4 text-3xl font-normal text-white sm:left-8 lg:left-12">
            {query
              ? `Search Results for "${decodeURIComponent(query)}" (${items.length})`
              : `All products (${items.length})`}
          </h1>
        </div>

        <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-[240px,1fr] lg:gap-x-8">
            <div className="hidden lg:block">
              <Accordion type="single" collapsible className="w-full">
                {Object.entries(filters).map(([filterName, options]) => (
                  <AccordionItem key={filterName} value={filterName}>
                    <AccordionTrigger className="text-base font-normal">
                      {filterName}
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4">
                        {options.map((option) => (
                          <div
                            key={`${filterName}-${option}`}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={`${filterName}-${option}`}
                              checked={
                                filterName === "Product type"
                                  ? activeCategories.includes(option)
                                  : selectedPrice === option
                              }
                              onCheckedChange={() =>
                                filterName === "Product type"
                                  ? toggleCategory(option)
                                  : togglePriceRange(option)
                              }
                            />
                            <label
                              htmlFor={`${filterName}-${option}`}
                              className="text-sm font-normal leading-none"
                            >
                              {option}
                            </label>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>

            <div className="mt-6 lg:mt-0">
              {loading ? (
                <div className="flex justify-center items-center">
                  <div className="spinner-border animate-spin border-4 border-[#2A254B] border-t-transparent rounded-full w-12 h-12"></div>
                </div>
              ) : (
                <div>
                  {items.length > 0 ? (
                    <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 md:grid-cols-3 lg:gap-x-8">
                      {items.map((item) => (
                        <div key={item._id} className="group">
                          <div className="w-[300px] h-[300px] mx-auto aspect-h-1 aspect-w-1 overflow-hidden bg-gray-100">
                            <Image
                              src={item.image}
                              alt={item.name}
                              width={500}
                              height={500}
                              className="w-full h-full object-cover object-center"
                            />
                          </div>
                          <div className="mt-4 flex justify-between">
                            <div>
                              <h3 className="font-clash text-xl font-extrabold text-gray-900">
                                {item.name}
                              </h3>
                              <p className="text-sm font-clash text-gray-500">
                                €{item.price}
                              </p>
                              <p className="text-sm font-clash text-gray-500">
                                {item.quantity} Pieces
                              </p>
                            </div>
                          </div>
                          {item._id ? (
                            <>
                              <Link href={`/products/${item._id}`}>
                                <Button
                                  className="w-full transition-transform duration-200 hover:scale-105 active:scale-95 mt-1"
                                  variant="outline"
                                  style={{
                                    fontFamily: "var(--font-clash-reg)",
                                  }}
                                >
                                  View Details
                                </Button>
                              </Link>
                            </>
                          ) : (
                            <Button
                              disabled
                              className="w-full mt-1"
                              variant="outline"
                            >
                              No Details
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                        No Products Found
                      </h2>
                      {query && (
                        <p className="text-gray-500 mb-6">
                          We couldn't find any products matching "
                          {decodeURIComponent(query)}".
                        </p>
                      )}
                      <p>Try adjusting your search or filters.</p>
                    </div>
                  )}
                  <div className="flex justify-center mt-8 font-clash">
                    <Button
                      disabled={page === 1}
                      onClick={() => setPage(page - 1)}
                    >
                      Previous
                    </Button>
                    <span className="mx-4">
                      Page {page} of {totalPages}
                    </span>
                    <Button
                      disabled={page === 2}
                      onClick={() => setPage(page + 1)}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer2 />
    </>
  );
}

export default function ProductListing() {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <ProductList />
    </React.Suspense>
  );
}