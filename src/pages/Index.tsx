import { TimeCapsule } from "@/components/TimeCapsule";
import { Button } from "@/components/ui/button";
import { CapsuleList } from "@/components/CapsuleList";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { LogOut, Plus } from "lucide-react";
import { useState } from "react";

const Index = ({ session }: { session: any }) => {
  const [showNewCapsule, setShowNewCapsule] = useState(false);

  const { data: capsules, isLoading } = useQuery({
    queryKey: ["capsules"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("time_capsules")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-capsule-300 to-capsule-400 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold">Мои капсулы времени</h1>
            <p className="text-lg text-gray-600">
              Сохраните воспоминания для будущего
            </p>
          </div>
          <Button onClick={handleLogout} variant="outline" className="gap-2">
            <LogOut className="w-4 h-4" />
            Выйти
          </Button>
        </div>

        {showNewCapsule ? (
          <TimeCapsule
            session={session}
            onComplete={() => setShowNewCapsule(false)}
          />
        ) : (
          <Button
            onClick={() => setShowNewCapsule(true)}
            className="w-full py-8 bg-capsule-200/50 hover:bg-capsule-200/70 border-2 border-dashed border-gray-400"
          >
            <Plus className="mr-2" />
            Создать новую капсулу
          </Button>
        )}

        <CapsuleList
          capsules={capsules || []}
          session={session}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default Index;