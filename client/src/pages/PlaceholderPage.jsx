import React from 'react';
import { Card } from '../components/ui/Card';
import { SectionHeader } from '../components/ui/SectionHeader';

export const PlaceholderPage = ({ title, category }) => {
  return (
    <div className="space-y-6">
      <SectionHeader
        title={title}
        description={`${category} • Ready for Step-by-Step Page Design`}
      />
      <Card className="p-12 text-center border-dashed">
        <h3 className="text-sm font-semibold text-slate-700">{title} Container</h3>
        <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
          This is a clean placeholder route verifying the navigation and shell. We will design this page in subsequent steps after reviewing the foundation.
        </p>
      </Card>
    </div>
  );
};
