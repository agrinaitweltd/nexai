import React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
const { useSearchParams } = ReactRouterDOM as any;

export interface TabItem { label: string; key: string; }

interface Props { tabs: TabItem[]; }

export default function PageTabBar({ tabs }: Props) {
  const [searchParams, setSearchParams] = useSearchParams();
  const active = searchParams.get('tab') || tabs[0]?.key;

  const setTab = (key: string) => {
    setSearchParams({ tab: key });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="sticky top-[86px] z-50 bg-[#170038] border-b border-white/10">
      <div className="max-w-[1320px] mx-auto px-5 md:px-12">
        <div className="flex items-end overflow-x-auto"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' } as React.CSSProperties}
        >
          {tabs.map((tab) => {
            const isActive = active === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setTab(tab.key)}
                className={`relative shrink-0 py-[18px] px-6 text-[14px] transition-colors whitespace-nowrap ${
                  isActive
                    ? 'text-white font-bold'
                    : 'text-indigo-200/55 font-medium hover:text-indigo-100'
                }`}
              >
                {tab.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-cyan-400 to-blue-500" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/** Reads current active tab key from URL search params */
export function useActiveTab(tabs: TabItem[]): string {
  const [searchParams] = (ReactRouterDOM as any).useSearchParams();
  return searchParams.get('tab') || tabs[0]?.key || '';
}
