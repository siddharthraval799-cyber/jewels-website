import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, Edit2, Loader2, GripVertical, Image as ImageIcon } from "lucide-react";
import { api, type Banner } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AdminBanners() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);

  const [formData, setFormData] = useState<Partial<Banner>>({
    imageUrl: "",
    subtitle: "",
    title: "",
    description: "",
    cta: "Shop Now",
    link: "/products",
    displayOrder: 0,
  });

  const { data, isLoading } = useQuery({
    queryKey: ["adminBanners"],
    queryFn: api.admin.banners,
  });

  const uploadMutation = useMutation({
    mutationFn: (file: File) => api.upload(file),
    onSuccess: (res) => {
      setFormData(prev => ({ ...prev, imageUrl: res.url }));
      toast({ title: "Image uploaded successfully" });
    },
    onError: (err: Error) => {
      toast({ title: "Upload failed", description: err.message, variant: "destructive" });
    }
  });

  const createMutation = useMutation({
    mutationFn: (banner: Partial<Banner>) => api.admin.createBanner(banner),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminBanners"] });
      toast({ title: "Banner created successfully" });
      setIsDialogOpen(false);
    },
    onError: (err: Error) => toast({ title: "Failed to create banner", description: err.message, variant: "destructive" }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, banner }: { id: number; banner: Partial<Banner> }) => api.admin.updateBanner(id, banner),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminBanners"] });
      toast({ title: "Banner updated successfully" });
      setIsDialogOpen(false);
    },
    onError: (err: Error) => toast({ title: "Failed to update banner", description: err.message, variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.admin.deleteBanner(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminBanners"] });
      toast({ title: "Banner deleted successfully" });
    },
    onError: (err: Error) => toast({ title: "Failed to delete banner", description: err.message, variant: "destructive" }),
  });

  const handleOpenDialog = (banner?: Banner) => {
    if (banner) {
      setEditingBanner(banner);
      setFormData(banner);
    } else {
      setEditingBanner(null);
      setFormData({
        imageUrl: "",
        subtitle: "",
        title: "",
        description: "",
        cta: "Shop Now",
        link: "/products",
        displayOrder: (data?.banners?.length || 0) + 1,
      });
    }
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.title || !formData.imageUrl) {
      toast({ title: "Error", description: "Image and title are required", variant: "destructive" });
      return;
    }

    if (editingBanner) {
      updateMutation.mutate({ id: editingBanner.id, banner: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  if (isLoading) {
    return <div className="p-8 flex justify-center"><Loader2 className="w-8 h-8 animate-spin" /></div>;
  }

  const banners = data?.banners || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Hero Banners</h2>
          <p className="text-muted-foreground">Manage the sliding banners on the homepage.</p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="mr-2 h-4 w-4" /> Add Banner
        </Button>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]"></TableHead>
              <TableHead>Image</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Link</TableHead>
              <TableHead>Order</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {banners.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No banners found. Add one to get started.
                </TableCell>
              </TableRow>
            ) : (
              banners.map((banner) => (
                <TableRow key={banner.id}>
                  <TableCell><GripVertical className="h-4 w-4 text-muted-foreground" /></TableCell>
                  <TableCell>
                    <div className="h-16 w-32 rounded overflow-hidden bg-muted">
                      <img src={banner.imageUrl} alt={banner.title} className="h-full w-full object-cover" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{banner.title}</div>
                    <div className="text-xs text-muted-foreground">{banner.subtitle}</div>
                  </TableCell>
                  <TableCell className="text-sm">{banner.link}</TableCell>
                  <TableCell>{banner.displayOrder}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(banner)}>
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => {
                        if (confirm("Are you sure you want to delete this banner?")) {
                          deleteMutation.mutate(banner.id);
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingBanner ? "Edit Banner" : "Add Banner"}</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Banner Image (Desktop & Mobile)</Label>
                  <div className="flex flex-col gap-2">
                    {formData.imageUrl ? (
                      <div className="relative aspect-video rounded overflow-hidden border">
                        <img src={formData.imageUrl} className="object-cover w-full h-full" alt="Preview" />
                        <Button 
                          variant="destructive" 
                          size="icon" 
                          className="absolute top-2 right-2 h-6 w-6"
                          onClick={() => setFormData({ ...formData, imageUrl: "" })}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center w-full">
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <ImageIcon className="w-8 h-8 mb-2 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">Click to upload</p>
                          </div>
                          <input 
                            type="file" 
                            className="hidden" 
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) uploadMutation.mutate(file);
                            }}
                          />
                        </label>
                      </div>
                    )}
                    {uploadMutation.isPending && <p className="text-xs text-primary animate-pulse">Uploading...</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Display Order</Label>
                  <Input 
                    type="number" 
                    value={formData.displayOrder} 
                    onChange={e => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })} 
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Subtitle (Small text above title)</Label>
                  <Input 
                    value={formData.subtitle || ""} 
                    onChange={e => setFormData({ ...formData, subtitle: e.target.value })} 
                    placeholder="e.g. The Heritage Collection"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Main Title</Label>
                  <Input 
                    value={formData.title || ""} 
                    onChange={e => setFormData({ ...formData, title: e.target.value })} 
                    placeholder="e.g. Timeless Elegance"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Input 
                    value={formData.description || ""} 
                    onChange={e => setFormData({ ...formData, description: e.target.value })} 
                    placeholder="Brief description below title"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label>Button Text</Label>
                    <Input 
                      value={formData.cta || ""} 
                      onChange={e => setFormData({ ...formData, cta: e.target.value })} 
                      placeholder="e.g. Shop Now"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Button Link</Label>
                    <Input 
                      value={formData.link || ""} 
                      onChange={e => setFormData({ ...formData, link: e.target.value })} 
                      placeholder="/products"
                    />
                  </div>
                </div>
              </div>
            </div>

            <Button 
              className="w-full mt-4" 
              onClick={handleSave}
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {createMutation.isPending || updateMutation.isPending ? "Saving..." : "Save Banner"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
