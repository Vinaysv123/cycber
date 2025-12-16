import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, ChevronLeft } from "lucide-react";

export default function Admin() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-8 h-8 text-primary" />
            <span className="text-2xl font-bold text-primary">CyberGuardian</span>
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
        <div className="max-w-4xl mx-auto">
          <div className="bg-card border border-border rounded-xl p-8 md:p-12">
            <Shield className="w-16 h-16 text-primary mx-auto mb-6" />
            <h1 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-4">
              Admin Dashboard
            </h1>
            <p className="text-center text-muted-foreground mb-8">
              This is a placeholder for the admin dashboard. In a production deployment, this would be a fully functional admin panel with:
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="p-4 border border-border rounded-lg">
                <h3 className="font-semibold text-foreground mb-2">Report Management</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• View all submitted reports</li>
                  <li>• Filter by status, severity, category</li>
                  <li>• Update report status</li>
                  <li>• Add admin notes</li>
                </ul>
              </div>

              <div className="p-4 border border-border rounded-lg">
                <h3 className="font-semibold text-foreground mb-2">Analytics</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Total reports dashboard</li>
                  <li>• Severity distribution charts</li>
                  <li>• Category breakdown</li>
                  <li>• Monthly trends</li>
                </ul>
              </div>

              <div className="p-4 border border-border rounded-lg">
                <h3 className="font-semibold text-foreground mb-2">User Management</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Admin accounts</li>
                  <li>• Counselor accounts</li>
                  <li>• Role-based access control</li>
                  <li>• Activity logs</li>
                </ul>
              </div>

              <div className="p-4 border border-border rounded-lg">
                <h3 className="font-semibold text-foreground mb-2">Security</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• JWT-based authentication</li>
                  <li>• Encrypted data storage</li>
                  <li>• Secure headers</li>
                  <li>• Session management</li>
                </ul>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
              <h3 className="font-semibold text-foreground mb-2">To Complete This Section</h3>
              <p className="text-sm text-muted-foreground">
                Continue prompting the assistant to build out the full admin authentication (login page), report management dashboard with filtering, analytics views, and user management features. These would be fully functional production components with real-time data from the SQLite backend.
              </p>
            </div>

            <div className="flex justify-center">
              <Link to="/">
                <Button>Back to Home</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
