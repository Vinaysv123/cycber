import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, ChevronLeft, Copy, Check } from "lucide-react";

export default function Report() {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [trackingId, setTrackingId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const [formData, setFormData] = useState({
    category: "",
    severity: "",
    description: "",
    reporter_email: "",
  });

  const categories = [
    {
      value: "bullying",
      label: "Bullying",
      description: "Physical or verbal abuse",
    },
    {
      value: "harassment",
      label: "Harassment",
      description: "Unwanted behavior or targeting",
    },
    {
      value: "cyberbullying",
      label: "Cyberbullying",
      description: "Online harassment or threats",
    },
    { value: "other", label: "Other", description: "Other incidents" },
  ];

  const severities = [
    { value: "low", label: "Low", description: "Minor incident" },
    { value: "medium", label: "Medium", description: "Moderate incident" },
    { value: "high", label: "High", description: "Severe incident" },
  ];

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!formData.category || !formData.severity || !formData.description) {
      setError("Please fill in all required fields");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/reports/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to submit report");
      }

      const data = await response.json();
      setTrackingId(data.tracking_id);
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(trackingId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (submitted) {
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

        {/* Success Message */}
        <div className="container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-2xl mx-auto">
            <div className="bg-gradient-to-br from-secondary/10 to-green-100 border border-secondary/20 rounded-xl p-8 md:p-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary rounded-full mb-6">
                <Check className="w-8 h-8 text-white" />
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Report Submitted Successfully
              </h1>

              <p className="text-lg text-muted-foreground mb-8">
                Thank you for having the courage to report. Your voice matters
                and your safety is our priority.
              </p>

              {/* Tracking ID Card */}
              <div className="bg-white border-2 border-secondary rounded-lg p-8 mb-8">
                <p className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
                  Your Tracking ID
                </p>
                <div className="flex items-center justify-between gap-4 bg-muted/30 rounded-lg p-4 mb-4">
                  <code className="text-2xl md:text-3xl font-mono font-bold text-primary">
                    {trackingId}
                  </code>
                  <button
                    onClick={copyToClipboard}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy
                      </>
                    )}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Save this ID to check your report status later
                </p>
              </div>

              {/* Next Steps */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8 text-left">
                <h3 className="font-semibold text-foreground mb-3">
                  What Happens Next
                </h3>
                <ol className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
                      1
                    </span>
                    <span>
                      Our team will review your report within 2-3 business days
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
                      2
                    </span>
                    <span>
                      You can check your report status anytime using your
                      Tracking ID
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
                      3
                    </span>
                    <span>
                      Appropriate action will be taken based on our findings
                    </span>
                  </li>
                </ol>
              </div>

              {/* Support Resources */}
              <div className="bg-card border border-border rounded-lg p-6 mb-8 text-left">
                <h3 className="font-semibold text-foreground mb-3">
                  Need Support?
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  We're here to help. Consider reaching out to:
                </p>
                <div className="space-y-2 text-sm">
                  <div>
                    <p className="font-semibold text-foreground">
                      School Counselor
                    </p>
                    <p className="text-muted-foreground">
                      Contact your school's counseling office
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">
                      Crisis Hotline
                    </p>
                    <p className="text-primary font-mono">988 (24/7)</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/status">
                  <Button variant="outline" className="w-full sm:w-auto">
                    Check Report Status
                  </Button>
                </Link>
                <Link to="/">
                  <Button className="w-full sm:w-auto">Back to Home</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              Submit an Anonymous Report
            </h1>
            <p className="text-lg text-muted-foreground">
              Your identity is completely protected. Help us create a safer
              community.
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-card border border-border rounded-xl p-6 md:p-8 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Category */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-3">
                  What type of incident are you reporting?{" "}
                  <span className="text-destructive">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {categories.map((cat) => (
                    <label
                      key={cat.value}
                      className={`relative flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        formData.category === cat.value
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="category"
                        value={cat.value}
                        onChange={handleChange}
                        className="mt-1 w-4 h-4 accent-primary"
                      />
                      <div className="ml-3">
                        <p className="font-semibold text-foreground">
                          {cat.label}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {cat.description}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Severity */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-3">
                  How serious is this incident?{" "}
                  <span className="text-destructive">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {severities.map((sev) => (
                    <label
                      key={sev.value}
                      className={`relative flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        formData.severity === sev.value
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="severity"
                        value={sev.value}
                        onChange={handleChange}
                        className="w-4 h-4 accent-primary"
                      />
                      <div className="ml-3">
                        <p className="font-semibold text-foreground">
                          {sev.label}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {sev.description}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-semibold text-foreground mb-2"
                >
                  Tell us what happened{" "}
                  <span className="text-destructive">*</span>
                </label>
                <p className="text-sm text-muted-foreground mb-3">
                  Be as detailed as possible. Include who, what, when, and
                  where.
                </p>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe the incident in detail..."
                  className="w-full h-40 p-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background text-foreground placeholder:text-muted-foreground resize-none"
                  maxLength={5000}
                />
                <p className="text-xs text-muted-foreground mt-2">
                  {formData.description.length} / 5000 characters
                </p>
              </div>

              {/* Optional Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-foreground mb-2"
                >
                  Email (Optional)
                </label>
                <p className="text-sm text-muted-foreground mb-3">
                  Provide an email only if you want to receive updates about
                  your report. Your email will be kept secure.
                </p>
                <input
                  id="email"
                  type="email"
                  name="reporter_email"
                  value={formData.reporter_email}
                  onChange={handleChange}
                  placeholder="your.email@example.com"
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background text-foreground placeholder:text-muted-foreground"
                />
              </div>

              {/* Privacy Notice */}
              <div className="bg-secondary/10 border border-secondary/20 rounded-lg p-4">
                <p className="text-sm text-foreground">
                  <span className="font-semibold">Privacy Promise:</span> Your
                  report is completely anonymous. We do not track IP addresses,
                  location, or any identifying information. Only authorized
                  administrators can view your report.
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                  <p className="text-sm text-destructive font-semibold">
                    {error}
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1"
                  size="lg"
                >
                  {loading ? "Submitting..." : "Submit Report Anonymously"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={() => navigate("/")}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>

          {/* Help Section */}
          <div className="mt-12 bg-card border border-border rounded-xl p-6 md:p-8">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Need Help?
            </h3>
            <p className="text-muted-foreground mb-6">
              If you're not sure what to report or need guidance, here are some
              helpful resources:
            </p>
            <div className="space-y-3 text-sm">
              <div>
                <p className="font-semibold text-foreground">
                  Experiencing Crisis?
                </p>
                <p className="text-muted-foreground">
                  Call 988 (24/7 Crisis Helpline)
                </p>
              </div>
              <div>
                <p className="font-semibold text-foreground">
                  Immediate Danger?
                </p>
                <p className="text-muted-foreground">
                  Call 911 or your local emergency services
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
