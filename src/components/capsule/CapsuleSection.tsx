import { CapsuleBottle } from "./CapsuleBottle";

interface CapsuleSectionProps {
  title: string;
  capsules: any[];
  onCapsuleClick: (capsule: any) => void;
}

export const CapsuleSection = ({ title, capsules, onCapsuleClick }: CapsuleSectionProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
        {title}
      </h3>
      {capsules.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {capsules.map((capsule) => (
            <CapsuleBottle
              key={capsule.id}
              title={capsule.title}
              onClick={() => onCapsuleClick(capsule)}
            />
          ))}
        </div>
      ) : (
        <p className="text-gray-500 dark:text-gray-400">Нет капсул в этой категории</p>
      )}
    </div>
  );
};