import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Shield,
  Users,
  Lock,
  Heart,
  ChevronRight,
  MessageCircle,
  TrendingUp,
  CheckCircle2,
} from "lucide-react";

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-8 h-8 text-primary" />
            <span className="text-2xl font-bold text-primary">CyberGuardian</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/report">
              <Button className="gap-2">
                <MessageCircle className="w-4 h-4" />
                Report
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/10 py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              Your Voice Matters.
              <span className="text-primary block mt-2">Safely.</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed max-w-2xl">
              Anonymous reporting for bullying, harassment, and cyberbullying in educational institutions. Report with confidence. We protect your privacy.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/report">
                <Button size="lg" className="w-full sm:w-auto gap-2">
                  Submit Anonymous Report
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto"
                onClick={() =>
                  document.getElementById("features").scrollIntoView({
                    behavior: "smooth",
                  })
                }
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-12 md:py-16 bg-card border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="text-center">
              <Lock className="w-10 h-10 text-primary mx-auto mb-3" />
              <h3 className="font-semibold text-lg mb-2">100% Anonymous</h3>
              <p className="text-sm text-muted-foreground">
                No personal data required. No IP tracking. Complete privacy.
              </p>
            </div>
            <div className="text-center">
              <Shield className="w-10 h-10 text-primary mx-auto mb-3" />
              <h3 className="font-semibold text-lg mb-2">Secure Processing</h3>
              <p className="text-sm text-muted-foreground">
                Encrypted data handling. Secure storage. Protected endpoints.
              </p>
            </div>
            <div className="text-center">
              <Users className="w-10 h-10 text-primary mx-auto mb-3" />
              <h3 className="font-semibold text-lg mb-2">Expert Review</h3>
              <p className="text-sm text-muted-foreground">
                Reviewed by trained administrators and counselors.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-foreground">
            How It Works
          </h2>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Feature 1 */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm">
                  1
                </div>
                <h3 className="text-xl font-semibold text-foreground">
                  Share Your Experience
                </h3>
              </div>
              <p className="text-muted-foreground pl-11">
                Tell us about the bullying or harassment you've experienced or witnessed. Select the category that best fits your situation.
              </p>
              <div className="pl-11 space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-secondary" />
                  <span>Bullying</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-secondary" />
                  <span>Harassment</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-secondary" />
                  <span>Cyberbullying</span>
                </div>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm">
                  2
                </div>
                <h3 className="text-xl font-semibold text-foreground">
                  Get Your Tracking ID
                </h3>
              </div>
              <p className="text-muted-foreground pl-11">
                After submission, you'll receive a unique tracking ID. Keep it safe to check your report status anytime, without logging in.
              </p>
              <div className="pl-11 bg-muted/30 border border-muted rounded-lg p-4 font-mono text-sm text-primary">
                CG7F4A9B2C5E1D8
              </div>
            </div>

            {/* Feature 3 */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm">
                  3
                </div>
                <h3 className="text-xl font-semibold text-foreground">
                  Expert Review
                </h3>
              </div>
              <p className="text-muted-foreground pl-11">
                Our trained administrators and counselors will review your report thoroughly and take appropriate action.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm">
                  4
                </div>
                <h3 className="text-xl font-semibold text-foreground">
                  Get Support
                </h3>
              </div>
              <p className="text-muted-foreground pl-11">
                Access mental health resources and support from trained counselors in your institution.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">100%</div>
              <p className="text-sm opacity-90">Anonymous & Confidential</p>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">24/7</div>
              <p className="text-sm opacity-90">Report Anytime</p>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">Expert</div>
              <p className="text-sm opacity-90">Trained Professionals</p>
            </div>
          </div>
        </div>
      </section>

      {/* Resources Section */}
      <section className="py-16 md:py-24 bg-card border-b">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-foreground">
            Mental Health Resources
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-6 border border-border rounded-xl hover:shadow-lg transition-shadow">
              <Heart className="w-8 h-8 text-secondary mb-4" />
              <h3 className="text-lg font-semibold mb-2">Crisis Support</h3>
              <p className="text-sm text-muted-foreground mb-4">
                24/7 crisis helplines and emergency support services available if you need immediate help.
              </p>
              <p className="text-sm font-semibold text-primary">
                National Crisis Hotline: 988
              </p>
            </div>

            <div className="p-6 border border-border rounded-xl hover:shadow-lg transition-shadow">
              <Users className="w-8 h-8 text-secondary mb-4" />
              <h3 className="text-lg font-semibold mb-2">Counseling Services</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Connect with trained school counselors and mental health professionals in your institution.
              </p>
              <p className="text-sm font-semibold text-primary">
                Contact your school's counseling office
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
            Ready to Report?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Your report is important. We take every submission seriously and are committed to creating a safer environment for everyone.
          </p>
          <Link to="/report">
            <Button size="lg" className="gap-2">
              Submit Your Report Now
              <ChevronRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-6 h-6 text-primary" />
                <span className="font-bold text-primary">CyberGuardian</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Making educational institutions safer, one report at a time.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-foreground">Quick Links</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link to="/report" className="hover:text-primary transition-colors">
                    Submit Report
                  </Link>
                </li>
                <li>
                  <Link to="/status" className="hover:text-primary transition-colors">
                    Check Status
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-foreground">Contact</h4>
              <p className="text-sm text-muted-foreground">
                Questions? Contact your institution's administration office.
              </p>
            </div>
          </div>
          <div className="border-t pt-8 text-center text-sm text-muted-foreground">
            <p>
              © 2024 CyberGuardian. All rights reserved. Privacy First.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
