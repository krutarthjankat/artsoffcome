"use client";

import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import chaptersData from "../assets/data.json";
import logo from "../assets/logo.jpg";
import Image from "next/image";
import { Toggle } from "@/components/ui/toggle";

import {
  AtomIcon,
  CaretRightIcon,
  FlaskIcon,
  MathOperationsIcon,
  FunctionIcon,
  RulerIcon,
  WaveSineIcon,
  LightbulbIcon,
  CircleIcon,
  ArrowDownIcon,
  ArrowUpIcon,
  ArrowLeftIcon,
  ArrowsDownUpIcon,
  CaretDownIcon,
} from "@phosphor-icons/react";

const chapterIcons = [
  AtomIcon,
  FunctionIcon,
  RulerIcon,
  WaveSineIcon,
  LightbulbIcon,
  CircleIcon,
  ArrowDownIcon,
  ArrowUpIcon,
  FlaskIcon,
  MathOperationsIcon,
];

export default function JEEChapterManagement() {
  const [activeTab, setActiveTab] = useState("Physics");
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
  const [selectedUnits, setSelectedUnits] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [showWeakChapters, setShowWeakChapters] = useState(false);
  const [showNotStarted, setShowNotStarted] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    setMounted(true);
  }, []);

  // Filter chapters by active subject
  const subjectChapters = chaptersData.filter(
    (chapter) => chapter.subject === activeTab
  );

  // Get unique classes and units for current subject
  const uniqueClasses = [
    ...new Set(subjectChapters.map((chapter) => chapter.class)),
  ];
  const uniqueUnits = [
    ...new Set(subjectChapters.map((chapter) => chapter.unit)),
  ];
  const uniqueStatuses = [
    ...new Set(chaptersData.map((chapter) => chapter.status)),
  ];

  // Apply filters
  const filteredChapters = useMemo(() => {
    const filtered = subjectChapters.filter((chapter) => {
      const classMatch =
        selectedClasses.length === 0 || selectedClasses.includes(chapter.class);
      const unitMatch =
        selectedUnits.length === 0 || selectedUnits.includes(chapter.unit);
      const statusMatch =
        selectedStatuses.length === 0 ||
        selectedStatuses.includes(chapter.status);
      const weakMatch = !showWeakChapters || chapter.isWeakChapter;
      const notStart = !showNotStarted || chapter.status === "Not Started";

      return classMatch && unitMatch && statusMatch && weakMatch && notStart;
    });

    // Sort by chapter name
    filtered.sort((a, b) => {
      const comparison = a.chapter.localeCompare(b.chapter);
      return sortOrder === "asc" ? comparison : -comparison;
    });

    return filtered;
  }, [
    subjectChapters,
    selectedClasses,
    selectedUnits,
    selectedStatuses,
    showWeakChapters,
    showNotStarted,
    sortOrder,
  ]);

  // Calculate total questions and trend
  const calculateStats = (chapter: any) => {
    const years = Object.keys(chapter.yearWiseQuestionCount);
    const totalQuestions = Object.values(chapter.yearWiseQuestionCount).reduce(
      (sum: number, count: any) => sum + count,
      0
    );

    // Calculate trend (comparing last 2 years)
    const recent = chapter.yearWiseQuestionCount["2025"] || 0;
    const previous = chapter.yearWiseQuestionCount["2024"] || 0;
    const trend =
      recent > previous ? "up" : recent < previous ? "down" : "neutral";

    return { totalQuestions, trend, recent, previous };
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return (
          <ArrowUpIcon
            className="w-3 h-3 text-[#56eeb0]"
            weight="bold"
            color="#007f42"
          />
        );
      case "down":
        return (
          <ArrowDownIcon
            className="w-3 h-3 text-[#fb484d]"
            weight="bold"
            color="#e02a2f"
          />
        );
      default:
        return;
    }
  };

  const MultiSelectDropdown = ({
    title,
    options,
    selected,
    onSelectionChange,
  }: {
    title: string;
    options: string[];
    selected: string[];
    onSelectionChange: (values: string[]) => void;
  }) => (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="!p-2 justify-between dark:bg-[var(--background)] rounded-md text-base rounded-xl dark:border-[var(--border)] border-2 border-gray-200"
        >
          {selected.length > 0 ? `${title} (${selected.length})` : title}
          <CaretDownIcon className="w-2 h-2" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56">
        <div className="space-y-2">
          {options.map((option) => (
            <div key={option} className="flex items-center space-x-2">
              <Checkbox
                id={`${title}-${option}`}
                checked={selected.includes(option)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    onSelectionChange([...selected, option]);
                  } else {
                    onSelectionChange(
                      selected.filter((item) => item !== option)
                    );
                  }
                }}
              />
              <Label htmlFor={`${title}-${option}`} className="text-sm">
                {option}
              </Label>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );

  const ChapterItem = ({ chapter, index }: { chapter: any; index: number }) => {
    const IconComponent = chapterIcons[index % chapterIcons.length];
    const stats = calculateStats(chapter);
    return (
      <div className="flex flex-row items-start sm:items-center justify-between gap-2 sm:gap-4 p-0 md:p-3 rounded-lg md:border md:border-gray-300 md:dark:border-[var(--border)] hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
        {/* Icon + Chapter Info */}
        <div className="flex flex-row w-7/10 items-center gap-4 md:gap-1 lg:gap-4 truncate">
          {/* Icon */}
          <div className="w-6 sm:w-8 sm:h-8 flex items-center justify-center shrink-0">
            <IconComponent className="w-5.5 h-5.5 lg:w-6 lg:h-6 text-gray-600 dark:text-white" />
          </div>

          {/* Content */}
          <div className="flex flex-col justify-between gap-2 h-full flex-1 min-w-0">
            <h3 className="text-sm lg:text-lg md:text-base font-medium text-gray-900 dark:text-white truncate whitespace-nowrap overflow-hidden">
              {chapter.chapter}
            </h3>

            <div className="text-xs sm:text-sm flex items-center sm:hidden text-gray-500 dark:text-gray-400 ">
              2025:&nbsp;
              <span className="font-semibold">{stats.recent}Qs</span>
              &nbsp;
              {getTrendIcon(stats.trend)}
              &nbsp;| 2024:&nbsp;
              <span className="font-semibold">{stats.previous}Qs</span>
            </div>
          </div>
        </div>

        <div className="sm:hidden p-1 w-20 text-xs text-center text-gray-500 dark:text-gray-400 whitespace-nowrap">
          {stats.totalQuestions}/205 Qs
        </div>
        {/* Stats (Only show expanded view on sm and above) */}
        <div className="hidden sm:flex items-center gap-4 text-xs lg:text-sm text-gray-600 dark:text-gray-400 shrink-0">
          <div className="flex items-center gap-1">
            <div>
              2025:&nbsp;<span className="font-semibold">{stats.recent}Qs</span>
            </div>
            {getTrendIcon(stats.trend)}
            <div className="h-4 w-0.25 bg-gray-400 dark:bg-[var(--border)]" />
            <div className="w-15 lg:w-20">
              2024:&nbsp;
              <span className="font-semibold">{stats.previous}Qs</span>
            </div>
          </div>
          <div className="h-4 w-0.25 bg-gray-300 dark:bg-[var(--border)]" />
          <div className="w-18 lg:w-20">{stats.totalQuestions}/205 Qs</div>
        </div>
      </div>
    );
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[var(--background)] transition-colors">
      {/* Desktop View */}
      <div className="hidden md:block">
        <div className="flex justify-center h-screen">
          {/* Sidebar */}
          <div className="w-1/4 lg:w-xs px-2 min-w-0 text-[var(--sidebar-foreground)] border-r border-[var(--sidebar-border)] dark:text-[var(--sidebar-foreground)] dark:border-[var(--border)]">
            <div className="flex-col p-2 lg:p-6 gap-4 h-screen">
              <div>
                <div className="flex items-center justify-center mb-3">
                  <div className="flex items-center gap-4">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center bg-[var(--subject-physics)] dark:bg-[var(--subject-physics)]">
                      <Image
                        src={logo}
                        alt="Logo"
                        width={200}
                        height={100}
                        className="rounded-lg"
                      />
                    </div>
                    <span className="font-bold text-xl">JEE Main</span>
                  </div>
                </div>
                <div className="text-xs lg:text-sm text-center mb-4 text-[var(--sidebar-ring)] dark:text-[#b9bfd0]">
                  2025 - 2009 | 173 Papers | 15825 Qs
                </div>
              </div>
              {/* Subject buttons */}
              <div className="flex flex-col mt-6">
                {[
                  {
                    name: "Physics",
                    label: "Physics PYQs",
                    color: "bg-[var(--subject-physics)]",
                    Icon: AtomIcon,
                  },
                  {
                    name: "Chemistry",
                    label: "Chemistry PYQs",
                    color: "bg-[var(--subject-chemistry)]",
                    Icon: FlaskIcon,
                  },
                  {
                    name: "Mathematics",
                    label: "Mathematics PYQs",
                    color: "bg-[var(--subject-mathematics)]",
                    Icon: MathOperationsIcon,
                  },
                ].map(({ name, label, color, Icon }, index) => (
                  <div key={index}>
                    <button
                      key={index + 10}
                      onClick={() => {
                        setSelectedClasses([]);
                        setSelectedUnits([]);
                        setActiveTab(name);
                      }}
                      className={`w-full flex items-center justify-between p-2 lg:p-3 mb-4 rounded-xl text-left transition-colors ${
                        activeTab === name
                          ? `bg-[var(--sidebar-active-bg)] text-[var(--subject-text)] dark:bg-[${color}] dark:text-[var(--subject-text)]`
                          : `bg-white dark:bg-[var(--background)] hover:bg-gray-100 dark:hover:bg-gray-800`
                      }`}
                    >
                      <div className="flex flex-row gap-2 lg:gap-3 items-center">
                        <div
                          className={`min-w-6 h-6 mx-1 text-lg rounded-md flex items-center justify-center ${color}`}
                        >
                          <Icon className="w-4 h-4 text-white" />
                        </div>
                        <div className="w-auto md:text-sm lg:text-base font-medium">
                          {label}
                        </div>
                      </div>
                      <CaretRightIcon className="w-4 h-4 ml-auto " />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex border flex-col w-[848px] ">
            {/* Header */}
            <div className="px-5 pt-5 pb-4 border-b dark:border-[#1e2738] flex flex-col gap-3">
              <div className="flex justify-center items-center gap-4">
                <div
                  className={`w-6 h-6 rounded-md flex items-center justify-center ${
                    activeTab === "Physics"
                      ? "bg-[var(--subject-physics)]"
                      : activeTab === "Chemistry"
                      ? "bg-[var(--subject-chemistry)]"
                      : "bg-[var(--subject-mathematics)]"
                  }`}
                >
                  {activeTab === "Physics" && (
                    <AtomIcon className="w-4 h-4 text-white" />
                  )}
                  {activeTab === "Chemistry" && (
                    <FlaskIcon className="w-4 h-4 text-white" />
                  )}
                  {activeTab === "Mathematics" && (
                    <MathOperationsIcon className="w-4 h-4 text-white" />
                  )}
                </div>

                <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 text-center">
                  {activeTab} PYQs
                </h1>
              </div>
              <p className="text-sm text-gray-500 dark:text-[#b9bfd0] text-center">
                Chapter-wise Collection of {activeTab} PYQs
              </p>
            </div>

            {/* Filters */}
            <div className="px-4 pt-3 py-2">
              <div className="flex items-center mb-4 gap-2 pb-1">
                <MultiSelectDropdown
                  title="Class"
                  options={uniqueClasses}
                  selected={selectedClasses}
                  onSelectionChange={setSelectedClasses}
                />
                <MultiSelectDropdown
                  title="Units"
                  options={uniqueUnits}
                  selected={selectedUnits}
                  onSelectionChange={setSelectedUnits}
                />
                <div className="h-5 w-0.25 bg-neutral-200"></div>
                <Toggle
                  id="not-started"
                  pressed={showNotStarted}
                  onPressedChange={setShowNotStarted}
                  className={`border-2 p-2 text-base rounded-xl hover:bg-white hover:text-black ${
                    activeTab === "Physics"
                      ? "data-[state=on]:border-[var(--subject-physics)]"
                      : activeTab === "Chemistry"
                      ? "data-[state=on]:border-[var(--subject-chemistry)]"
                      : "data-[state=on]:border-[var(--subject-mathematics)]"
                  }`}
                >
                  <Label htmlFor="not-started" className="text-base">
                    Not Started
                  </Label>
                </Toggle>

                <Toggle
                  id="weak-chapters"
                  pressed={showWeakChapters}
                  onPressedChange={setShowWeakChapters}
                  className={`border-2 p-2 text-base rounded-xl hover:bg-white hover:text-black ${
                    activeTab === "Physics"
                      ? "data-[state=on]:border-[var(--subject-physics)]"
                      : activeTab === "Chemistry"
                      ? "data-[state=on]:border-[var(--subject-chemistry)]"
                      : "data-[state=on]:border-[var(--subject-mathematics)]"
                  }`}
                >
                  <Label htmlFor="weak-chapters" className="text-base">
                    Weak Chapters
                  </Label>
                </Toggle>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm dark:text-white">
                  Showing all chapters {"("}
                  {filteredChapters.length}
                  {")"}
                </span>
                <Toggle
                  pressed={sortOrder === "desc"}
                  onPressedChange={(pressed) =>
                    setSortOrder(pressed ? "desc" : "asc")
                  }
                  className="text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 px-2 py-1 h-8"
                >
                  <ArrowsDownUpIcon className="w-8 h-8" weight="bold" />
                  Sort
                </Toggle>
              </div>
            </div>
            <hr className="border dark:border-[#1e2738]" />
            {/* Chapter List */}
            <div className="flex-1 overflow-y-scroll">
              <div className="space-y-4 p-4">
                {filteredChapters.map((chapter, index) => (
                  <ChapterItem
                    key={`${chapter.subject}-${chapter.chapter}`}
                    chapter={chapter}
                    index={index}
                  />
                ))}
              </div>
              {filteredChapters.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500 dark:text-gray-400">
                    No chapters found matching your filters.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile View */}
      <div className="md:hidden">
        {/* Header */}
        <div className="bg-white dark:bg-[var(--background)] px-4 pt-4">
          <div className="flex items-center justify-between mb-6">
            <ArrowLeftIcon className="w-5 h-5 absolute text-black dark:text-white" />
            <div className="flex items-center justify-center gap-3 w-full">
              <span className="font-bold text-base text-center dark:text-white">
                JEE Main
              </span>
            </div>
          </div>

          {/* Subject Tabs */}
          <div className="flex justify-around mb-3 border-b border-gray-200 dark:border-gray-700">
            {[
              {
                key: "Physics",
                label: "Phy",
                icon: AtomIcon,
                bgColor: "var(--subject-physics)",
              },
              {
                key: "Chemistry",
                label: "Chem",
                icon: FlaskIcon,
                bgColor: "var(--subject-chemistry)",
              },
              {
                key: "Mathematics",
                label: "Math",
                icon: MathOperationsIcon,
                bgColor: "var(--subject-mathematics)",
              },
            ].map(({ key, label, icon: Icon, bgColor }) => (
              <div key={key} className="flex flex-col items-center justify-end">
                <button
                  onClick={() => setActiveTab(key)}
                  className={`flex flex-col items-center gap-1 ${
                    activeTab === key
                      ? "text-blue-500 dark:text-[#6fbbfc] font-bold"
                      : "text-gray-500 dark:text-gray-300"
                  }`}
                >
                  <div
                    className="w-5 h-5 mx-1 rounded-md flex items-center justify-center"
                    style={{ backgroundColor: bgColor }}
                  >
                    <Icon className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-sm">{label}</span>
                </button>
                <div className="h-0.5 w-full mt-2 rounded-lg">
                  {activeTab === key ? (
                    <div className=" h-0.5 bg-blue-500 dark:bg-[#6fbbfc] rounded-full mx-auto" />
                  ) : (
                    <div className=" h-0.5 bg-transparent mx-auto" />
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="relative mb-4 bg-gradient-to-l from-white dark:from-[#222e3f] to-transparent rounded-full bg-white dark:bg-[var(--background)]">
            {/* Scrollable Filters */}
            <div
              id="filter-scroll-container"
              className="flex items-center gap-2 overflow-x-auto pr-10 scrollbar-none text-sm"
            >
              <div className="flex-shrink-0">
                <MultiSelectDropdown
                  title="Class"
                  options={uniqueClasses}
                  selected={selectedClasses}
                  onSelectionChange={setSelectedClasses}
                />
              </div>

              <div className="flex-shrink-0">
                <MultiSelectDropdown
                  title="Units"
                  options={uniqueUnits}
                  selected={selectedUnits}
                  onSelectionChange={setSelectedUnits}
                />
              </div>
              <div className="h-6 md:w-5 border-1 border-neutral-200"> </div>
              <div className="flex-shrink-0">
                <Toggle
                  id="not-started-mobile"
                  pressed={showNotStarted}
                  onPressedChange={setShowNotStarted}
                  className="text-black dark:text-white px-2 py-1 rounded-xl dark:border-[var(--border)] border border-gray-200 whitespace-nowrap"
                >
                  Not Started
                </Toggle>
              </div>

              <div className="flex-shrink-0">
                <Toggle
                  id="weak-chapters-mobile"
                  pressed={showWeakChapters}
                  onPressedChange={setShowWeakChapters}
                  className="text-black dark:text-white px-2 py-1 rounded-xl dark:border-[var(--border)] border border-gray-200 whitespace-nowrap"
                >
                  Weak Chapters
                </Toggle>
              </div>
            </div>

            {/* Scroll Right Button */}
            <button
              onClick={() => {
                const container = document.getElementById(
                  "filter-scroll-container"
                );
                container?.scrollBy({ left: 100, behavior: "smooth" });
              }}
              className="absolute right-0 top-1/2 -translate-y-1/2 p-2 h-full w-6 bg-gradient-to-l from-white dark:from-[#222e3f] to-transparent rounded-full bg-white dark:bg-[var(--background)] z-10 text-center"
            >
              <CaretRightIcon
                size={16}
                className="text-gray-500 dark:text-white"
              />
            </button>
          </div>
        </div>

        {/* Chapter List */}
        <div className="px-4 pb-28 bg-white dark:bg-[var(--background)] ">
          {/* Header Row */}
          <div className="flex items-center justify-between mb-6 text-sm dark:text-gray-400">
            <span>Showing all chapters ({filteredChapters.length})</span>
            <Toggle
              pressed={sortOrder === "desc"}
              onPressedChange={(pressed) =>
                setSortOrder(pressed ? "desc" : "asc")
              }
              className="text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 px-2 py-1 rounded-md"
            >
              <ArrowsDownUpIcon className="w-4 h-4" />
              Sort
            </Toggle>
          </div>

          {/* Chapter List */}
          <div className="flex-1 overflow-y-scroll">
            <div className="space-y-2 flex flex-col gap-5">
              {filteredChapters.map((chapter, index) => (
                <ChapterItem
                  key={`${chapter.subject}-${chapter.chapter}`}
                  chapter={chapter}
                  index={index}
                />
              ))}
            </div>

            {filteredChapters.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">
                  No chapters found matching your filters.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
