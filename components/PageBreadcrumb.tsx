import React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
const { Link } = ReactRouterDOM as any;
import { Home, ChevronRight } from 'lucide-react';

export interface BreadcrumbCrumb {
  label: string;
  to?: string;
}

interface Props {
  crumbs: BreadcrumbCrumb[];
}

export default function PageBreadcrumb({ crumbs }: Props) {
  return (
    <div className="bg-white border-b border-slate-200">
      <div className="max-w-[1320px] mx-auto px-5 md:px-12 py-3.5 flex items-center gap-2 flex-wrap">
        <Link
          to="/"
          className="flex items-center text-[#170038]/60 hover:text-[#170038] transition-colors"
          aria-label="Home"
        >
          <Home size={15} strokeWidth={2} />
        </Link>

        {crumbs.map((crumb, i) => (
          <React.Fragment key={i}>
            <ChevronRight size={13} className="text-slate-300 shrink-0" strokeWidth={2.5} />
            {crumb.to && i < crumbs.length - 1 ? (
              <Link
                to={crumb.to}
                className="text-[13px] font-medium text-[#170038]/60 hover:text-[#170038] transition-colors whitespace-nowrap"
              >
                {crumb.label}
              </Link>
            ) : (
              <span className="text-[13px] font-bold text-[#170038] whitespace-nowrap">
                {crumb.label}
              </span>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
