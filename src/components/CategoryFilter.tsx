import React from 'react';

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  categoryCounts: Record<string, number>;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  categoryCounts,
}) => {
  return (
    <div className="border-b border-[#4A5D44] bg-[#2E3C2C]/95 sticky top-22 z-20 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 overflow-x-auto py-3 no-scrollbar scroll-smooth">
          {categories.map((category) => {
            const isSelected = selectedCategory === category;
            const count = categoryCounts[category] || 0;

            return (
              <button
                key={category}
                onClick={() => onSelectCategory(category)}
                className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all whitespace-nowrap shrink-0 flex items-center gap-2 cursor-pointer ${
                  isSelected
                    ? 'bg-[#F8F1EB] text-[#273224] font-semibold shadow-xs'
                    : 'text-[#CBD7CA] hover:text-[#FFFFFF] hover:bg-[#3B4C38]'
                }`}
              >
                <span>{category}</span>
                <span
                  className={`text-[11px] px-1.5 py-0.5 rounded-sm tabular-nums font-semibold ${
                    isSelected
                      ? 'bg-[#364332] text-[#F8F1EB]'
                      : 'text-[#9CB099] bg-[#243022]'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
