"use client";

import { useEffect, useRef, useState } from "react";
import { Plus, Search, Edit, Trash2, X, Package, Image as ImageIcon, Upload, Star, Loader2 } from "lucide-react";
import { API_URL, resolveMediaUrl } from "@/lib/config";
import ConfirmModal from "@/components/ConfirmModal";

type HardwareProductAdmin = {
  id: number;
  name: string;
  slug: string;
  description: string;
  longDescription: string;
  price: number;
  stock: number;
  image: string;
  images: string[];
  isActive: boolean;
  sortOrder: number;
};

const emptyForm = {
  name: "",
  slug: "",
  description: "",
  longDescription: "",
  price: "0.00",
  stock: "0",
  isActive: true,
  sortOrder: "0",
};

async function uploadProductImages(files: File[]): Promise<string[]> {
  const formData = new FormData();
  files.forEach((file) => formData.append("images", file));

  const res = await fetch(`${API_URL}/hardware-products/upload`, {
    method: "POST",
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    body: formData,
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || "Upload failed");
  return data.data.urls as string[];
}

export default function HardwareProductsPage() {
  const [products, setProducts] = useState<HardwareProductAdmin[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [primaryImageIndex, setPrimaryImageIndex] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_URL}/hardware-products`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      if (data.success) setProducts(data.data);
    } catch (err) {
      console.error("Error fetching hardware products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const resetForm = () => {
    setFormData(emptyForm);
    setGalleryImages([]);
    setPrimaryImageIndex(0);
    setIsEdit(false);
    setEditId(null);
  };

  const filteredProducts = products.filter((product) => {
    const term = searchTerm.toLowerCase();
    return (
      product.name?.toLowerCase().includes(term) ||
      product.slug?.toLowerCase().includes(term) ||
      product.description?.toLowerCase().includes(term)
    );
  });

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploading(true);
    try {
      const urls = await uploadProductImages(files);
      setGalleryImages((prev) => [...prev, ...urls]);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removeImage = (index: number) => {
    setGalleryImages((prev) => prev.filter((_, i) => i !== index));
    setPrimaryImageIndex((prev) => {
      if (index === prev) return 0;
      if (index < prev) return prev - 1;
      return prev;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (galleryImages.length === 0) {
      alert("Please upload at least one product image.");
      return;
    }

    setLoading(true);
    try {
      const primaryImage = galleryImages[primaryImageIndex] || galleryImages[0];
      const payload = {
        name: formData.name,
        slug: formData.slug || undefined,
        description: formData.description,
        longDescription: formData.longDescription,
        price: parseFloat(formData.price) || 0,
        stock: parseInt(formData.stock, 10) || 0,
        image: primaryImage,
        images: galleryImages,
        isActive: formData.isActive,
        sortOrder: parseInt(formData.sortOrder, 10) || 0,
      };

      const url = isEdit
        ? `${API_URL}/hardware-products/${editId}`
        : `${API_URL}/hardware-products`;
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        fetchProducts();
        setShowModal(false);
        resetForm();
      } else {
        alert(data.message || "Operation failed");
      }
    } catch {
      alert(isEdit ? "Error updating product" : "Error adding product");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product: HardwareProductAdmin) => {
    const images = product.images?.length ? product.images : product.image ? [product.image] : [];
    setFormData({
      name: product.name,
      slug: product.slug,
      description: product.description || "",
      longDescription: product.longDescription || "",
      price: String(product.price),
      stock: String(product.stock),
      isActive: product.isActive,
      sortOrder: String(product.sortOrder || 0),
    });
    setGalleryImages(images);
    setPrimaryImageIndex(Math.max(0, images.findIndex((img) => img === product.image)));
    setEditId(product.id);
    setIsEdit(true);
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    setDeleteId(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`${API_URL}/hardware-products/${deleteId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      if (data.success) fetchProducts();
      else alert(data.message || "Delete failed");
    } catch {
      alert("Error deleting product");
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
      setDeleteId(null);
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Hardware Products</h1>
          <p className="text-slate-400 mt-1">Manage catalog, pricing, stock, and upload gallery images for the shop slider.</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl font-semibold transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search products..."
          className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-11 pr-4 py-3 text-slate-200 outline-none focus:border-indigo-500"
        />
      </div>

      {loading && products.length === 0 ? (
        <p className="text-slate-400">Loading products...</p>
      ) : (
        <div className="grid gap-4">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-xl bg-slate-800 flex items-center justify-center overflow-hidden">
                  {product.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={resolveMediaUrl(product.image)} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <Package className="w-6 h-6 text-slate-500" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-white">{product.name}</h3>
                    {!product.isActive && (
                      <span className="text-[10px] uppercase tracking-wider bg-rose-950 text-rose-300 px-2 py-0.5 rounded-full">Inactive</span>
                    )}
                  </div>
                  <p className="text-sm text-slate-400 mt-1">{product.slug}</p>
                  <div className="flex flex-wrap gap-3 mt-2 text-sm">
                    <span className="text-indigo-300 font-semibold">${Number(product.price).toFixed(2)}</span>
                    <span className="text-slate-400">Stock: {product.stock}</span>
                    <span className="text-slate-500 flex items-center gap-1">
                      <ImageIcon className="w-3.5 h-3.5" />
                      {product.images?.length || 0} images
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(product)} className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300">
                  <Edit className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(product.id)} className="p-2 rounded-lg bg-rose-950/50 hover:bg-rose-950 text-rose-300">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-slate-800">
              <h2 className="text-xl font-bold text-white">{isEdit ? "Edit Product" : "Add Product"}</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase">Name</label>
                  <input required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="mt-1 w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase">Slug</label>
                  <input value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} placeholder="auto-generated if empty" className="mt-1 w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white" />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase">Short Description</label>
                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={2} className="mt-1 w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase">Long Description</label>
                <textarea value={formData.longDescription} onChange={(e) => setFormData({ ...formData, longDescription: e.target.value })} rows={5} className="mt-1 w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white" />
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase">Price (USD)</label>
                  <input required type="number" min="0" step="0.01" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} className="mt-1 w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase">Stock</label>
                  <input required type="number" min="0" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} className="mt-1 w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase">Sort Order</label>
                  <input type="number" value={formData.sortOrder} onChange={(e) => setFormData({ ...formData, sortOrder: e.target.value })} className="mt-1 w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white" />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase">Gallery Images</label>
                <p className="text-xs text-slate-500 mt-1 mb-3">Upload images for the product slider. Click the star to set the primary image.</p>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                  multiple
                  className="hidden"
                  onChange={handleFileSelect}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="flex items-center gap-2 rounded-lg border border-dashed border-slate-700 bg-slate-950 px-4 py-3 text-sm font-semibold text-slate-300 hover:border-indigo-500 hover:text-white disabled:opacity-50"
                >
                  {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  {uploading ? "Uploading..." : "Upload Images"}
                </button>

                {galleryImages.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {galleryImages.map((url, index) => (
                      <div key={`${url}-${index}`} className="relative group rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={resolveMediaUrl(url)} alt={`Gallery ${index + 1}`} className="w-full h-28 object-cover" />
                        <div className="absolute top-2 right-2 flex gap-1">
                          <button
                            type="button"
                            onClick={() => setPrimaryImageIndex(index)}
                            className={`p-1.5 rounded-full ${index === primaryImageIndex ? "bg-amber-500 text-white" : "bg-black/60 text-white hover:bg-black/80"}`}
                            title="Set as primary"
                          >
                            <Star className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="p-1.5 rounded-full bg-black/60 text-white hover:bg-rose-600"
                            title="Remove"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        {index === primaryImageIndex && (
                          <span className="absolute bottom-2 left-2 text-[10px] font-bold uppercase tracking-wider bg-amber-500 text-white px-2 py-0.5 rounded-full">
                            Primary
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <label className="flex items-center gap-2 text-sm text-slate-300">
                <input type="checkbox" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} />
                Active in shop
              </label>
              <button type="submit" disabled={loading || uploading} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded-xl disabled:opacity-50">
                {isEdit ? "Update Product" : "Create Product"}
              </button>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={confirmDelete}
        title="Delete Product"
        message="Are you sure you want to delete this hardware product? This cannot be undone."
        isLoading={isDeleting}
      />
    </div>
  );
}
