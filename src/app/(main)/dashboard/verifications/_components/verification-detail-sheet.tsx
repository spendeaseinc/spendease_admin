/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable prettier/prettier */
/* eslint-disable complexity */
/* eslint-disable import/order */
"use client";

import { useEffect, useState, useCallback } from "react";
import { format } from "date-fns";
import {
    Sheet,
    SheetContent,
    SheetTitle,
    SheetDescription
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
    FileText,
    MapPin,
    History,
    CheckCircle2,
    XCircle,
    Loader2,
    Mail,
    Phone
} from "lucide-react";
import { toast } from "sonner";

import { VerificationRequest } from "@/lib/types/verification";
import { fetchVerificationTimeline, fetchVerificationDetail, approveVerification } from "@/app/actions/verifications";
import { DeclineSheet } from "./decline-sheet";

// Import Refactored Components
import { DetailedDocumentViewer } from "./detail-sheet/document-viewer";
import { AddressComparison } from "./detail-sheet/address-comparison";
import { HistoryTimeline } from "./detail-sheet/history-timeline";
import { StatusBadge, RiskBadge } from "./detail-sheet/verification-review-badges";

// Helper to safely format dates
function safeFormatDate(dateValue: string | Date | null | undefined, formatStr: string): string {
    if (!dateValue) return "-";
    const date = new Date(dateValue);
    if (isNaN(date.getTime())) return "-";
    return format(date, formatStr);
}

interface VerificationDetailSheetProps {
    request: VerificationRequest;
    isOpen: boolean;
    onClose: () => void;
    onStatusChange: () => void;
}

export function VerificationDetailSheet({ request, isOpen, onClose, onStatusChange }: VerificationDetailSheetProps) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [timeline, setTimeline] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState("documents");
    const [isTimelineLoading, setIsTimelineLoading] = useState(false);

    // File URL state
    const [fileUrl, setFileUrl] = useState<string | null>(null);
    const [isFileLoading, setIsFileLoading] = useState(false);

    // Action State
    const [isApproving, setIsApproving] = useState(false);
    const [isDeclineSheetOpen, setIsDeclineSheetOpen] = useState(false);

    const loadDetails = useCallback(async () => {
        setIsFileLoading(true);
        try {
            const result = await fetchVerificationDetail(request.id);
            if ("data" in result && result.data && typeof result.data === 'object') {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const data = result.data as any;
                setFileUrl(data.file_url ?? null);
            }
        } catch (error) {
            console.error("Error loading verification details:", error);
        } finally {
            setIsFileLoading(false);
        }
    }, [request.id]);

    const loadTimeline = useCallback(async () => {
        setIsTimelineLoading(true);
        const result = await fetchVerificationTimeline(request.id);
        if ("data" in result && Array.isArray(result.data)) {
            setTimeline(result.data);
        }
        setIsTimelineLoading(false);
    }, [request.id]);

    useEffect(() => {
        if (isOpen) {
            setActiveTab("documents");
            setFileUrl(null);
            loadDetails();
            loadTimeline();
        }
    }, [isOpen, request.id, loadDetails, loadTimeline]);

    const handleApprove = async () => {
        setIsApproving(true);
        try {
            const result = await approveVerification(request.id);
            if ("status" in result && result.status) {
                toast.success("Verification approved successfully");
                onStatusChange();
            } else {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                toast.error((result as any).message ?? "Failed to approve verification");
            }
        } catch (error) {
            console.error(error); // Log error
            toast.error("An unexpected error occurred");
        } finally {
            setIsApproving(false);
        }
    };

    return (
        <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <SheetContent side="right" className="w-[95vw] sm:w-[1000px] p-0 flex flex-col sm:max-w-[1000px]">
                {/* Header */}
                <div className="px-6 py-4 border-b bg-muted/30">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                            <Avatar className="h-14 w-14 border-2 border-primary/20">
                                <AvatarFallback className="bg-primary/5 text-primary text-lg font-semibold">
                                    {request.user?.first_name?.charAt(0)}{request.user?.last_name?.charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <div className="flex items-center gap-3">
                                    <SheetTitle className="text-xl">
                                        {request.user?.first_name} {request.user?.last_name}
                                    </SheetTitle>
                                    <StatusBadge status={request.status} />
                                    {request.risk_level && <RiskBadge level={request.risk_level} />}
                                </div>
                                <SheetDescription className="flex items-center gap-4 mt-1">
                                    <span className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" /> {request.user?.email}</span>
                                    <span className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" /> {request.user?.phone}</span>
                                </SheetDescription>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-muted-foreground uppercase tracking-wider">Verification ID</p>
                            <p className="font-mono text-sm font-medium">{request.reference}</p>
                            <p className="text-xs text-muted-foreground mt-1">Submitted: {safeFormatDate(request.created_at, "MMM d, yyyy HH:mm")}</p>
                        </div>
                    </div>
                </div>

                {/* content */}
                <div className="flex-1 overflow-hidden flex flex-col">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
                        <div className="px-6 border-b">
                            <TabsList className="bg-transparent h-12 w-full justify-start space-x-6 p-0">
                                <TabsTrigger
                                    value="documents"
                                    className="h-full rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 pb-2 pt-2"
                                >
                                    <FileText className="h-4 w-4 mr-2" />
                                    Documents & OCR
                                </TabsTrigger>
                                <TabsTrigger
                                    value="address"
                                    className="h-full rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 pb-2 pt-2"
                                >
                                    <MapPin className="h-4 w-4 mr-2" />
                                    Address Comparison
                                </TabsTrigger>
                                <TabsTrigger
                                    value="history"
                                    className="h-full rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 pb-2 pt-2"
                                >
                                    <History className="h-4 w-4 mr-2" />
                                    Review History
                                </TabsTrigger>
                            </TabsList>
                        </div>

                        <div className="flex-1 bg-muted/10 p-6 overflow-hidden">
                            <TabsContent value="documents" className="h-full m-0 data-[state=active]:flex gap-6 overflow-hidden">
                                <DetailedDocumentViewer
                                    request={request}
                                    fileUrl={fileUrl}
                                    isFileLoading={isFileLoading}
                                />
                            </TabsContent>

                            <TabsContent value="address" className="m-0 h-full overflow-y-auto">
                                <AddressComparison request={request} />
                            </TabsContent>

                            <TabsContent value="history" className="m-0 h-full overflow-y-auto">
                                <HistoryTimeline timeline={timeline} isLoading={isTimelineLoading} />
                            </TabsContent>
                        </div>
                    </Tabs>
                </div>

                {/* Footer Actions */}
                {(request.status === 'pending_ocr' || request.status === 'pending_review') && (
                    <div className="p-4 border-t bg-background flex justify-end gap-3">
                        <Button variant="outline" onClick={() => setIsDeclineSheetOpen(true)}>
                            <XCircle className="h-4 w-4 mr-2" />
                            Decline
                        </Button>
                        <Button
                            className="bg-emerald-600 hover:bg-emerald-700 text-white"
                            onClick={handleApprove}
                            disabled={isApproving}
                        >
                            {isApproving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <CheckCircle2 className="h-4 w-4 mr-2" />}
                            Approve Verification
                        </Button>
                    </div>
                )}

                <DeclineSheet
                    request={request}
                    isOpen={isDeclineSheetOpen}
                    onClose={() => setIsDeclineSheetOpen(false)}
                    onSuccess={() => {
                        onStatusChange();
                        setIsDeclineSheetOpen(false);
                    }}
                />
            </SheetContent>
        </Sheet>
    );
}
