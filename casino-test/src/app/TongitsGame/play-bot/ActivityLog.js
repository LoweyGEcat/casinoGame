// activity-log.tsx
import React, { useRef, useEffect, useState } from 'react';
import { Player } from '../../../hooks/use-tongit-game';
import { Card as CardType } from '../../../utils/card-utils';
import { Card } from './Card';

export function ActivityLog({ activities }) {
  const logEndRef = useRef(null);
  const [displayedActivities, setDisplayedActivities] = useState([]);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [displayedActivities]);

  useEffect(() => {
    if (activities.length > displayedActivities.length) {
      const newActivity = activities[activities.length - 1];
      setDisplayedActivities(prev => [...prev, { ...newActivity, details: '' }]);
      let charIndex = 0;
      const intervalId = setInterval(() => {
        if (charIndex <= newActivity.details.length) {
          setDisplayedActivities(prev => [
            ...prev.slice(0, -1),
            { ...newActivity, details: newActivity.details.slice(0, charIndex) }
          ]);
          charIndex++;
        } else {
          clearInterval(intervalId);
        }
      }, 30);
      return () => clearInterval(intervalId);
    }
  }, [activities]);

  const renderCards = (cards) => {
    return (
      <div className="flex flex-wrap gap-1 mt-1">
        {cards.map((card, i) => (
          <Card key={`${i}-${card.suit}-${card.rank}`} card={card} small />
        ))}
      </div>
    );
  };

  return (
    // REMOVE ACTIVITY LOG
    // <div className="h-full overflow-y-auto">
    //   {displayedActivities.map((activity, index) => (
    //     <div key={index} className="mb-2 text-sm">
    //       {(activity.type === 'draw' || activity.type === 'discard') && activity.card && (
    //         <div className="transform scale-75 origin-left inline-block ml-2">
    //           <Card card={activity.card} small={false} />
    //         </div>
    //       )}
    //     </div>
    //   ))}
    // </div>
    <div ref={logEndRef} />
  );
}
