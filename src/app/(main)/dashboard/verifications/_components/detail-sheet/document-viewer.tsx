/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable prettier/prettier */
/* eslint-disable import/order */
import { useState } from "react";
import { VerificationRequest } from "@/lib/types/verification";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
    Loader2, FileText, ZoomOut, ZoomIn, RotateCw, ExternalLink, ShieldAlert
} from "lucide-react";
import { MatchScore } from "./verification-review-badges";

interface DocumentPreviewProps {
    request: VerificationRequest;
    fileUrl: string | null;
    isFileLoading: boolean;
}

function DocumentPreview({ request, fileUrl, isFileLoading }: DocumentPreviewProps) {
    const [zoomLevel, setZoomLevel] = useState(1);
    const [rotation, setRotation] = useState(0);

    const isPdf = request.file_key?.toLowerCase().endsWith('.pdf') ||
        request.original_filename?.toLowerCase().endsWith('.pdf');

    return (
        <Card className="flex-1 flex flex-col border overflow-hidden h-full shadow-sm">
            <div className="p-2 border-b flex items-center justify-between bg-muted/30">
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="capitalize">{request.document_type.replace('_', ' ')}</Badge>
                    {isPdf && <Badge variant="secondary" className="text-xs">PDF</Badge>}
                </div>
                {!isPdf && (
                    <div className="flex items-center bg-background border rounded-md shadow-sm">
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-none" onClick={() => setZoomLevel(z => Math.max(0.5, z - 0.25))}>
                            <ZoomOut className="h-4 w-4" />
                        </Button>
                        <span className="text-xs w-12 text-center font-mono">{Math.round(zoomLevel * 100)}%</span>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-none border-l border-r" onClick={() => setZoomLevel(z => Math.min(3, z + 0.25))}>
                            <ZoomIn className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-none" onClick={() => setRotation(r => r + 90)}>
                            <RotateCw className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-none border-l" onClick={() => fileUrl && window.open(fileUrl, '_blank')} disabled={!fileUrl}>
                            <ExternalLink className="h-4 w-4" />
                        </Button>
                    </div>
                )}
                {isPdf && (
                    <Button variant="ghost" size="sm" onClick={() => fileUrl && window.open(fileUrl, '_blank')} disabled={!fileUrl}>
                        <ExternalLink className="h-4 w-4 mr-2" /> Open in New Tab
                    </Button>
                )}
            </div>
            <div className="flex-1 bg-muted/20 relative overflow-auto flex items-center justify-center p-4">
                {isFileLoading ? (
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <Loader2 className="h-8 w-8 animate-spin" />
                        <span className="text-sm">Loading document...</span>
                    </div>
                ) : !fileUrl ? (
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <FileText className="h-12 w-12" />
                        <span className="text-sm">No document available</span>
                    </div>
                ) : isPdf ? (
                    <iframe src={fileUrl} className="w-full h-full rounded-md border" title="PDF Document" />
                ) : (
                    <div className="transition-transform duration-200 ease-out" style={{ transform: `scale(${zoomLevel}) rotate(${rotation}deg)` }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={fileUrl}
                            alt="Verification Document"
                            className="max-w-full max-h-full object-contain shadow-lg rounded-sm"
                        />
                    </div>
                )}
            </div>
        </Card>
    );
}

function OCRAnalysis({ request }: { request: VerificationRequest }) {
    return (
        <div className="w-[350px] flex flex-col gap-4 overflow-y-auto pr-1">
            <Card className="border shadow-sm">
                <CardHeader className="pb-3 bg-muted/30">
                    <CardTitle className="text-sm font-medium">OCR Analysis</CardTitle>
                </CardHeader>
                <CardContent className="pt-4 grid gap-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <span className="text-xs text-muted-foreground">Name Match</span>
                            <div className="flex items-center gap-2">
                                <MatchScore score={request.name_match_score ?? 0} />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <span className="text-xs text-muted-foreground">Address Match</span>
                            <div className="flex items-center gap-2">
                                <MatchScore score={request.address_match_score ?? 0} />
                            </div>
                        </div>
                    </div>

                    <Separator />

                    <div className="space-y-3">
                        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Extracted Data</h4>

                        <div className="space-y-1">
                            <p className="text-xs text-muted-foreground">Extracted Name</p>
                            <p className="text-sm font-medium">{request.extracted_name ?? "N/A"}</p>
                        </div>

                        <div className="space-y-1">
                            <p className="text-xs text-muted-foreground">Extracted Address</p>
                            <div className="bg-muted p-2 rounded text-xs font-mono wrap-break-word leading-relaxed">
                                {request.extracted_address ?? "No address text extracted"}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Manual Review Note if score is low */}
            {((request.name_match_score ?? 0) < 80 || (request.address_match_score ?? 0) < 80) && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-amber-800 text-sm flex gap-2">
                    <ShieldAlert className="h-5 w-5 shrink-0" />
                    <p>Low match scores detected. Please review the document manually to confirm user details.</p>
                </div>
            )}
        </div>
    );
}

export function DetailedDocumentViewer({ request, fileUrl, isFileLoading }: DocumentPreviewProps) {
    return (
        <div className="flex gap-6 h-full overflow-hidden">
            <DocumentPreview request={request} fileUrl={fileUrl} isFileLoading={isFileLoading} />
            <OCRAnalysis request={request} />
        </div>
    );
}
