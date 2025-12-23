import React from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';

interface PollProgressBarProps {
    totalVotes: number;
    yesVotes: number;
    noVotes: number;
}

export const PollProgressBar: React.FC<PollProgressBarProps> = ({ totalVotes, yesVotes, noVotes }) => {
    const yesPercent = totalVotes > 0 ? Math.round((yesVotes / totalVotes) * 100) : 0;
    const noPercent = totalVotes > 0 ? Math.round((noVotes / totalVotes) * 100) : 0;

    return (
        <div className="space-y-1">
            <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-ds-in-success-400 flex items-center gap-1">
                    <ThumbsUp className="w-3 h-3" /> Evet (%{yesPercent})
                </span>
                <span className="text-ds-in-destructive-400 flex items-center gap-1">
                    Hayır (%{noPercent}) <ThumbsDown className="w-3 h-3" />
                </span>
            </div>
            <div className="h-2.5 bg-ds-border-dark rounded-full overflow-hidden flex">
                <div
                    className="h-full bg-ds-in-success-500 transition-all duration-1000"
                    style={{ width: `${yesPercent}%` }}
                />
                <div
                    className="h-full bg-ds-in-destructive-500 transition-all duration-1000"
                    style={{ width: `${noPercent}%` }}
                />
            </div>
        </div>
    );
};

