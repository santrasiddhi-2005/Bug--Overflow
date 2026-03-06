import React from 'react';
import ReputationBadge from './ReputationBadge';

const BadgeInlineStats = ({ badges }) => {
    return (
        <div className="badge-inline-stats">
            <ReputationBadge level="gold" count={badges.gold?.length || 0} />
            <ReputationBadge level="silver" count={badges.silver?.length || 0} />
            <ReputationBadge level="bronze" count={badges.bronze?.length || 0} />
        </div>
    );
};

export default BadgeInlineStats;
