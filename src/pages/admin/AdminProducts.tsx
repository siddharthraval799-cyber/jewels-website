import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { Product, Category } from "@/lib/api";
import { Plus, Pencil, Trash2, Search, X, Loader2, Upload, XCircle } from "lucide-react";
import { toast } from "sonner";

const emptyProduct = {
  name: "", category: "", weight: 0, purity: "22K", makingCharges: 0,
  description: "", images: [] as string[], featured: false, bestSeller: false, newArrival: false,
  attributes: {} as Record<string, string[]>
};

const AdminProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState(emptyProduct);
  const [isUploading, setIsUploading] = useState(false);

  // Dynamic Attribute State for the UI
  const [attrKey, setAttrKey] = useState("");
  const [attrVals, setAttrVals] = useState("");

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      const newImageUrls = [...form.images];
      for (let i = 0; i < files.length; i++) {
        const res = await api.upload(files[i]);
        newImageUrls.push(res.url);
      }
      setForm({ ...form, images: newImageUrls });
      toast.success("Images uploaded successfully");
    } catch (err: any) {
      toast.error(err.message || "Failed to upload images");
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...form.images];
    newImages.splice(index, 1);
    setForm({ ...form, images: newImages });
  };

  const load = () => {
    api.admin.products().then(({ products }) => setProducts(products || []));
    api.categories.list().then(({ categories }) => setCategories(categories || []));
  };

  useEffect(load, []);

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = async () => {
    if (!form.name || !form.category || !form.weight) {
      toast.error("Name, category, and weight are required");
      return;
    }
    try {
      if (editing) {
        await api.products.update(editing, form);
        toast.success("Product updated");
      } else {
        await api.products.create(form);
        toast.success("Product created");
      }
      setShowForm(false);
      setEditing(null);
      setForm(emptyProduct);
      load();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to save product");
    }
  };

  const handleEdit = (p: Product) => {
    setForm({
      name: p.name, category: p.category, weight: p.weight, purity: p.purity || "22K",
      makingCharges: p.makingCharges, description: p.description, images: p.images || [],
      featured: !!p.featured, bestSeller: !!p.bestSeller, newArrival: !!p.newArrival,
      attributes: p.attributes || {}
    });
    setEditing(p.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    try {
      await api.products.delete(id);
      toast.success("Product deleted");
      load();
    } catch {
      toast.error("Failed to delete");
    }
  };

  const addAttribute = () => {
     if (!attrKey || !attrVals) return toast.error("Provide a Category Name and Values");
     const parsedVals = attrVals.split(',').map(s => s.trim()).filter(Boolean);
     if(parsedVals.length === 0) return toast.error("Provide at least one value");
     
     setForm({ 
       ...form, 
       attributes: { ...form.attributes, [attrKey]: parsedVals }
     });
     setAttrKey("");
     setAttrVals("");
  };

  const removeAttribute = (key: string) => {
     const newAttrs = { ...form.attributes };
     delete newAttrs[key];
     setForm({ ...form, attributes: newAttrs });
  };

  const inputClass = "w-full border border-border bg-background px-3 py-2.5 text-sm font-body focus:border-primary focus:outline-none transition-colors";

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl text-foreground">Products</h1>
        <button
          onClick={() => { setForm(emptyProduct); setEditing(null); setShowForm(true); }}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 text-xs tracking-wider uppercase font-body font-semibold hover:bg-gold-dark transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          className="w-full border border-border bg-background pl-10 pr-4 py-2.5 text-sm font-body focus:border-primary focus:outline-none"
          placeholder="Search products..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Product Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-background border border-border p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display text-lg">{editing ? "Edit Product" : "Add Product"}</h2>
              <button onClick={() => setShowForm(false)}><X className="w-5 h-5 text-muted-foreground" /></button>
            </div>
            <div className="space-y-4">
              
              {/* Basic Details */}
              <div className="grid md:grid-cols-2 gap-4">
                 <div className="md:col-span-2">
                   <label className="text-xs font-body uppercase tracking-wider text-muted-foreground mb-1 block">Name *</label>
                   <input className={inputClass} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                 </div>
                 <div>
                   <label className="text-xs font-body uppercase tracking-wider text-muted-foreground mb-1 block">Category *</label>
                   <select className={inputClass} value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                     <option value="">Select</option>
                     {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                   </select>
                 </div>
                 <div>
                   <label className="text-xs font-body uppercase tracking-wider text-muted-foreground mb-1 block">Weight (g) *</label>
                   <input type="number" step="0.01" className={inputClass} value={form.weight} onChange={e => setForm({ ...form, weight: parseFloat(e.target.value) || 0 })} />
                 </div>
                 <div>
                   <label className="text-xs font-body uppercase tracking-wider text-muted-foreground mb-1 block">Purity</label>
                   <select className={inputClass} value={form.purity} onChange={e => setForm({ ...form, purity: e.target.value })}>
                     <option value="22K">22K</option>
                     <option value="24K">24K</option>
                     <option value="18K">18K</option>
                   </select>
                 </div>
                 <div>
                   <label className="text-xs font-body uppercase tracking-wider text-muted-foreground mb-1 block">Making Charges (₹)</label>
                   <input type="number" className={inputClass} value={form.makingCharges} onChange={e => setForm({ ...form, makingCharges: parseInt(e.target.value) || 0 })} />
                 </div>
              </div>
              
              {/* Dynamic Filter Attributes (JSON) */}
              <div className="bg-muted/30 p-4 border border-border mt-4">
                 <h3 className="text-sm font-semibold mb-2">Filter Attributes (Dynamic)</h3>
                 <p className="text-[10px] text-muted-foreground mb-3">Add tags like Design Types, Collection, Occasion. These appear directly in the unified store filters.</p>
                 
                 <div className="flex gap-2 mb-4">
                    <input 
                      placeholder="Category (e.g., Occasion)" 
                      className="border border-border px-3 py-1.5 text-xs font-body flex-1"
                      value={attrKey} onChange={e => setAttrKey(e.target.value)}
                    />
                    <input 
                      placeholder="Values (comma separated, e.g., Wedding, Anniversary)" 
                      className="border border-border px-3 py-1.5 text-xs font-body flex-[2]"
                      value={attrVals} onChange={e => setAttrVals(e.target.value)}
                    />
                    <button onClick={addAttribute} className="bg-primary px-4 py-1.5 text-white text-xs whitespace-nowrap">Add Filter</button>
                 </div>
                 
                 <div className="flex flex-col gap-2">
                    {Object.entries(form.attributes).map(([key, vals]) => (
                       <div key={key} className="flex justify-between items-center bg-white border border-border px-3 py-2 text-xs">
                          <div>
                             <span className="font-semibold text-primary mr-2">{key}:</span>
                             <span className="text-muted-foreground">{vals.join(', ')}</span>
                          </div>
                          <button onClick={() => removeAttribute(key)} className="text-destructive"><Trash2 className="w-3 h-3" /></button>
                       </div>
                    ))}
                 </div>
              </div>
              
              <div>
                <label className="text-xs font-body uppercase tracking-wider text-muted-foreground mb-2 block mt-4">Product Images</label>
                <div className="grid grid-cols-4 md:grid-cols-5 gap-3 mb-3">
                  {form.images.map((img, i) => (
                    <div key={i} className="relative aspect-square border border-border rounded overflow-hidden group">
                      <img src={img} alt={`Product ${i}`} className="w-full h-full object-cover" />
                      <button 
                        onClick={() => removeImage(i)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Remove Image"
                      >
                        <XCircle className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  <label className="aspect-square border-2 border-dashed border-border flex flex-col items-center justify-center cursor-pointer hover:bg-muted/30 transition-colors text-muted-foreground">
                    {isUploading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <Upload className="w-5 h-5 mb-1 text-primary/70" />
                        <span className="text-[10px] uppercase font-body">Upload</span>
                      </>
                    )}
                    <input type="file" accept="image/*" multiple className="hidden" onChange={handleFileUpload} disabled={isUploading} />
                  </label>
                </div>
              </div>

              <div>
                <label className="text-xs font-body uppercase tracking-wider text-muted-foreground mb-1 block">Description</label>
                <textarea className={`${inputClass} resize-none h-20`} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
              </div>
              
              <div className="flex flex-wrap gap-4 pb-4 border-b border-border/50">
                {(["featured", "bestSeller", "newArrival"] as const).map(key => (
                  <label key={key} className="flex items-center gap-2 text-sm font-body cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!form[key]}
                      onChange={e => setForm({ ...form, [key]: e.target.checked })}
                      className="accent-primary"
                    />
                    {key === "bestSeller" ? "Best Seller" : key === "newArrival" ? "New Arrival" : "Featured"}
                  </label>
                ))}
              </div>
              
              <button
                onClick={handleSave}
                className="w-full bg-primary text-primary-foreground py-3 text-xs tracking-[0.2em] uppercase font-body font-semibold hover:bg-gold-dark transition-colors mt-4"
              >
                {editing ? "Update Product" : "Create Product"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-background border border-border overflow-x-auto">
        <table className="w-full text-sm font-body">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="text-left px-5 py-3 text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Product</th>
              <th className="text-left px-5 py-3 text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Category</th>
              <th className="text-left px-5 py-3 text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Weight</th>
              <th className="text-left px-5 py-3 text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Making</th>
              <th className="text-left px-5 py-3 text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Filters</th>
              <th className="text-right px-5 py-3 text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => (
              <tr key={p.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                <td className="px-5 py-3 flex items-center gap-3">
                  <div className="w-10 h-10 rounded border border-border overflow-hidden bg-cream shrink-0">
                     {p.images && p.images[0] ? <img src={p.images[0]} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-muted"></div>}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground line-clamp-1 max-w-[200px]">{p.name}</p>
                    <p className="text-[10px] text-muted-foreground">{p.id}</p>
                  </div>
                </td>
                <td className="px-5 py-3 capitalize text-foreground/70">{p.category}</td>
                <td className="px-5 py-3 font-medium">{p.weight}g</td>
                <td className="px-5 py-3">₹{p.makingCharges.toLocaleString("en-IN")}</td>
                <td className="px-5 py-3">
                  <div className="flex flex-col gap-1 text-[10px]">
                     {p.attributes && Object.keys(p.attributes).length > 0 ? (
                       <span className="text-primary font-medium">{Object.keys(p.attributes).length} Categories</span>
                     ) : <span className="text-muted-foreground">None</span>}
                  </div>
                </td>
                <td className="px-5 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => handleEdit(p)} className="p-1.5 text-muted-foreground hover:text-primary transition-colors"><Pencil className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(p.id)} className="p-1.5 text-muted-foreground hover:text-destructive transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="p-8 text-center text-muted-foreground text-sm font-body">No products found</div>
        )}
      </div>
      <p className="text-xs text-muted-foreground font-body mt-3">{filtered.length} of {products.length} products</p>
    </div>
  );
};

export default AdminProducts;
