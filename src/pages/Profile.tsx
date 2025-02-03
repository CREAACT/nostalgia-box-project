import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileAchievements } from "@/components/profile/ProfileAchievements";
import { ProfileProgress } from "@/components/profile/ProfileProgress";
import { Skeleton } from "@/components/ui/skeleton";

const Profile = ({ session }: { session: any }) => {
  const [isEditing, setIsEditing] = useState(false);

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 space-y-6">
        <Skeleton className="w-full h-[200px] rounded-lg" />
        <div className="grid gap-4 md:grid-cols-3">
          <Skeleton className="w-full h-[200px] rounded-lg" />
          <Skeleton className="w-full h-[200px] rounded-lg" />
          <Skeleton className="w-full h-[200px] rounded-lg" />
        </div>
        <Skeleton className="w-full h-[200px] rounded-lg" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <ProfileHeader
        profile={profile}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        session={session}
      />

      <ProfileAchievements
        achievements={profile?.achievements || []}
        medals={profile?.medals || []}
        certificates={profile?.certificates || []}
      />

      <ProfileProgress
        completedStages={profile?.completed_stages || 0}
        totalOlympiads={profile?.total_olympiads || 0}
      />
    </div>
  );
};

export default Profile;