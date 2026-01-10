import { useState, useRef, useEffect } from "react";
import type { FC } from "react";
import { Wrench, Tag, Clock, PlayCircle, CheckCircle, History, Send, User } from "lucide-react";
import type { MaintenanceRequest, MaintenanceStatus } from "@/types/maintenance.types";
import { FormModal } from "@/components/shared/modals/form-modal";
import { Button } from "@/components/shared/button";
import { MaintenancePriorityBadge, MaintenanceStatusBadge } from "@/components/shared/status-badge";
import { TabToggle } from "@/components/shared/navigation/tab-toggle/TabToggle";
import { useMaintenanceComments, useCreateMaintenanceComment } from "@/hooks/maintenance/useMaintenanceComments";


interface RequestDetailModalProps {
  isOpen: boolean;
  request: MaintenanceRequest | null;
  onClose: () => void;
  onStatusUpdate: (id: string, status: MaintenanceStatus) => void;
}

export const RequestDetailModal: FC<RequestDetailModalProps> = ({
  isOpen,
  request,
  onClose,
  onStatusUpdate,
}) => {
  const [activeTab, setActiveTab] = useState<"details" | "history">("details");
  const [newComment, setNewComment] = useState("");

  // Comments Logic
  const { data: comments = [], isLoading: commentsLoading } = useMaintenanceComments(request?.id || "");
  const createCommentMutation = useCreateMaintenanceComment();
  const commentsEndRef = useRef<HTMLDivElement>(null);

  const handleSendComment = () => {
    if (!request || !newComment.trim()) return;

    createCommentMutation.mutate({
      requestId: request.id,
      message: newComment
    }, {
      onSuccess: () => {
        setNewComment("");
      }
    });
  };

  useEffect(() => {
    // Reset to details tab when request changes
    if (isOpen) {
      setActiveTab("details");
    }
  }, [request?.id, isOpen]);

  useEffect(() => {
    if (activeTab === "history" && commentsEndRef.current) {
      commentsEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [comments, activeTab]);

  if (!request) return null;

  const footer = (
    <div className="flex gap-3">
      <Button
        variant="secondary"
        onClick={onClose}
        className="flex-1 bg-ds-accent-light dark:bg-ds-accent-dark hover:bg-ds-muted-light dark:hover:bg-ds-muted-dark text-ds-primary-light dark:text-ds-primary-dark"
      >
        Kapat
      </Button>
      {request.status === "New" && (
        <Button
          onClick={() => onStatusUpdate(request.id, "In Progress")}
          leftIcon={<PlayCircle className="w-4 h-4" />}
          className="flex-1 bg-ds-in-warning-600 hover:bg-ds-in-warning-500 shadow-lg shadow-ds-in-warning-900/20"
        >
          İşleme Al
        </Button>
      )}
      {request.status === "In Progress" && (
        <Button
          onClick={() => onStatusUpdate(request.id, "Completed")}
          leftIcon={<CheckCircle className="w-4 h-4" />}
          className="flex-1 bg-ds-in-success-600 hover:bg-ds-in-success-500 shadow-lg shadow-ds-in-success-900/20"
        >
          Tamamla
        </Button>
      )}
      <Button className="flex-1">Düzenle</Button>
    </div>
  );

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      title="Talep Detayları"
      titleIcon={<Wrench className="w-5 h-5 text-ds-in-sky-500" />}
      footer={footer}
      maxWidth="lg"
    >
      <div className="space-y-6">
        <TabToggle
          items={[
            { id: "details", label: "Detaylar", icon: <Wrench className="w-4 h-4" /> },
            { id: "history", label: "Aktivite Günlüğü", icon: <History className="w-4 h-4" /> },
          ]}
          activeTab={activeTab}
          onChange={setActiveTab}
          className="w-full mb-4"
        />

        {activeTab === "details" ? (
          <>
            <div>
              <div className="flex justify-between items-start gap-4 mb-2">
                <h4 className="text-lg font-semibold text-ds-primary-light dark:text-ds-primary-dark leading-tight">
                  {request.title}
                </h4>
                <MaintenancePriorityBadge priority={request.priority} />
              </div>
              <div className="flex items-center gap-2 text-ds-secondary-light dark:text-ds-secondary-dark text-sm">
                <Tag className="w-4 h-4 text-ds-in-sky-500" />
                <span>{request.category}</span>
              </div>
            </div>

            <div className="bg-ds-background-light dark:bg-ds-background-dark rounded-xl p-4 flex items-center gap-4 border border-ds-border-light dark:border-ds-border-dark">
              <img
                src={request.avatar}
                className="w-12 h-12 rounded-full ring-2 ring-ds-border-light dark:ring-ds-border-dark"
                alt="User"
              />
              <div>
                <p className="text-ds-primary-light dark:text-ds-primary-dark font-medium text-base">
                  {request.user}
                </p>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  <span className="flex items-center gap-1 px-2 py-0.5 bg-ds-background-light dark:bg-ds-background-dark border border-ds-border-light dark:border-ds-border-dark rounded text-xs text-ds-secondary-light dark:text-ds-secondary-dark font-mono">
                    {request.buildingName} - Daire {request.unit}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-ds-in-sky-500/5 border border-ds-in-sky-500/10 rounded-xl p-4">
              <p className="text-xs text-ds-muted-light dark:text-ds-muted-dark font-medium uppercase mb-2 tracking-wide">
                Açıklama
              </p>
              <p className={`text-sm leading-relaxed ${request.description ? 'text-ds-primary-light dark:text-ds-primary-dark' : 'text-ds-muted-light dark:text-ds-muted-dark italic opacity-50'}`}>
                {request.description || "Talep açıklaması belirtilmemiş."}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-ds-background-light dark:bg-ds-background-dark p-4 rounded-xl border border-ds-border-light dark:border-ds-border-dark">
                <p className="text-ds-muted-light dark:text-ds-muted-dark text-xs font-medium mb-1 uppercase tracking-wide">
                  Oluşturulma
                </p>
                <div className="flex items-center gap-2 text-ds-primary-light dark:text-ds-primary-dark text-sm font-medium">
                  <Clock className="w-4 h-4 text-ds-muted-light dark:text-ds-muted-dark" />
                  {request.date}
                </div>
              </div>
              <div className="bg-ds-background-light dark:bg-ds-background-dark p-4 rounded-xl border border-ds-border-light dark:border-ds-border-dark">
                <p className="text-ds-muted-light dark:text-ds-muted-dark text-xs font-medium mb-1 uppercase tracking-wide">
                  Durum
                </p>
                <div className="flex items-center gap-2 text-ds-primary-light dark:text-ds-primary-dark text-sm font-medium">
                  <MaintenanceStatusBadge status={request.status} />
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col h-[400px]">
            <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
              {commentsLoading ? (
                <div className="text-center py-4 text-ds-muted-light">Yükleniyor...</div>
              ) : comments.length === 0 ? (
                <div className="text-center py-8 text-ds-muted-light italic">Henüz aktivite yok.</div>
              ) : (
                comments.map((comment: any) => (
                  <div key={comment.id} className={`flex gap-3 ${comment.isSystem ? 'justify-center opacity-75' : ''}`}>
                    {!comment.isSystem && (
                      <div className="w-8 h-8 rounded-full bg-ds-muted-light/20 flex items-center justify-center flex-shrink-0">
                        {comment.authorAvatar ? (
                          <img src={comment.authorAvatar} alt="" className="w-8 h-8 rounded-full" />
                        ) : (
                          <User className="w-4 h-4 text-ds-muted-light" />
                        )}
                      </div>
                    )}
                    <div className={`flex flex-col ${comment.isSystem ? 'items-center text-center w-full' : 'flex-1'}`}>
                      <div className="flex items-center gap-2 mb-1">
                        {!comment.isSystem && <span className="text-sm font-medium text-ds-primary-light dark:text-ds-primary-dark">{comment.authorName || "Kullanıcı"}</span>}
                        <span className="text-xs text-ds-muted-light">{new Date(comment.createdAt).toLocaleString('tr-TR')}</span>
                      </div>
                      <div className={`text-sm ${comment.isSystem ? 'text-ds-muted-light italic bg-ds-muted-light/10 px-3 py-1 rounded-full' : 'text-ds-secondary-light dark:text-ds-secondary-dark bg-ds-background-light dark:bg-ds-background-dark p-3 rounded-lg border border-ds-border-light dark:border-ds-border-dark'}`}>
                        {comment.message}
                      </div>
                    </div>
                  </div>
                ))
              )}
              <div ref={commentsEndRef} />
            </div>

            <div className="mt-4 pt-4 border-t border-ds-border-light dark:border-ds-border-dark flex gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Yorum yaz..."
                className="flex-1 bg-ds-background-light dark:bg-ds-background-dark border border-ds-border-light dark:border-ds-border-dark rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-ds-primary focus:outline-none dark:text-white"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendComment();
                  }
                }}
              />
              <Button
                onClick={handleSendComment}
                disabled={!newComment.trim() || createCommentMutation.isPending}
                className="px-4"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </FormModal>
  );
};

