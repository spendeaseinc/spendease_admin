/* eslint-disable prettier/prettier */
/* eslint-disable import/order */
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Shield, XCircle } from "lucide-react";
import { VerificationStatus } from "@/lib/types/verification";

export function StatusBadge({ status }: { status: VerificationStatus }) {
    let styles = "";
    switch (status) {
        case "approved":
            styles = "bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-emerald-200";
            break;
        case "declined":
            styles = "bg-red-100 text-red-800 hover:bg-red-100 border-red-200";
            break;
        case "pending_review":
            styles = "bg-amber-100 text-amber-800 hover:bg-amber-100 border-amber-200";
            break;
        case "pending_ocr":
            styles = "bg-gray-100 text-gray-800 hover:bg-gray-100 border-gray-200";
            break;
        default:
            styles = "";
    }
    return <Badge className={`${styles} capitalize shadow-none`}>{status.replace(/_/g, ' ')}</Badge>;
}

export function RiskBadge({ level }: { level: string }) {
    let styles = "";
    switch (level) {
        case "low":
            styles = "bg-blue-50 text-blue-700 border-blue-200";
            break;
        case "medium":
            styles = "bg-amber-50 text-amber-700 border-amber-200";
            break;
        case "high":
            styles = "bg-red-50 text-red-700 border-red-200";
            break;
        default:
            styles = "";
    }
    return <Badge variant="outline" className={`${styles} capitalize`}>{level} Risk</Badge>;
}

export function MatchScore({ score }: { score: number }) {
    return (
        <div className="flex items-center gap-2">
            <div className={`text-lg font-bold ${getScoreTextColor(score)}`}>{score}%</div>
            {score >= 80 ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            ) : score >= 60 ? (
                <Shield className="h-4 w-4 text-amber-500" />
            ) : (
                <XCircle className="h-4 w-4 text-red-500" />
            )}
        </div>
    );
}

export function getScoreColor(score: number) {
    if (score >= 80) return "bg-emerald-500";
    if (score >= 60) return "bg-amber-500";
    return "bg-red-500";
}

function getScoreTextColor(score: number) {
    if (score >= 80) return "text-emerald-600";
    if (score >= 60) return "text-amber-600";
    return "text-red-600";
}
