import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Search, User } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";

const Messages = () => {
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [message, setMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showUserProfile, setShowUserProfile] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [showChat, setShowChat] = useState(!isMobile);
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

  const sendMessage = async () => {
    if (!message.trim() || !selectedUser || !currentUser) return;

    const { error } = await supabase
      .from("direct_messages")
      .insert({
        sender_id: currentUser.id,
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

  const getMessageStatus = (msg: any) => {
    if (msg.sender_id === currentUser?.id) {
      return msg.read_at ? "Прочитано" : "Отправлено";
    }
    return "";
  };

  const filteredConversations = conversations?.filter((conv: any) => {
    const otherUser = conv.sender.id === currentUser?.id ? conv.receiver : conv.sender;
    const fullName = `${otherUser.first_name || ''} ${otherUser.last_name || ''}`.trim();
    return fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
           otherUser.username?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleViewProfile = () => {
    if (selectedUser) {
      navigate(`/profile/${selectedUser.id}`);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto h-[calc(100vh-4rem)]">
      <h1 className="text-3xl font-bold mb-6">Сообщения</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-12rem)]">
        {(!isMobile || !showChat) && (
          <div className="border rounded-lg p-4 flex flex-col h-full">
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  className="pl-10"
                  placeholder="Поиск чатов..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <ScrollArea className="flex-1">
              {filteredConversations?.map((conv: any) => {
                const otherUser = conv.sender.id === currentUser?.id ? conv.receiver : conv.sender;
                const fullName = `${otherUser.first_name || ''} ${otherUser.last_name || ''}`.trim() || otherUser.username;
                return (
                  <div
                    key={conv.id}
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-accent transition-colors ${
                      selectedUser?.id === otherUser.id ? "bg-accent" : ""
                    }`}
                    onClick={() => handleSelectUser(otherUser)}
                  >
                    <Avatar>
                      <AvatarImage src={otherUser.avatar_url} />
                      <AvatarFallback>
                        {otherUser.username?.charAt(0)?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{fullName}</p>
                      <p className="text-sm text-gray-500 truncate">
                        {format(new Date(conv.created_at), "dd.MM.yyyy HH:mm")}
                      </p>
                    </div>
                  </div>
                );
              })}
            </ScrollArea>
          </div>
        )}
        
        {(!isMobile || showChat) && (
          <div className="md:col-span-2 border rounded-lg flex flex-col h-full">
            {selectedUser ? (
              <>
                <div className="flex items-center gap-3 p-4 border-b bg-accent/50">
                  {isMobile && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleBack}
                      className="mr-2"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </Button>
                  )}
                  <Avatar>
                    <AvatarImage src={selectedUser.avatar_url} />
                    <AvatarFallback>
                      {selectedUser.username?.charAt(0)?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold">
                      {`${selectedUser.first_name || ''} ${selectedUser.last_name || ''}`.trim() || selectedUser.username}
                    </h2>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleViewProfile}
                  >
                    <User className="h-5 w-5" />
                  </Button>
                </div>
                
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {messages?.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${
                          msg.sender_id === currentUser?.id
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[70%] p-3 rounded-lg ${
                            msg.sender_id === currentUser?.id
                              ? "bg-primary text-primary-foreground"
                              : "bg-accent"
                          }`}
                        >
                          <p className="break-words">{msg.content}</p>
                          <div className="flex justify-between items-center mt-1 text-xs opacity-70">
                            <span>{format(new Date(msg.created_at), "HH:mm")}</span>
                            {msg.sender_id === currentUser?.id && (
                              <span className="ml-2">{getMessageStatus(msg)}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                
                <div className="p-4 border-t">
                  <div className="flex gap-2">
                    <Input
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Введите сообщение..."
                      onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                      className="flex-1"
                    />
                    <Button onClick={sendMessage}>
                      Отправить
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                Выберите диалог для начала общения
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;