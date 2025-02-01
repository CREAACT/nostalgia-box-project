import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";

const Friends = () => {
  const { toast } = useToast();

  const { data: currentUser } = useQuery({
    queryKey: ["current-user"],
    queryFn: async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      return user;
    },
  });

  const { data: friendships, refetch: refetchFriendships } = useQuery({
    queryKey: ["friendships"],
    queryFn: async () => {
      if (!currentUser) return [];
      
      const { data, error } = await supabase
        .from("friendships")
        .select(`
          *,
          friend:profiles!friendships_friend_id_fkey(id, username, avatar_url),
          user:profiles!friendships_user_id_fkey(id, username, avatar_url)
        `)
        .or(`user_id.eq.${currentUser.id},friend_id.eq.${currentUser.id}`);

      if (error) throw error;
      return data;
    },
    enabled: !!currentUser,
  });

  const handleFriendshipAction = async (friendshipId: string, status: 'accepted' | 'rejected') => {
    const { error } = await supabase
      .from("friendships")
      .update({ status })
      .eq("id", friendshipId);

    if (error) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Не удалось обновить статус дружбы",
      });
      return;
    }

    toast({
      title: "Успешно",
      description: status === 'accepted' ? "Заявка в друзья принята" : "Заявка в друзья отклонена",
    });

    refetchFriendships();
  };

  const pendingRequests = friendships?.filter(
    (f) => f.status === "pending" && f.friend_id === currentUser?.id
  ) || [];

  const friends = friendships?.filter(
    (f) => f.status === "accepted"
  ) || [];

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Друзья</h1>
      
      <Tabs defaultValue="friends" className="space-y-4">
        <TabsList>
          <TabsTrigger value="friends">
            Друзья ({friends.length})
          </TabsTrigger>
          <TabsTrigger value="requests">
            Заявки ({pendingRequests.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="friends" className="space-y-4">
          {friends.map((friendship) => {
            const friend = friendship.user_id === currentUser?.id
              ? friendship.friend
              : friendship.user;
            
            return (
              <div
                key={friendship.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={friend?.avatar_url} />
                    <AvatarFallback>
                      {friend?.username?.charAt(0)?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{friend?.username}</p>
                    <p className="text-sm text-gray-500">
                      Друзья с {format(new Date(friendship.created_at), "dd.MM.yyyy")}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
          
          {friends.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              У вас пока нет друзей
            </div>
          )}
        </TabsContent>

        <TabsContent value="requests" className="space-y-4">
          {pendingRequests.map((request) => (
            <div
              key={request.id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={request.user?.avatar_url} />
                  <AvatarFallback>
                    {request.user?.username?.charAt(0)?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{request.user?.username}</p>
                  <p className="text-sm text-gray-500">
                    Отправлено {format(new Date(request.created_at), "dd.MM.yyyy")}
                  </p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => handleFriendshipAction(request.id, "accepted")}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg"
                >
                  Принять
                </button>
                <button
                  onClick={() => handleFriendshipAction(request.id, "rejected")}
                  className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg"
                >
                  Отклонить
                </button>
              </div>
            </div>
          ))}
          
          {pendingRequests.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              У вас нет новых заявок в друзья
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Friends;