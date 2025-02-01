import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";

const Messages = () => {
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [message, setMessage] = useState("");
  const { toast } = useToast();

  const { data: conversations } = useQuery({
    queryKey: ["conversations"],
    queryFn: async () => {
      const { data: messages, error } = await supabase
        .from("direct_messages")
        .select(`
          *,
          sender:sender_id(id, username, avatar_url),
          receiver:receiver_id(id, username, avatar_url)
        `)
        .or(`sender_id.eq.${supabase.auth.getUser()?.data.user?.id},receiver_id.eq.${supabase.auth.getUser()?.data.user?.id}`)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return messages;
    },
  });

  const { data: messages, refetch: refetchMessages } = useQuery({
    queryKey: ["messages", selectedUser?.id],
    queryFn: async () => {
      if (!selectedUser) return [];
      
      const { data, error } = await supabase
        .from("direct_messages")
        .select("*")
        .or(`and(sender_id.eq.${supabase.auth.getUser()?.data.user?.id},receiver_id.eq.${selectedUser.id}),and(sender_id.eq.${selectedUser.id},receiver_id.eq.${supabase.auth.getUser()?.data.user?.id})`)
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: !!selectedUser,
  });

  const sendMessage = async () => {
    if (!message.trim() || !selectedUser) return;

    const { error } = await supabase
      .from("direct_messages")
      .insert({
        sender_id: supabase.auth.getUser()?.data.user?.id,
        receiver_id: selectedUser.id,
        content: message.trim(),
      });

    if (error) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Не удалось отправить сообщение",
      });
      return;
    }

    setMessage("");
    refetchMessages();
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Сообщения</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">Диалоги</h2>
          <ScrollArea className="h-[600px]">
            {conversations?.map((conv: any) => {
              const otherUser = conv.sender.id === supabase.auth.getUser()?.data.user?.id ? conv.receiver : conv.sender;
              return (
                <div
                  key={conv.id}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-accent ${
                    selectedUser?.id === otherUser.id ? "bg-accent" : ""
                  }`}
                  onClick={() => setSelectedUser(otherUser)}
                >
                  <Avatar>
                    <AvatarImage src={otherUser.avatar_url} />
                    <AvatarFallback>
                      {otherUser.username?.charAt(0)?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{otherUser.username}</p>
                    <p className="text-sm text-gray-500">
                      {format(new Date(conv.created_at), "dd.MM.yyyy HH:mm")}
                    </p>
                  </div>
                </div>
              );
            })}
          </ScrollArea>
        </div>
        
        <div className="md:col-span-2 border rounded-lg p-4">
          {selectedUser ? (
            <>
              <div className="flex items-center gap-3 mb-4 p-3 border-b">
                <Avatar>
                  <AvatarImage src={selectedUser.avatar_url} />
                  <AvatarFallback>
                    {selectedUser.username?.charAt(0)?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-semibold">{selectedUser.username}</h2>
              </div>
              
              <ScrollArea className="h-[500px] mb-4">
                <div className="space-y-4">
                  {messages?.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${
                        msg.sender_id === supabase.auth.getUser()?.data.user?.id
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[70%] p-3 rounded-lg ${
                          msg.sender_id === supabase.auth.getUser()?.data.user?.id
                            ? "bg-primary text-primary-foreground"
                            : "bg-accent"
                        }`}
                      >
                        <p>{msg.content}</p>
                        <p className="text-xs mt-1 opacity-70">
                          {format(new Date(msg.created_at), "HH:mm")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              
              <div className="flex gap-2">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Введите сообщение..."
                  onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                />
                <button
                  onClick={sendMessage}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg"
                >
                  Отправить
                </button>
              </div>
            </>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">
              Выберите диалог для начала общения
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;