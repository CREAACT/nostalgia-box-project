import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search } from "lucide-react";

const Chronicles = () => {
  const [searchId, setSearchId] = useState("");
  const { toast } = useToast();

  const { data: searchResults, refetch } = useQuery({
    queryKey: ["search-users", searchId],
    queryFn: async () => {
      if (!searchId) return [];
      
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .ilike("custom_id", `%${searchId}%`)
        .limit(10);

      if (error) throw error;
      return data;
    },
    enabled: false,
  });

  const handleSearch = () => {
    if (!searchId.trim()) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Введите ID пользователя для поиска",
      });
      return;
    }
    refetch();
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Хроники</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Найдите других пользователей по их ID
        </p>
      </div>

      <div className="flex gap-2">
        <Input
          placeholder="Введите ID пользователя"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          className="flex-1"
        />
        <Button onClick={handleSearch}>
          <Search className="w-4 h-4 mr-2" />
          Поиск
        </Button>
      </div>

      {searchResults && searchResults.length > 0 ? (
        <div className="space-y-4">
          {searchResults.map((user) => (
            <div
              key={user.id}
              className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow"
            >
              <Avatar>
                <AvatarImage src={user.avatar_url} />
                <AvatarFallback>
                  {user.username?.charAt(0)?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold">{user.username}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  ID: {user.custom_id}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : searchResults && searchResults.length === 0 ? (
        <div className="text-center text-gray-600 dark:text-gray-400">
          Пользователи не найдены
        </div>
      ) : null}
    </div>
  );
};

export default Chronicles;