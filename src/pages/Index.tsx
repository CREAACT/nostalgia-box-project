import { TimeCapsule } from "@/components/TimeCapsule";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-capsule-300 to-capsule-400 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Сохраните воспоминания в капсуле времени</h1>
          <p className="text-lg text-gray-600">
            Создайте цифровую капсулу времени и откройте её в будущем
          </p>
        </div>
        <TimeCapsule />
      </div>
    </div>
  );
};

export default Index;