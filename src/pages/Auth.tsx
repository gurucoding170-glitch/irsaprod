import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { MobileContainer } from "@/components/ui/mobile-container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const navigate = useNavigate();

  const [emailLogin, setEmailLogin] = useState("");
  const [passwordLogin, setPasswordLogin] = useState("");

  const [emailSignup, setEmailSignup] = useState("");
  const [passwordSignup, setPasswordSignup] = useState("");

  const [phone, setPhone] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Listen to auth changes and redirect when logged in
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        navigate("/", { replace: true });
      }
    });

    // Check current session
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) navigate("/", { replace: true });
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const loginWithEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: emailLogin,
      password: passwordLogin,
    });
    setLoading(false);
    if (error) {
      toast({ title: "Login failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Welcome back!" });
    }
  };

  const signUpWithEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const redirectUrl = `${window.location.origin}/`;
    const { error } = await supabase.auth.signUp({
      email: emailSignup,
      password: passwordSignup,
      options: { emailRedirectTo: redirectUrl },
    });
    setLoading(false);
    if (error) {
      toast({ title: "Signup failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Check your email", description: "Confirm your email to complete signup." });
    }
  };

  const sendPhoneOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({ phone });
    setLoading(false);
    if (error) {
      toast({ title: "OTP send failed", description: error.message, variant: "destructive" });
    } else {
      setOtpSent(true);
      toast({ title: "OTP sent", description: "Enter the code you received via SMS." });
    }
  };

  const verifyPhoneOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.verifyOtp({
      phone,
      token: otp,
      type: "sms",
    });
    setLoading(false);
    if (error) {
      toast({ title: "OTP verification failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Phone verified" });
    }
  };

  const oauthSignIn = async (provider: "google" | "facebook") => {
    const redirectTo = `${window.location.origin}/`;
    const { error } = await supabase.auth.signInWithOAuth({ provider, options: { redirectTo } });
    if (error) {
      toast({ title: "OAuth error", description: error.message, variant: "destructive" });
    }
  };

  return (
    <MobileContainer className="pb-10">
      <header className="p-4">
        <button onClick={() => navigate(-1)} className="story-link text-sm text-muted-foreground">Back</button>
      </header>

      <main className="px-4 space-y-6 animate-fade-in">
        <h1 className="text-xl font-bold text-foreground">Login or Sign Up</h1>

        <section className="bg-card rounded-xl p-4 shadow-card">
          <h2 className="text-base font-semibold mb-3 text-foreground">Login with Email</h2>
          <form onSubmit={loginWithEmail} className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="emailLogin">Email</Label>
              <Input id="emailLogin" type="email" value={emailLogin} onChange={(e) => setEmailLogin(e.target.value)} required />
            </div>
            <div className="space-y-1">
              <Label htmlFor="passwordLogin">Password</Label>
              <Input id="passwordLogin" type="password" value={passwordLogin} onChange={(e) => setPasswordLogin(e.target.value)} required />
            </div>
            <Button type="submit" disabled={loading} className="w-full">{loading ? "Processing..." : "Login"}</Button>
          </form>
        </section>

        <Separator />

        <section className="bg-card rounded-xl p-4 shadow-card">
          <h2 className="text-base font-semibold mb-3 text-foreground">Sign Up with Email</h2>
          <form onSubmit={signUpWithEmail} className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="emailSignup">Email</Label>
              <Input id="emailSignup" type="email" value={emailSignup} onChange={(e) => setEmailSignup(e.target.value)} required />
            </div>
            <div className="space-y-1">
              <Label htmlFor="passwordSignup">Password</Label>
              <Input id="passwordSignup" type="password" value={passwordSignup} onChange={(e) => setPasswordSignup(e.target.value)} required />
            </div>
            <Button type="submit" disabled={loading} className="w-full">{loading ? "Processing..." : "Create account"}</Button>
          </form>
        </section>

        <Separator />

        <section className="bg-card rounded-xl p-4 shadow-card">
          <h2 className="text-base font-semibold mb-3 text-foreground">Phone Number (OTP)</h2>
          <form onSubmit={otpSent ? verifyPhoneOtp : sendPhoneOtp} className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="phone">Phone (E.164 format, e.g. +92...)</Label>
              <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required />
            </div>
            {otpSent && (
              <div className="space-y-1">
                <Label htmlFor="otp">OTP Code</Label>
                <Input id="otp" inputMode="numeric" value={otp} onChange={(e) => setOtp(e.target.value)} required />
              </div>
            )}
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Processing..." : otpSent ? "Verify OTP" : "Send OTP"}
            </Button>
          </form>
        </section>

        <section className="bg-card rounded-xl p-4 shadow-card">
          <h2 className="text-base font-semibold mb-3 text-foreground">Or continue with</h2>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" onClick={() => oauthSignIn("google")}>Google</Button>
            <Button variant="outline" onClick={() => oauthSignIn("facebook")}>Facebook</Button>
          </div>
          <p className="text-xs text-muted-foreground mt-3">Note: Configure providers in Supabase Dashboard for these to work.</p>
        </section>
      </main>
    </MobileContainer>
  );
};

export default Auth;
