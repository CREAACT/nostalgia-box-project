import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TimeCapsule } from "@/components/TimeCapsule";
import { format } from "date-fns";
import { Search, Calendar } from "lucide-react";

interface CapsuleListProps {
  capsules: any[];
  session: any;
  isLoading: boolean;
}

export const CapsuleList = ({ capsules, session, isLoading }: CapsuleListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("date");

  const sortedAndFilteredCapsules = useMemo(() => {
    let filtered = capsules?.filter((capsule) =>
      capsule.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return filtered?.sort((a, b) => {
      if (sortBy === "date") {
        return new Date(a.open_date).getTime() - new Date(b.open_date).getTime();
      } else if (sortBy === "title") {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });
  }, [capsules, searchTerm, sortBy]);

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-pulse">Загрузка капсул...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Поиск по названию..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Сортировать по..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date">По дате открытия</SelectItem>
            <SelectItem value="title">По названию</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sortedAndFilteredCapsules?.map((capsule) => (
          <Card
            key={capsule.id}
            className={`p-6 transition-all duration-300 ${
              capsule.is_sealed
                ? "bg-capsule-200/80 hover:bg-capsule-200"
                : "bg-capsule-100/80 hover:bg-capsule-100"
            }`}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-semibold">{capsule.title}</h3>
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="w-4 h-4 mr-1" />
                {format(new Date(capsule.open_date), "dd.MM.yyyy")}
              </div>
            </div>
            <TimeCapsule
              initialData={capsule}
              session={session}
            />
          </Card>
        ))}
        
        {sortedAndFilteredCapsules?.length === 0 && (
          <div className="col-span-2 text-center py-8 text-gray-500">
            {searchTerm
              ? "Капсулы с таким названием не найдены"
              : "У вас пока нет капсул времени"}
          </div>
        )}
      </div>
    </div>
  );
};