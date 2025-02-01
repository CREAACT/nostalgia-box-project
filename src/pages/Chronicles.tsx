import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, UserPlus, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Chronicles = () => {
  const [searchId, setSearchId] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

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

  const { data: friendships } = useQuery({
    queryKey: ["friendships"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("friendships")
        .select("*")
        .or(`user_id.eq.${supabase.auth.getUser()?.data.user?.id},friend_id.eq.${supabase.auth.getUser()?.data.user?.id}`);

      if (error) throw error;
      return data;
    },
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

  const handleAddFriend = async (userId: string) => {
    const existingFriendship = friendships?.find(
      f => (f.user_id === userId && f.friend_id === supabase.auth.getUser()?.data.user?.id) ||
           (f.friend_id === userId && f.user_id === supabase.auth.getUser()?.data.user?.id)
    );

    if (existingFriendship) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Заявка в друзья уже существует или вы уже друзья",
      });
      return;
    }

    const { error } = await supabase
      .from("friendships")
      .insert({
        user_id: supabase.auth.getUser()?.data.user?.id,
        friend_id: userId,
      });

    if (error) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Не удалось отправить заявку в друзья",
      });
      return;
    }

    toast({
      title: "Успешно",
      description: "Заявка в друзья отправлена",
    });
  };

  const handleMessage = async (userId: string) => {
    const { data: existingMessages, error: fetchError } = await supabase
      .from("direct_messages")
      .select("*")
      .or(`and(sender_id.eq.${supabase.auth.getUser()?.data.user?.id},receiver_id.eq.${userId}),and(sender_id.eq.${userId},receiver_id.eq.${supabase.auth.getUser()?.data.user?.id})`)
      .limit(1);

    if (fetchError) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Не удалось проверить существующие сообщения",
      });
      return;
    }

    if (!existingMessages || existingMessages.length === 0) {
      const { error: insertError } = await supabase
        .from("direct_messages")
        .insert({
          sender_id: supabase.auth.getUser()?.data.user?.id,
          receiver_id: userId,
          content: "Привет! 👋",
        });

      if (insertError) {
        toast({
          variant: "destructive",
          title: "Ошибка",
          description: "Не удалось начать диалог",
        });
        return;
      }
    }

    navigate("/messages");
  };

  const viewProfile = (userId: string) => {
    navigate(`/profile/${userId}`);
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
              className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg shadow"
            >
              <div
                className="flex items-center gap-4 cursor-pointer"
                onClick={() => viewProfile(user.id)}
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
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleAddFriend(user.id)}
                >
                  <UserPlus className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleMessage(user.id)}
                >
                  <MessageSquare className="h-4 w-4" />
                </Button>
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