import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Shield,
  ChevronLeft,
  Search,
  AlertCircle,
  CheckCircle2,
  Clock,
} from "lucide-react";

interface ReportStatus {
  id: number;
  tracking_id: string;
  category: string;
  severity: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export default function Status() {
  const [trackingId, setTrackingId] = useState("");
  const [report, setReport] = useState<ReportStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setReport(null);
    setLoading(true);
    setSearched(true);

    if (!trackingId.trim()) {
      setError("Please enter your tracking ID");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/reports/status/${trackingId}`);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Tracking ID not found");
        }
        throw new Error("Failed to retrieve report status");
      }

      const data = await response.json();
      setReport(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const statusConfig = {
    pending: {
      icon: Clock,
      label: "Pending Review",
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
      description: "Your report is in the queue and will be reviewed shortly.",
    },
    in_review: {
      icon: Search,
      label: "Under Review",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      description: "Our team is actively reviewing your report.",
    },
    resolved: {
      icon: CheckCircle2,
      label: "Resolved",
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      description: "This report has been reviewed and action has been taken.",
    },
  };

  const severityConfig: Record<string, { label: string; color: string }> = {
    low: { label: "Low", color: "bg-blue-100 text-blue-800" },
    medium: { label: "Medium", color: "bg-yellow-100 text-yellow-800" },
    high: { label: "High", color: "bg-red-100 text-red-800" },
  };

  const categoryConfig: Record<string, string> = {
    bullying: "Bullying",
    harassment: "Harassment",
    cyberbullying: "Cyberbullying",
    other: "Other",
  };

  const currentStatusConfig = report
    ? statusConfig[report.status as keyof typeof statusConfig]
    : null;
  const StatusIcon = currentStatusConfig ? currentStatusConfig.icon : null;

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-8 h-8 text-primary" />
            <span className="text-2xl font-bold text-primary">
              CyberGuardian
            </span>
          </div>
          <Link to="/">
            <Button variant="outline" className="gap-2">
              <ChevronLeft className="w-4 h-4" />
              Back
            </Button>
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              Check Report Status
            </h1>
            <p className="text-lg text-muted-foreground">
              Enter your tracking ID to view the status of your report.
            </p>
          </div>

          {/* Search Form */}
          <div className="bg-card border border-border rounded-xl p-6 md:p-8 shadow-sm mb-8">
            <form onSubmit={handleSearch} className="space-y-4">
              <div>
                <label
                  htmlFor="trackingId"
                  className="block text-sm font-semibold text-foreground mb-2"
                >
                  Tracking ID
                </label>
                <div className="flex gap-2">
                  <input
                    id="trackingId"
                    type="text"
                    value={trackingId}
                    onChange={(e) =>
                      setTrackingId(e.target.value.toUpperCase())
                    }
                    placeholder="e.g., CG7F4A9B2C5E1D8"
                    className="flex-1 px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background text-foreground placeholder:text-muted-foreground font-mono"
                  />
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex-shrink-0 gap-2"
                  >
                    <Search className="w-4 h-4" />
                    {loading ? "Searching..." : "Search"}
                  </Button>
                </div>
              </div>

              {/* Error Message */}
              {error && searched && (
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}
            </form>
          </div>

          {/* Report Details */}
          {report && currentStatusConfig && StatusIcon && (
            <div className="space-y-6">
              {/* Status Card */}
              <div
                className={`${currentStatusConfig.bgColor} border ${currentStatusConfig.borderColor} rounded-xl p-6 md:p-8`}
              >
                <div className="flex items-start gap-4 mb-6">
                  <div
                    className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${currentStatusConfig.bgColor}`}
                  >
                    <StatusIcon
                      className={`w-6 h-6 ${currentStatusConfig.color}`}
                    />
                  </div>
                  <div>
                    <h2
                      className={`text-2xl font-bold ${currentStatusConfig.color}`}
                    >
                      {currentStatusConfig.label}
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      {currentStatusConfig.description}
                    </p>
                  </div>
                </div>

                <div className="bg-white/50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between items-start">
                    <span className="text-sm font-semibold text-gray-700">
                      Tracking ID:
                    </span>
                    <code className="font-mono text-sm font-bold text-primary bg-white px-2 py-1 rounded">
                      {report.tracking_id}
                    </code>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-sm font-semibold text-gray-700">
                      Reported:
                    </span>
                    <span className="text-sm text-gray-600">
                      {new Date(report.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-sm font-semibold text-gray-700">
                      Last Updated:
                    </span>
                    <span className="text-sm text-gray-600">
                      {new Date(report.updated_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Report Details */}
              <div className="bg-card border border-border rounded-xl p-6 md:p-8">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Report Details
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-muted-foreground">
                      Category
                    </span>
                    <span className="text-sm font-semibold text-foreground">
                      {categoryConfig[report.category] || report.category}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-muted-foreground">
                      Severity
                    </span>
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full ${severityConfig[report.severity]?.color || ""}`}
                    >
                      {severityConfig[report.severity]?.label ||
                        report.severity}
                    </span>
                  </div>
                </div>
              </div>

              {/* Support Message */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <h3 className="font-semibold text-foreground mb-2">
                  Need Support?
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Regardless of the status, we encourage you to reach out to
                  school counselors or support services if you need help.
                </p>
                <p className="text-sm font-semibold text-primary">
                  Crisis Hotline: 988 (Available 24/7)
                </p>
              </div>
            </div>
          )}

          {/* Not Found Message */}
          {searched && !report && !error && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 flex items-start gap-4">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-foreground mb-1">
                  No Report Found
                </h3>
                <p className="text-sm text-muted-foreground">
                  Please check your tracking ID and try again. Make sure you've
                  entered it correctly.
                </p>
              </div>
            </div>
          )}

          {/* Initial Message */}
          {!searched && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 md:p-8">
              <h3 className="font-semibold text-foreground mb-2">
                How It Works
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex gap-2">
                  <span>•</span>
                  <span>
                    Enter the tracking ID from your confirmation email
                  </span>
                </li>
                <li className="flex gap-2">
                  <span>•</span>
                  <span>Check the current status of your report</span>
                </li>
                <li className="flex gap-2">
                  <span>•</span>
                  <span>See when it was last updated</span>
                </li>
              </ul>
            </div>
          )}

          {/* Back to Reporting */}
          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Want to submit another report?
            </p>
            <Link to="/report">
              <Button variant="outline">Submit New Report</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
