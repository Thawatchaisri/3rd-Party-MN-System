import React from 'react';
import { RiskLevel } from '../types';

const RiskBadge: React.FC<{ level: RiskLevel }> = ({ level }) => {
  const styles = {
    [RiskLevel.LOW]: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    [RiskLevel.MEDIUM]: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    [RiskLevel.HIGH]: 'bg-orange-100 text-orange-700 border-orange-200',
    [RiskLevel.CRITICAL]: 'bg-red-100 text-red-700 border-red-200',
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${styles[level]}`}>
      {level}
    </span>
  );
};

export default RiskBadge;
