'use client';
import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { SlidersHorizontal, Grid3x3, List, Loader2 } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import FilterSidebar from '@/components/FilterSidebar';
import { ProductSkeleton } from '@/components/LoadingSkeleton';
import api from '@/lib/axios';

function ShopContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [view, setView] = useState('grid');

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/products?${searchParams.toString()}&limit=12`);
      setProducts(data.products);
      setPagination(data.pagination);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [searchParams]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const setPage = (p) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', p);
    router.push(`/shop?${params.toString()}`);
  };

  const activeFiltersCount = [...searchParams.entries()]
    .filter(([k]) => !['page', 'sort'].includes(k)).length;

  return (
    <div className="pt-28 pb-12 max-w-7xl mx-auto px-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900">
            {searchParams.get('search')
              ? `Results for "${searchParams.get('search')}"`
              : searchParams.get('brand')
                ? searchParams.get('brand')
                : searchParams.get('category')
                  ? searchParams.get('category')
                  : 'All Products'}
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">{pagination.total} products found</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Mobile filter button */}
          <button onClick={() => setSidebarOpen(true)}
            className="md:hidden flex items-center gap-2 btn-outline !py-2 !px-3 !text-sm">
            <SlidersHorizontal size={16} />
            Filters
            {activeFiltersCount > 0 && (
              <span className="w-5 h-5 bg-pink-600 text-white text-[10px] rounded-full flex items-center justify-center">{activeFiltersCount}</span>
            )}
          </button>
          {/* View toggle */}
          <div className="hidden md:flex items-center border-2 border-gray-200 rounded-xl overflow-hidden">
            {[['grid', <Grid3x3 size={16} />], ['list', <List size={16} />]].map(([v, icon]) => (
              <button key={v} onClick={() => setView(v)}
                className={`p-2 transition-colors ${view === v ? 'bg-pink-600 text-white' : 'text-gray-500 hover:bg-gray-50'}`}>
                {icon}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Desktop Sidebar */}
        <div className="hidden md:block w-64 flex-shrink-0">
          <div className="sticky top-28">
            <FilterSidebar />
          </div>
        </div>

        {/* Mobile sidebar drawer */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
            <div className="absolute right-0 top-0 bottom-0 w-80 bg-white overflow-y-auto p-4">
              <FilterSidebar onClose={() => setSidebarOpen(false)} />
            </div>
          </div>
        )}

        {/* Products */}
        <div className="flex-1">
          {loading ? (
            <div className={`grid gap-4 ${view === 'grid' ? 'grid-cols-2 md:grid-cols-3' : 'grid-cols-1'}`}>
              {Array(12).fill(0).map((_, i) => <ProductSkeleton key={i} />)}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">No products found</h3>
              <p className="text-gray-500 mb-6">Try adjusting your filters or search terms</p>
              <button onClick={() => router.push('/shop')} className="btn-primary">Clear Filters</button>
            </div>
          ) : (
            <>
              <div className={`grid gap-4 ${view === 'grid' ? 'grid-cols-2 md:grid-cols-3' : 'grid-cols-1'}`}>
                {products.map(p => <ProductCard key={p._id} product={p} />)}
              </div>

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="flex justify-center gap-2 mt-10">
                  <button disabled={pagination.page === 1}
                    onClick={() => setPage(pagination.page - 1)}
                    className="px-4 py-2 rounded-xl border-2 border-gray-200 text-sm font-medium hover:border-pink-400 disabled:opacity-40 transition-colors">
                    Previous
                  </button>
                  {Array.from({ length: pagination.pages }, (_, i) => i + 1)
                    .filter(p => Math.abs(p - pagination.page) <= 2)
                    .map(p => (
                      <button key={p} onClick={() => setPage(p)}
                        className={`w-10 h-10 rounded-xl text-sm font-medium transition-all
                          ${p === pagination.page ? 'bg-pink-600 text-white shadow-lg' : 'border-2 border-gray-200 hover:border-pink-400'}`}>
                        {p}
                      </button>
                    ))}
                  <button disabled={pagination.page === pagination.pages}
                    onClick={() => setPage(pagination.page + 1)}
                    className="px-4 py-2 rounded-xl border-2 border-gray-200 text-sm font-medium hover:border-pink-400 disabled:opacity-40 transition-colors">
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={
      <div className="pt-28 flex flex-col items-center justify-center min-vh-50">
        <Loader2 className="animate-spin text-pink-500 mb-4" size={48} />
        <p className="text-gray-500 font-medium font-playfair animate-pulse">Summoning the Glow... ✨</p>
      </div>
    }>
      <ShopContent />
    </Suspense>
  );
}