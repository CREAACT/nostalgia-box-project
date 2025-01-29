import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Auth = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        navigate("/");
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        toast({
          title: "Регистрация успешна!",
          description: "Пожалуйста, проверьте вашу почту для подтверждения.",
        });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Ошибка!",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-capsule-100 bg-opacity-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-xl animate-fade-in">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">
            {isLogin ? "Вход" : "Регистрация"}
          </h1>
          <p className="text-gray-600">
            {isLogin
              ? "Войдите в свою капсулу времени"
              : "Создайте свою капсулу времени"}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 border rounded-lg bg-capsule-400 bg-opacity-20"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Пароль</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 border rounded-lg bg-capsule-400 bg-opacity-20"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-capsule-200 hover:bg-capsule-200/90 text-gray-800 font-semibold py-3 rounded-lg transition-all duration-300 hover:shadow-lg"
          >
            {loading ? "Загрузка..." : isLogin ? "Войти" : "Зарегистрироваться"}
          </Button>
        </form>

        <div className="text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            {isLogin
              ? "Нет аккаунта? Зарегистрируйтесь"
              : "Уже есть аккаунт? Войдите"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;