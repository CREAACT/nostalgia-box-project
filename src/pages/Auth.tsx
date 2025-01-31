import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Auth = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Пожалуйста, введите корректный email";
    }
    return null;
  };

  const validatePassword = (password: string) => {
    if (password.length < 6) {
      return "Пароль должен содержать минимум 6 символов";
    }
    return null;
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate inputs
    const emailError = validateEmail(email);
    if (emailError) {
      setError(emailError);
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) {
          if (error.message === "Invalid login credentials") {
            setError("Неверный email или пароль");
          } else {
            setError("Ошибка при входе. Пожалуйста, проверьте ваши данные");
          }
          return;
        }
        navigate("/");
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) {
          if (error.message === "User already registered") {
            setError("Пользователь с таким email уже зарегистрирован");
          } else if (error.message === "Password should be at least 6 characters") {
            setError("Пароль должен содержать минимум 6 символов");
          } else {
            setError("Ошибка при регистрации. Пожалуйста, попробуйте позже");
          }
          return;
        }
        toast({
          title: "Регистрация успешна!",
          description: "Пожалуйста, проверьте вашу почту для подтверждения.",
        });
      }
    } catch (error: any) {
      setError("Произошла ошибка при авторизации. Пожалуйста, попробуйте позже");
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
            {!isLogin && (
              <p className="text-sm text-gray-500 mt-1">
                Пароль должен содержать минимум 6 символов
              </p>
            )}
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

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