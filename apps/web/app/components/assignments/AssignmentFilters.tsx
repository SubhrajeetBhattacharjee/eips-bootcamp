'use client';

import React, { useState } from 'react';
import { Search, ChevronDown } from 'lucide-react';

interface AssignmentFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: string;
  onStatusChange: (status: string) => void;
  difficultyFilter: string;
  onDifficultyChange: (difficulty: string) => void;
  moduleFilter: string;
  onModuleChange: (module: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
}

export function AssignmentFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  difficultyFilter,
  onDifficultyChange,
  moduleFilter,
  onModuleChange,
  sortBy,
  onSortChange,
}: AssignmentFiltersProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'Not Started', label: 'Not Started' },
    { value: 'In Progress', label: 'In Progress' },
    { value: 'Submitted', label: 'Submitted' },
    { value: 'Under Review', label: 'Under Review' },
    { value: 'Completed', label: 'Completed' },
    { value: 'Overdue', label: 'Overdue' },
  ];

  const difficultyOptions = [
    { value: 'all', label: 'All Levels' },
    { value: 'Beginner', label: 'Beginner' },
    { value: 'Intermediate', label: 'Intermediate' },
    { value: 'Advanced', label: 'Advanced' },
  ];

  const moduleOptions = [
    { value: 'all', label: 'All Modules' },
    { value: 'Introduction', label: 'Module 1: Introduction' },
    { value: 'Structure', label: 'Module 2: Structure' },
    { value: 'Writing', label: 'Module 3: Writing' },
    { value: 'Review', label: 'Module 4: Review' },
    { value: 'Examples', label: 'Module 5: Examples' },
    { value: 'Advanced', label: 'Module 6: Advanced' },
  ];

  const sortOptions = [
    { value: 'deadline', label: 'Deadline (Nearest)' },
    { value: 'difficulty', label: 'Difficulty (Low to High)' },
    { value: 'xp-high', label: 'XP Reward (High)' },
    { value: 'xp-low', label: 'XP Reward (Low)' },
  ];

  const FilterDropdown = ({
    label,
    value,
    options,
    onChange,
    dropdownId,
  }: {
    label: string;
    value: string;
    options: { value: string; label: string }[];
    onChange: (value: string) => void;
    dropdownId: string;
  }) => {
    const selectedLabel = options.find((opt) => opt.value === value)?.label || label;
    const isOpen = openDropdown === dropdownId;

    return (
      <div className="relative">
        <button
          onClick={() => setOpenDropdown(isOpen ? null : dropdownId)}
          className="flex items-center gap-2 px-4 py-2.5 bg-gray-800/30 hover:bg-gray-800/50 border border-gray-700/50 hover:border-emerald-500/30 rounded-lg transition-all text-sm font-medium text-gray-300"
        >
          <span>{selectedLabel}</span>
          <ChevronDown
            size={16}
            className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 mt-2 w-48 bg-gray-900/95 border border-gray-700 rounded-lg shadow-2xl z-50 overflow-hidden backdrop-blur-sm">
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setOpenDropdown(null);
                }}
                className={`w-full text-left px-4 py-3 transition-colors ${
                  value === option.value
                    ? 'bg-emerald-500/20 text-emerald-300'
                    : 'text-gray-300 hover:bg-gray-800/50'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-4 p-6 bg-gradient-to-br from-gray-900/30 to-gray-800/20 border border-gray-800 rounded-2xl">
      {/* Search Bar */}
      <div className="relative">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          type="text"
          placeholder="Search assignments..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full bg-gray-800/30 border border-gray-700/50 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 transition-all"
        />
      </div>

      {/* Filter Row */}
      <div className="flex flex-wrap items-center gap-3">
        <FilterDropdown
          label="Status"
          value={statusFilter}
          options={statusOptions}
          onChange={onStatusChange}
          dropdownId="status"
        />

        <FilterDropdown
          label="Difficulty"
          value={difficultyFilter}
          options={difficultyOptions}
          onChange={onDifficultyChange}
          dropdownId="difficulty"
        />

        <FilterDropdown
          label="Module"
          value={moduleFilter}
          options={moduleOptions}
          onChange={onModuleChange}
          dropdownId="module"
        />

        <FilterDropdown
          label="Sort By"
          value={sortBy}
          options={sortOptions}
          onChange={onSortChange}
          dropdownId="sort"
        />

        {/* Reset Filters */}
        {(searchQuery || statusFilter !== 'all' || difficultyFilter !== 'all' || moduleFilter !== 'all') && (
          <button
            onClick={() => {
              onSearchChange('');
              onStatusChange('all');
              onDifficultyChange('all');
              onModuleChange('all');
            }}
            className="ml-auto px-4 py-2.5 text-sm font-medium text-gray-400 hover:text-emerald-400 transition-colors"
          >
            Clear Filters
          </button>
        )}
      </div>
    </div>
  );
}