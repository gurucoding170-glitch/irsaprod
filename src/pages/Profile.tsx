import { useEffect, useState } from "react";
import { MobileContainer } from "@/components/ui/mobile-container";
import { Header } from "@/components/ui/header";
import { BottomNav } from "@/components/ui/bottom-nav";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

const Profile = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
      if (data.user) {
        const { data: p } = await supabase.from("profiles").select("id, display_name, avatar_url, phone").eq("id", data.user.id).maybeSingle();
        setProfile(p);
      }
    };
    init();
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <MobileContainer className="pb-20">
      <Header showBack />
      <main className="px-4 py-4 space-y-4">
        <h1 className="text-lg font-bold text-foreground">Profile</h1>
        {!user ? (
          <p className="text-muted-foreground text-sm">Please log in to see your profile.</p>
        ) : (
          <div className="space-y-2">
            <p className="text-foreground">Email: {user.email}</p>
            <p className="text-foreground">Phone: {profile?.phone ?? "-"}</p>
            <p className="text-foreground">Name: {profile?.display_name ?? "-"}</p>
            <Button onClick={logout}>Logout</Button>
          </div>
        )}
      </main>
      <BottomNav activeTab="profile" />
    </MobileContainer>
  );
};

export default Profile;
