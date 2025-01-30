import { CapsuleList } from "@/components/CapsuleList";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

const Favorites = ({ session }: { session: any }) => {
  const { data: capsules, isLoading } = useQuery({
    queryKey: ["favorite-capsules"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("time_capsules")
        .select("*")
        .eq("is_favorite", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="p-4 md:p-8 space-y-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Избранные капсулы</h1>
          <p className="text-lg text-gray-600">
            Ваши любимые воспоминания
          </p>
        </div>

        <CapsuleList
          capsules={capsules || []}
          session={session}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default Favorites;