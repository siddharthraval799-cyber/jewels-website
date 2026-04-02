import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { format } from "date-fns";
import { api, CustomInquiry } from "@/lib/api";
import { 
  Trash2, 
  CheckCircle,
  Clock,
  ExternalLink,
  MessageSquare
} from "lucide-react";

const AdminCustomInquiries = () => {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "custom-inquiries"],
    queryFn: api.admin.customInquiries,
  });

  const markReadMutation = useMutation({
    mutationFn: api.admin.markCustomInquiryRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "custom-inquiries"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: api.admin.deleteCustomInquiry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "custom-inquiries"] });
      toast.success("Inquiry deleted successfully");
    },
    onError: () => toast.error("Failed to delete inquiry"),
  });

  const handleMarkRead = (id: number) => {
    markReadMutation.mutate(id);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this custom inquiry?")) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-aurum/20 border-t-aurum rounded-full animate-spin"></div>
      </div>
    );
  }

  const inquiries = data?.inquiries || [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Custom Jewellery Inquiries</h2>
        <p className="text-muted-foreground">
          View and manage customized jewellery requests from your customers.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {inquiries.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium">No inquiries received yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-[#FAF9F6] text-gray-700 font-medium">
                <tr>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Budget</th>
                  <th className="px-6 py-4">Message & Design Idea</th>
                  <th className="px-6 py-4">Reference Image</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {inquiries.map((inquiry: CustomInquiry) => (
                  <tr 
                    key={inquiry.id}
                    className={`hover:bg-gray-50/50 transition-colors ${!inquiry.read ? 'bg-orange-50/30' : ''}`}
                  >
                    <td className="px-6 py-4">
                      {inquiry.read ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                          <CheckCircle className="w-3.5 h-3.5" /> Reviewed
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                          <Clock className="w-3.5 h-3.5" /> Pending
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                      {format(new Date(inquiry.created_at), "MMM d, yyyy")}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{inquiry.name}</div>
                      <div className="text-gray-500">{inquiry.phone}</div>
                      {inquiry.email && <div className="text-gray-500">{inquiry.email}</div>}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {inquiry.budget || "-"}
                    </td>
                    <td className="px-6 py-4 min-w-[250px]">
                      <p className="text-gray-700 whitespace-pre-wrap">{inquiry.message}</p>
                    </td>
                    <td className="px-6 py-4">
                      {inquiry.imageUrl ? (
                        <a 
                          href={inquiry.imageUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="block relative group rounded overflow-hidden border border-gray-200"
                        >
                          <img 
                            src={inquiry.imageUrl} 
                            alt="Reference" 
                            className="w-20 h-20 object-cover"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <ExternalLink className="w-5 h-5 text-white" />
                          </div>
                        </a>
                      ) : (
                        <span className="text-gray-400 italic">No image provided</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {!inquiry.read && (
                          <button
                            onClick={() => handleMarkRead(inquiry.id)}
                            className="p-2 text-gray-400 hover:text-aurum hover:bg-aurum/10 rounded-lg transition-colors"
                            title="Mark as reviewed"
                          >
                            <CheckCircle className="w-5 h-5" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(inquiry.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete inquiry"
                        >
                          <Trash2 className="w-5 h-5" />
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
  );
};

export default AdminCustomInquiries;
