import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { Search } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useNavigate } from "react-router-dom";
import { MessageBubble } from "@/components/chat/MessageBubble";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { ChatInput } from "@/components/chat/ChatInput";
import { format } from "date-fns";

const Messages = () => {
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [message, setMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showChat, setShowChat] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const { data: currentUser } = useQuery({
    queryKey: ["current-user"],
    queryFn: async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      return user;
    },
  });

  const { data: conversations, refetch: refetchConversations } = useQuery({
    queryKey: ["conversations"],
    queryFn: async () => {
      if (!currentUser) return [];
      
      const { data: messages, error } = await supabase
        .from("direct_messages")
        .select(`
          *,
          sender:profiles!direct_messages_sender_id_fkey(id, username, avatar_url, first_name, last_name),
          receiver:profiles!direct_messages_receiver_id_fkey(id, username, avatar_url, first_name, last_name)
        `)
        .or(`sender_id.eq.${currentUser.id},receiver_id.eq.${currentUser.id}`)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const uniqueConversations = messages.reduce((acc: any[], curr: any) => {
        const otherUser = curr.sender.id === currentUser.id ? curr.receiver : curr.sender;
        const existingConv = acc.find((conv: any) => {
          const convOtherUser = conv.sender.id === currentUser.id ? conv.receiver : conv.sender;
          return convOtherUser.id === otherUser.id;
        });
        if (!existingConv) {
          acc.push(curr);
        }
        return acc;
      }, []);

      return uniqueConversations;
    },
    enabled: !!currentUser,
  });

  const { data: messages, refetch: refetchMessages } = useQuery({
    queryKey: ["messages", selectedUser?.id],
    queryFn: async () => {
      if (!currentUser || !selectedUser) return [];
      
      const { data: friendship, error: friendshipError } = await supabase
        .from("friendships")
        .select("*")
        .or(`and(user_id.eq.${currentUser.id},friend_id.eq.${selectedUser.id}),and(user_id.eq.${selectedUser.id},friend_id.eq.${currentUser.id})`)
        .maybeSingle();

      if (friendshipError) {
        console.error("Error checking friendship:", friendshipError);
        return [];
      }

      if (!friendship || friendship.status !== 'accepted') {
        toast({
          variant: "destructive",
          title: "Ошибка",
          description: "Вы не можете отправлять сообщения этому пользователю, так как вы не являетесь друзьями",
        });
        return [];
      }

      const { data, error } = await supabase
        .from("direct_messages")
        .select("*")
        .or(`and(sender_id.eq.${currentUser.id},receiver_id.eq.${selectedUser.id}),and(sender_id.eq.${selectedUser.id},receiver_id.eq.${currentUser.id})`)
        .order("created_at", { ascending: true });

      if (error) throw error;

      const unreadMessages = data.filter(
        (msg) => msg.receiver_id === currentUser.id && !msg.read_at
      );
      
      if (unreadMessages.length > 0) {
        await supabase
          .from("direct_messages")
          .update({ read_at: new Date().toISOString() })
          .in(
            "id",
            unreadMessages.map((msg) => msg.id)
          );
      }

      return data;
    },
    enabled: !!currentUser && !!selectedUser,
  });

  useEffect(() => {
    if (!currentUser) return;

    const channel = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'direct_messages',
          filter: `sender_id=eq.${currentUser.id},receiver_id=eq.${selectedUser?.id}`
        },
        () => {
          refetchMessages();
          refetchConversations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUser, selectedUser, refetchMessages, refetchConversations]);

  const sendMessage = async (content: string) => {
    if (!message.trim() || !selectedUser || !currentUser) return;

    const { error } = await supabase
      .from("direct_messages")
      .insert({
        sender_id: currentUser.id,
        receiver_id: selectedUser.id,
        content: message.trim(),
        type: 'text',
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
    refetchConversations();
  };

  const handleSelectUser = (user: any) => {
    setSelectedUser(user);
    setShowChat(true);
  };

  const handleBack = () => {
    setShowChat(false);
    setSelectedUser(null);
  };

  const handleViewProfile = () => {
    if (selectedUser) {
      navigate(`/profile/${selectedUser.id}`);
    }
  };

  const getMessageStatus = (msg: any) => {
    if (msg.sender_id === currentUser?.id) {
      return msg.read_at ? "read" : "sent";
    }
    return undefined;
  };

  const filteredConversations = conversations?.filter((conv: any) => {
    const otherUser = conv.sender.id === currentUser?.id ? conv.receiver : conv.sender;
    const fullName = `${otherUser.first_name || ''} ${otherUser.last_name || ''}`.trim();
    return fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
           otherUser.username?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="p-2 md:p-4 max-w-6xl mx-auto h-[calc(100vh-4rem)]">
      <h1 className="text-2xl font-bold mb-4">Сообщения</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[calc(100vh-8rem)] bg-background rounded-lg shadow-sm overflow-hidden">
        {(!isMobile || !showChat) && (
          <div className="border-r flex flex-col h-full">
            <div className="p-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  className="pl-9"
                  placeholder="Поиск чатов..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <ScrollArea className="flex-1 px-3">
              <div className="space-y-1">
                {filteredConversations?.map((conv: any) => {
                  const otherUser = conv.sender.id === currentUser?.id ? conv.receiver : conv.sender;
                  const fullName = `${otherUser.first_name || ''} ${otherUser.last_name || ''}`.trim() || otherUser.username;
                  return (
                    <div
                      key={conv.id}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-accent/50 transition-colors",
                        selectedUser?.id === otherUser.id ? "bg-accent" : ""
                      )}
                      onClick={() => handleSelectUser(otherUser)}
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={otherUser.avatar_url} />
                        <AvatarFallback>
                          {otherUser.username?.charAt(0)?.toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{fullName}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {format(new Date(conv.created_at), "dd.MM.yyyy HH:mm")}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </div>
        )}
        
        <div className="md:col-span-2 flex flex-col h-full">
          {selectedUser ? (
            <>
              <ChatHeader
                avatar={selectedUser.avatar_url}
                name={`${selectedUser.first_name || ''} ${selectedUser.last_name || ''}`.trim() || selectedUser.username}
                username={selectedUser.username}
                onBack={handleBack}
                onViewProfile={handleViewProfile}
                showBackButton={isMobile}
              />
              
              <ScrollArea className="flex-1 px-4">
                <div className="space-y-3 py-4 max-w-3xl mx-auto">
                  {messages?.map((msg) => (
                    <MessageBubble
                      key={msg.id}
                      content={msg.content}
                      isCurrentUser={msg.sender_id === currentUser?.id}
                      timestamp={msg.created_at}
                      status={getMessageStatus(msg)}
                    />
                  ))}
                </div>
              </ScrollArea>
              
              <ChatInput
                value={message}
                onChange={setMessage}
                onSend={() => sendMessage(message)}
              />
            </>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              Выберите диалог для начала общения
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;
