"use client";

import { Check, ChevronDown, SlidersHorizontal } from "lucide-react";
import { useState } from "react";

export const categoryOptions = ["Pottery", "Textiles & Weaves", "Jewelry", "Home Decor", "Paintings & Art", "Grocery & Essentials", "Others"];

type FilterSidebarProps = {
  selectedCategories: string[];
  onCategoryChange: (category: string) => void;
  price: number;
  onPriceChange: (price: number) => void;
  sort: string;
  onSortChange: (sort: string) => void;
  onClear: () => void;
  mobile?: boolean;
};

export default function FilterSidebar({ selectedCategories, onCategoryChange, price, onPriceChange, sort, onSortChange, onClear, mobile = false }: FilterSidebarProps) {
  const [showCategories, setShowCategories] = useState(true);
  const content = <div className="space-y-7">
    <div><button type="button" onClick={() => setShowCategories(!showCategories)} className="flex w-full items-center justify-between text-sm font-bold text-primary"><span>Categories</span><ChevronDown size={17} className={`transition-transform ${showCategories ? "" : "-rotate-90"}`} /></button>{showCategories && <div className="mt-4 space-y-3">{categoryOptions.map((category) => <label key={category} className="flex cursor-pointer items-center gap-3 text-sm text-primary/75"><input type="checkbox" checked={selectedCategories.includes(category)} onChange={() => onCategoryChange(category)} className="peer sr-only" /><span className={`flex h-4 w-4 items-center justify-center rounded border transition-colors ${selectedCategories.includes(category) ? "border-primary bg-primary text-white" : "border-primary/30 bg-base"}`}><Check size={12} strokeWidth={3} /></span>{category}</label>)}</div>}</div>
    <div><div className="flex items-center justify-between"><span className="text-sm font-bold text-primary">Price range</span><span className="text-sm font-semibold text-secondary">₹{price.toLocaleString("en-IN")}</span></div><input type="range" min="500" max="10000" step="500" value={price} onChange={(event) => onPriceChange(Number(event.target.value))} className="mt-4 h-1.5 w-full cursor-pointer accent-primary" aria-label="Maximum price" /><div className="mt-2 flex justify-between text-xs text-primary/45"><span>₹500</span><span>₹10,000+</span></div></div>
    <div><label htmlFor={`${mobile ? "mobile-" : ""}sort-products`} className="text-sm font-bold text-primary">Sort by</label><select id={`${mobile ? "mobile-" : ""}sort-products`} value={sort} onChange={(event) => onSortChange(event.target.value)} className="mt-3 w-full rounded-lg border border-primary/15 bg-base px-3 py-2.5 text-sm text-primary outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"><option value="newest">Newest</option><option value="low">Price: Low to high</option><option value="high">Price: High to low</option><option value="popular">Most popular</option></select></div>
    <button type="button" onClick={onClear} className="w-full rounded-lg border border-secondary px-4 py-2.5 text-sm font-bold text-primary transition-all duration-300 hover:bg-soft">Clear filters</button>
  </div>;

  if (mobile) return <div className="rounded-2xl border border-primary/10 bg-white p-5"><div className="mb-5 flex items-center gap-2 text-sm font-bold text-primary"><SlidersHorizontal size={17} /> Filter products</div>{content}</div>;
  return <aside className="hidden h-fit rounded-2xl border border-primary/10 bg-white p-6 lg:block" aria-label="Product filters"><div className="mb-6 flex items-center gap-2 text-lg font-bold text-primary"><SlidersHorizontal size={19} /> Filter products</div>{content}</aside>;
}
