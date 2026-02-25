'use client';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Plus, Pencil, Trash2, Loader2, ImagePlus, X, Check, Search } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import AdminSidebar from '@/components/AdminSidebar';
import { formatPrice } from '@/utils/formatters';
import api from '@/lib/axios';

const CATEGORIES = [
  'Lipstick','Foundation','Eyeshadow','Skincare','Perfume',
  'Haircare','Nailcare','Blush','Mascara','Clothing','Accessories'
];
const BRANDS = ['Lakme','Maybelline','Huda','MAC','Nykaa',"L'Oreal",'Sugar','Colorbar'];

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const fileRef = useRef();

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      title: '', description: '', price: 0, discount: 0, brand: '',
      category: 'Lipstick', stock: 0, bestseller: false, gender: 'Women',
    }
  });

  useEffect(() => { fetchProducts(); }, [search]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const q = search ? `?search=${search}` : '';
      const { data } = await api.get(`/products${q}`);
      setProducts(data.products);
    } finally { setLoading(false); }
  };

  const openAdd = () => {
    setEditing(null);
    reset({ title: '', description: '', price: 0, discount: 0, brand: '',
      category: 'Lipstick', stock: 0, bestseller: false, gender: 'Women',
      sizes: '', colors: '' });
    setShowModal(true);
  };

  const openEdit = (p) => {
    setEditing(p);
    reset({
      title: p.title, description: p.description, price: p.price,
      discount: p.discount || 0, brand: p.brand, category: p.category,
      stock: p.stock, bestseller: p.bestseller, gender: p.gender,
      sizes: p.sizes?.join(',') || '', colors: p.colors?.join(',') || '',
    });
    setShowModal(true);
  };

  const onSubmit = async (d) => {
    setSubmitting(true);
    try {
      const formData = new FormData();
      Object.entries(d).forEach(([k, v]) => {
        if (k === 'bestseller') formData.append(k, v ? 'true' : 'false');
        else if (k !== 'images') formData.append(k, v);
      });
      if (fileRef.current?.files?.length) {
        for (let f of fileRef.current.files) formData.append('images', f);
      }

      if (editing) {
        await api.put(`/products/${editing._id}`, formData);
        toast.success('Product updated!');
      } else {
        await api.post('/products', formData);
        toast.success('Product created!');
      }
      setShowModal(false);
      fetchProducts();
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed');
    } finally { setSubmitting(false); }
  };

  const deleteProduct = async (id) => {
    if (!confirm('Delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success('Product deleted');
      fetchProducts();
    } catch { toast.error('Delete failed'); }
  };

  return (
    <div className="pt-28 pb-12 max-w-7xl mx-auto px-4">
      <div className="flex gap-6">
        <AdminSidebar />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-black text-gray-900">Manage Products</h1>
            <button onClick={openAdd} className="btn-primary flex items-center gap-2">
              <Plus size={18} /> Add Product
            </button>
          </div>

          {/* Search */}
          <div className="glass-card p-3 mb-6 flex items-center gap-2">
            <Search size={18} className="text-gray-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search products..."
              className="flex-1 bg-transparent outline-none text-sm"
            />
          </div>

          {loading ? (
            <div className="flex justify-center py-20"><Loader2 size={36} className="animate-spin text-pink-600" /></div>
          ) : products.length === 0 ? (
            <div className="glass-card p-12 text-center text-gray-500">No products found</div>
          ) : (
            <div className="overflow-x-auto glass-card">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-3 px-4 font-semibold text-gray-600">Product</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-600">Brand</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-600">Category</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-600">Price</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-600">Stock</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p._id} className="border-t border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 relative">
                            {p.images?.[0]?.url && (
                              <Image src={p.images[0].url} alt={p.title} fill className="object-cover" />
                            )}
                          </div>
                          <div className="min-w-0 max-w-[200px]">
                            <p className="font-medium text-gray-800 truncate">{p.title}</p>
                            {p.bestseller && <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded">Bestseller</span>}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{p.brand}</td>
                      <td className="py-3 px-4 text-gray-600">{p.category}</td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-gray-900">{formatPrice(p.price - (p.price * p.discount / 100))}</span>
                        {p.discount > 0 && (
                          <span className="text-xs text-gray-400 line-through ml-2">{formatPrice(p.price)}</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${p.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {p.stock}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1">
                          <button onClick={() => openEdit(p)}
                            className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors">
                            <Pencil size={16} />
                          </button>
                          <button onClick={() => deleteProduct(p._id)}
                            className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition-colors">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-100 p-4 flex items-center justify-between">
              <h2 className="text-xl font-black">{editing ? 'Edit Product' : 'Add New Product'}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Title *</label>
                <input {...register('title', { required: true })} className="input-field" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Description *</label>
                <textarea {...register('description', { required: true })} className="input-field min-h-[100px]" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Brand *</label>
                  <select {...register('brand', { required: true })} className="input-field">
                    {BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Category *</label>
                  <select {...register('category', { required: true })} className="input-field">
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Price (₹) *</label>
                  <input type="number" {...register('price', { required: true, min: 0 })} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Discount %</label>
                  <input type="number" {...register('discount', { min: 0, max: 100 })} className="input-field" defaultValue={0} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Stock *</label>
                  <input type="number" {...register('stock', { required: true, min: 0 })} className="input-field" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Sizes (comma sep)</label>
                  <input {...register('sizes')} placeholder="S, M, L, XL" className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Colors (comma sep)</label>
                  <input {...register('colors')} placeholder="Red, Pink, Nude" className="input-field" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Gender</label>
                  <select {...register('gender')} className="input-field">
                    <option value="Women">Women</option>
                    <option value="Men">Men</option>
                    <option value="Unisex">Unisex</option>
                  </select>
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <input type="checkbox" {...register('bestseller')} id="bestseller" className="accent-pink-600 w-4 h-4" />
                  <label htmlFor="bestseller" className="text-sm font-semibold text-gray-700">Mark as Bestseller</label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Images</label>
                <input
                  ref={fileRef}
                  type="file"
                  multiple
                  accept="image/*"
                  className="input-field !py-2"
                />
                {editing?.images?.length > 0 && (
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {editing.images.map((img, i) => (
                      <div key={i} className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 relative">
                        <Image src={img.url} alt="" fill className="object-cover" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="btn-outline flex-1">
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="btn-primary flex-1 flex items-center justify-center gap-2">
                  {submitting ? <><Loader2 size={18} className="animate-spin"/> Saving...</> : (
                    <><Check size={18} /> {editing ? 'Update' : 'Create'} Product</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}