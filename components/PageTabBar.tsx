import React, { useEffect, useRef } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
const { useSearchParams } = ReactRouterDOM as any;

export interface TabItem { label: string; key: string; }

interface Props { tabs: TabItem[]; }

/** Fixed header height + tab bar height combined — used as the spacer so content starts below both. */
const TOTAL_OFFSET = 143; // 86px header + 57px tab bar

export default function PageTabBar({ tabs }: Props) {
  const [searchParams, setSearchParams] = useSearchParams();
  const active = searchParams.get('tab') || tabs[0]?.key;
  const scrollRef = useRef<HTMLDivElement>(null);
  const activeButtonRef = useRef<HTMLButtonElement>(null);

  // Scroll active tab into view inside the horizontal scroll container
  useEffect(() => {
    const btn = activeButtonRef.current;
    const container = scrollRef.current;
    if (!btn || !container) return;
    const btnLeft = btn.offsetLeft;
    const btnRight = btnLeft + btn.offsetWidth;
    const containerLeft = container.scrollLeft;
    const containerRight = containerLeft + container.offsetWidth;
    if (btnLeft < containerLeft) {
      container.scrollTo({ left: btnLeft - 16, behavior: 'smooth' });
    } else if (btnRight > containerRight) {
      container.scrollTo({ left: btnRight - container.offsetWidth + 16, behavior: 'smooth' });
    }
  }, [active]);

  const setTab = (key: string) => {
    setSearchParams({ tab: key });
  };

  return (
    <>
      {/* Fixed tab bar — always visible below the header */}
      <div className="fixed top-[86px] left-0 right-0 z-50 bg-[#170038] border-b border-white/10">
        <div className="max-w-[1320px] mx-auto px-4 md:px-12">
          <div
            ref={scrollRef}
            className="flex items-end overflow-x-auto"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' } as React.CSSProperties}
          >
            {tabs.map((tab) => {
              const isActive = active === tab.key;
              return (
                <button
                  key={tab.key}
                  ref={isActive ? activeButtonRef : undefined}
                  type="button"
                  onClick={() => setTab(tab.key)}
                  className={`relative shrink-0 py-[18px] px-5 md:px-6 text-[13px] md:text-[14px] transition-colors whitespace-nowrap ${
                    isActive
                      ? 'text-white font-bold'
                      : 'text-indigo-200/55 font-medium hover:text-indigo-100'
                  }`}
                >
                  {tab.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
      {/* Spacer: pushes page content below both the fixed header and fixed tab bar */}
      <div style={{ height: TOTAL_OFFSET }} aria-hidden="true" />
    </>
  );
}

/** Reads current active tab key from URL search params */
export function useActiveTab(tabs: TabItem[]): string {
  const [searchParams] = (ReactRouterDOM as any).useSearchParams();
  return searchParams.get('tab') || tabs[0]?.key || '';
}
