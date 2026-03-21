import { useEffect, useState, useRef } from "react";
import { api, type CreatorReel } from "@/lib/api";
import { toast } from "sonner";
import { Trash2, Plus, Upload, Loader2, Play, ToggleLeft, ToggleRight } from "lucide-react";

export default function AdminCreatorReels() {
  const [reels, setReels] = useState<CreatorReel[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  
  // New Video Form
  const [file, setFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [caption, setCaption] = useState("");
  const [displayOrder, setDisplayOrder] = useState("0");
  const [isActive, setIsActive] = useState(true);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);

  const fetchReels = () => {
    setLoading(true);
    api.admin.creatorReels()
      .then(res => setReels(res.reels))
      .catch(err => toast.error(err.message || "Failed to load creator reels"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchReels();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return toast.error("Please select a video file");

    setIsUploading(true);
    try {
      // 1. Upload video
      const videoRes = await api.upload(file);
      const videoUrl = videoRes.url;
      
      // 2. Upload thumbnail if exists
      let thumbnailUrl = "";
      if (thumbnailFile) {
        const thumbRes = await api.upload(thumbnailFile);
        thumbnailUrl = thumbRes.url;
      }

      // 3. Create db record
      await api.admin.createCreatorReel({
        videoUrl,
        thumbnailUrl,
        caption,
        active: isActive ? 1 : 0,
        displayOrder: parseInt(displayOrder) || 0
      });
      
      toast.success("Creator Reel added successfully");
      setFile(null);
      setThumbnailFile(null);
      setCaption("");
      setDisplayOrder("0");
      setIsActive(true);
      if (fileInputRef.current) fileInputRef.current.value = "";
      if (thumbnailInputRef.current) thumbnailInputRef.current.value = "";
      fetchReels();
    } catch (err: any) {
      toast.error(err.message || "Failed to add creator reel");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this reel?")) return;
    try {
      await api.admin.deleteCreatorReel(id);
      toast.success("Reel deleted");
      fetchReels();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete reel");
    }
  };

  const handleToggleActive = async (reel: CreatorReel) => {
    try {
      await api.admin.updateCreatorReel(reel.id, { active: reel.active ? 0 : 1 });
      toast.success("Reel status updated");
      fetchReels();
    } catch (err: any) {
      toast.error(err.message || "Failed to update reel status");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl text-foreground">Creator Reels</h2>
      </div>

      {/* Add New Reel Form */}
      <div className="bg-background border border-border p-6 shadow-sm">
        <h3 className="font-display text-lg mb-4 flex items-center gap-2">
          <Plus className="w-5 h-5 text-primary" /> Add New Reel
        </h3>
        <form onSubmit={handleCreate} className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider mb-2 block text-muted-foreground">Video File (MP4) *</label>
              <input 
                type="file" 
                accept="video/*" 
                required 
                ref={fileInputRef}
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="w-full text-sm font-body file:mr-4 file:py-2 file:px-4 file:border-0 file:text-xs file:font-semibold file:uppercase file:tracking-wider file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider mb-2 block text-muted-foreground">Thumbnail Image (Optional)</label>
              <input 
                type="file" 
                accept="image/*" 
                ref={thumbnailInputRef}
                onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)}
                className="w-full text-sm font-body file:mr-4 file:py-2 file:px-4 file:border-0 file:text-xs file:font-semibold file:uppercase file:tracking-wider file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
              />
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider mb-2 block text-muted-foreground">Caption (Shown on Hover)</label>
              <input 
                type="text" 
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="e.g. Glowing in Gold"
                className="w-full border border-border px-4 py-2 text-sm font-body focus:outline-none focus:border-primary"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider mb-2 block text-muted-foreground">Display Order</label>
                <input 
                  type="number" 
                  value={displayOrder}
                  onChange={(e) => setDisplayOrder(e.target.value)}
                  className="w-full border border-border px-4 py-2 text-sm font-body focus:outline-none focus:border-primary"
                />
              </div>
              <div className="flex flex-col justify-end pb-2">
                <button
                  type="button"
                  onClick={() => setIsActive(!isActive)}
                  className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider"
                >
                  {isActive ? <ToggleRight className="text-green-500" /> : <ToggleLeft className="text-muted-foreground" />}
                  {isActive ? "Active" : "Hidden"}
                </button>
              </div>
            </div>
            <button 
              type="submit" 
              disabled={isUploading}
              className="mt-2 w-full bg-primary text-primary-foreground py-2 text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-primary/90 disabled:opacity-50"
            >
              {isUploading ? <><Loader2 className="w-4 h-4 animate-spin"/> Uploading...</> : <><Upload className="w-4 h-4"/> Save Reel</>}
            </button>
          </div>
        </form>
      </div>

      {/* Reel List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {loading ? (
          <div className="col-span-full p-8 text-center text-muted-foreground font-body">Loading reels...</div>
        ) : reels.length === 0 ? (
          <div className="col-span-full p-8 text-center text-muted-foreground font-body bg-background border border-border">No creator reels found.</div>
        ) : (
          reels.map(reel => (
            <div key={reel.id} className={`bg-background border overflow-hidden relative group rounded-md shadow-sm ${reel.active ? 'border-border' : 'border-red-200 opacity-60'}`}>
              <div className="aspect-[9/16] bg-black relative">
                 {reel.thumbnailUrl ? (
                    <img src={reel.thumbnailUrl} alt="Thumbnail" className="w-full h-full object-cover opacity-80" />
                  ) : (
                    <video src={reel.videoUrl} className="w-full h-full object-cover opacity-80" muted />
                  )}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/40">
                      <Play className="w-4 h-4 text-white ml-0.5" />
                    </div>
                  </div>
                  {!reel.active && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] px-2 py-0.5 rounded font-bold uppercase">
                      Hidden
                    </div>
                  )}
              </div>
              <div className="p-3 bg-white text-foreground text-center border-t border-border">
                <p className="text-[10px] uppercase tracking-wider font-semibold truncate">{reel.caption || "No Caption"}</p>
                <p className="text-[10px] text-muted-foreground mt-1">Order: {reel.displayOrder}</p>
              </div>
              
              <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => handleToggleActive(reel)}
                  className="p-2 bg-white text-secondary-foreground rounded-full shadow-md hover:bg-gray-100"
                  title={reel.active ? "Hide Reel" : "Show Reel"}
                >
                  {reel.active ? <ToggleRight className="w-4 h-4 text-green-500" /> : <ToggleLeft className="w-4 h-4" />}
                </button>
                <button 
                  onClick={() => handleDelete(reel.id)}
                  className="p-2 bg-red-600 text-white rounded-full shadow-md hover:bg-red-700"
                  title="Delete Reel"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
