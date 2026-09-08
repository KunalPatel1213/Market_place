"use client";

import { Filter, PackageSearch, Search } from "lucide-react";
import { useMemo, useState } from "react";
import FilterSidebar from "@/components/FilterSidebar";
import Navbar from "@/components/Navbar";
import ProductCard, { ProductSkeleton } from "@/components/ProductCard";
import { products } from "@/data/products";

export default function MarketplacePage() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [price, setPrice] = useState(10000);
  const [sort, setSort] = useState("newest");
  const [query, setQuery] = useState("");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const filteredProducts = useMemo(() => {
    const result = products.filter((product) => (selectedCategories.length === 0 || selectedCategories.includes(product.category)) && product.price <= price && product.name.toLowerCase().includes(query.toLowerCase()));
    return [...result].sort((a, b) => sort === "low" ? a.price - b.price : sort === "high" ? b.price - a.price : sort === "popular" ? b.reviews - a.reviews : b.id - a.id);
  }, [price, query, selectedCategories, sort]);
  const clearFilters = () => { setSelectedCategories([]); setPrice(10000); setSort("newest"); setQuery(""); };
  const toggleCategory = (category: string) => setSelectedCategories((current) => current.includes(category) ? current.filter((item) => item !== category) : [...current, category]);
  const filterProps = { selectedCategories, onCategoryChange: toggleCategory, price, onPriceChange: setPrice, sort, onSortChange: setSort, onClear: clearFilters };

  return <><Navbar activeLink="marketplace" /><main className="min-h-screen bg-base"><section className="bg-soft/70 px-5 py-12 text-center sm:px-8 lg:py-16"><p className="text-sm font-bold uppercase tracking-[0.16em] text-secondary">A little more meaningful</p><h1 className="mt-3 text-4xl font-bold tracking-tight text-primary sm:text-5xl">Explore handmade treasures from local artisans</h1><p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-primary/65">Meet the makers behind thoughtful pieces, small-batch goods, and everyday objects made with care.</p></section><div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10 lg:py-12"><div className="mb-7 flex flex-col gap-4 md:flex-row md:items-center md:justify-between"><div><p className="text-sm text-primary/60">Showing <span className="font-bold text-primary">{filteredProducts.length}</span> of {products.length} products</p></div><div className="flex gap-3"><label className="flex flex-1 items-center gap-2 rounded-full border border-primary/15 bg-white px-4 py-2.5 text-primary/55 md:w-72 md:flex-none"><Search size={17} /><span className="sr-only">Search products</span><input value={query} onChange={(event) => setQuery(event.target.value)} type="search" placeholder="Search the marketplace" className="w-full bg-transparent text-sm text-primary outline-none placeholder:text-primary/50" /></label><button type="button" onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)} className="inline-flex items-center gap-2 rounded-full border border-primary/20 px-4 py-2.5 text-sm font-bold text-primary lg:hidden"><Filter size={17} /> Filters</button></div></div>{isMobileFilterOpen && <div className="mb-7 lg:hidden"><FilterSidebar {...filterProps} mobile /></div>}<div className="grid items-start gap-7 lg:grid-cols-[230px_1fr]"><FilterSidebar {...filterProps} /><div>{isLoading ? <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">{Array.from({ length: 8 }).map((_, index) => <ProductSkeleton key={index} />)}</div> : filteredProducts.length > 0 ? <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">{filteredProducts.map((product) => <ProductCard key={product.id} product={product} />)}</div> : <div className="rounded-2xl border border-primary/10 bg-white px-6 py-20 text-center"><PackageSearch className="mx-auto text-secondary" size={44} /><h2 className="mt-5 text-2xl font-bold text-primary">No products found</h2><p className="mt-2 text-primary/60">Try widening your filters or searching for another handmade treasure.</p><button type="button" onClick={clearFilters} className="mt-6 rounded-lg bg-primary px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-secondary">Clear filters</button></div>}<div className="mt-10 text-center"><button type="button" onClick={() => setIsLoading(!isLoading)} className="rounded-lg border border-secondary px-6 py-3 text-sm font-bold text-primary transition-all duration-300 hover:bg-soft">{isLoading ? "Show products" : "Load more products"}</button></div></div></div></div></main></>;
}
