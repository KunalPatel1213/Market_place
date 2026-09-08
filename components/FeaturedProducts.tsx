import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { products } from "@/data/products";

export default function FeaturedProducts() {
  return (
    <section id="featured-products" className="bg-white px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-secondary">Fresh from the makers</p>
            <h2 className="mt-3 text-4xl font-bold tracking-tight text-primary sm:text-5xl">Good things, made by hand.</h2>
            <p className="mt-5 text-lg leading-8 text-primary/65">Shop thoughtful pieces from independent sellers, then buy instantly or save them in your cart.</p>
          </div>
          <Link href="/marketplace" className="inline-flex shrink-0 items-center justify-center rounded-full border border-primary/20 px-5 py-3 text-sm font-bold text-primary transition-colors hover:border-secondary hover:bg-soft">View all products</Link>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {products.slice(0, 4).map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      </div>
    </section>
  );
}