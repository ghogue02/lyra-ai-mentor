import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Calendar, Target, Award, Smile, Meh, Frown } from 'lucide-react';

interface ConfidenceEntry {
  date: string;
  level: number;
  notes: string;
  activity: string;
}

interface ConfidenceTrackerProps {
  onConfidenceUpdate?: (entries: ConfidenceEntry[]) => void;
}

export const ConfidenceTracker: React.FC<ConfidenceTrackerProps> = ({
  onConfidenceUpdate
}) => {
  const [entries, setEntries] = useState<ConfidenceEntry[]>([]);
  const [currentLevel, setCurrentLevel] = useState(5);
  const [currentNotes, setCurrentNotes] = useState('');
  const [currentActivity, setCurrentActivity] = useState('');
  const [showAddEntry, setShowAddEntry] = useState(false);

  useEffect(() => {
    // Load saved entries from localStorage
    const savedEntries = localStorage.getItem('sofia-confidence-entries');
    if (savedEntries) {
      const parsed = JSON.parse(savedEntries);
      setEntries(parsed);
    }
  }, []);

  useEffect(() => {
    // Save entries to localStorage and notify parent
    localStorage.setItem('sofia-confidence-entries', JSON.stringify(entries));
    onConfidenceUpdate?.(entries);
  }, [entries, onConfidenceUpdate]);

  const addEntry = () => {
    if (currentActivity.trim()) {
      const newEntry: ConfidenceEntry = {
        date: new Date().toISOString().split('T')[0],
        level: currentLevel,
        notes: currentNotes,
        activity: currentActivity
      };
      
      setEntries([newEntry, ...entries]);
      setCurrentLevel(5);
      setCurrentNotes('');
      setCurrentActivity('');
      setShowAddEntry(false);
    }
  };

  const getConfidenceIcon = (level: number) => {
    if (level >= 8) return <Smile className="w-5 h-5 text-green-600" />;
    if (level >= 5) return <Meh className="w-5 h-5 text-yellow-600" />;
    return <Frown className="w-5 h-5 text-red-600" />;
  };

  const getConfidenceColor = (level: number) => {
    if (level >= 8) return 'bg-green-500';
    if (level >= 5) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const calculateAverage = () => {
    if (entries.length === 0) return 0;
    return entries.reduce((sum, entry) => sum + entry.level, 0) / entries.length;
  };

  const getRecentTrend = () => {
    if (entries.length < 2) return 'neutral';
    const recent = entries.slice(0, 3);
    const older = entries.slice(3, 6);
    
    if (recent.length === 0 || older.length === 0) return 'neutral';
    
    const recentAvg = recent.reduce((sum, entry) => sum + entry.level, 0) / recent.length;
    const olderAvg = older.reduce((sum, entry) => sum + entry.level, 0) / older.length;
    
    if (recentAvg > olderAvg + 0.5) return 'up';
    if (recentAvg < olderAvg - 0.5) return 'down';
    return 'neutral';
  };

  const getTrendIcon = () => {
    const trend = getRecentTrend();
    switch (trend) {
      case 'up': return <TrendingUp className="w-5 h-5 text-green-600" />;
      case 'down': return <TrendingUp className="w-5 h-5 text-red-600 rotate-180" />;
      default: return <TrendingUp className="w-5 h-5 text-gray-600 rotate-90" />;
    }
  };

  const activities = [
    'Voice Exercise Practice',
    'Presentation Rehearsal',
    'Public Speaking',
    'Meeting Presentation',
    'Casual Conversation',
    'Phone Call',
    'Video Conference',
    'Group Discussion',
    'Job Interview',
    'Other'
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-800">Confidence Tracker</h3>
        <button
          onClick={() => setShowAddEntry(!showAddEntry)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add Entry
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Award className="w-5 h-5 text-blue-600" />
            <h4 className="font-semibold text-blue-800">Average Confidence</h4>
          </div>
          <p className="text-2xl font-bold text-blue-600">
            {calculateAverage().toFixed(1)}/10
          </p>
        </div>
        
        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Calendar className="w-5 h-5 text-green-600" />
            <h4 className="font-semibold text-green-800">Total Entries</h4>
          </div>
          <p className="text-2xl font-bold text-green-600">{entries.length}</p>
        </div>
        
        <div className="bg-purple-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            {getTrendIcon()}
            <h4 className="font-semibold text-purple-800">Recent Trend</h4>
          </div>
          <p className="text-lg font-semibold text-purple-600 capitalize">
            {getRecentTrend()}
          </p>
        </div>
      </div>

      {/* Add Entry Form */}
      {showAddEntry && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-gray-50 rounded-lg p-4 mb-6"
        >
          <h4 className="font-semibold text-gray-800 mb-4">Add Confidence Entry</h4>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Activity Type
              </label>
              <select
                value={currentActivity}
                onChange={(e) => setCurrentActivity(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select an activity...</option>
                {activities.map((activity) => (
                  <option key={activity} value={activity}>{activity}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confidence Level: {currentLevel}/10
              </label>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">Low</span>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={currentLevel}
                  onChange={(e) => setCurrentLevel(parseInt(e.target.value))}
                  className="flex-1"
                />
                <span className="text-sm text-gray-500">High</span>
                <div className="ml-2">
                  {getConfidenceIcon(currentLevel)}
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes (Optional)
              </label>
              <textarea
                value={currentNotes}
                onChange={(e) => setCurrentNotes(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                placeholder="How did you feel? What went well? What could improve?"
              />
            </div>
            
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowAddEntry(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={addEntry}
                disabled={!currentActivity}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Add Entry
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Entries List */}
      <div className="space-y-3">
        <h4 className="font-semibold text-gray-800">Recent Entries</h4>
        {entries.length === 0 ? (
          <div className="text-center py-8">
            <Target className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">No entries yet. Start tracking your confidence!</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {entries.map((entry, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-50 rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 ${getConfidenceColor(entry.level)} rounded-full flex items-center justify-center`}>
                      <span className="text-white font-bold text-sm">{entry.level}</span>
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-800">{entry.activity}</h5>
                      <p className="text-sm text-gray-500">{entry.date}</p>
                    </div>
                  </div>
                  {getConfidenceIcon(entry.level)}
                </div>
                {entry.notes && (
                  <p className="text-gray-600 text-sm italic mt-2">"{entry.notes}"</p>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Sofia's Encouragement */}
      {entries.length > 0 && (
        <div className="mt-6 bg-blue-50 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <div>
              <h5 className="font-semibold text-blue-800 mb-2">Sofia's Insight</h5>
              <p className="text-blue-700 text-sm italic">
                {entries.length === 1 
                  ? "Great start on tracking your confidence! The simple act of awareness is the first step to improvement."
                  : calculateAverage() >= 7
                    ? "You're showing consistent confidence! Keep up the great work and continue challenging yourself."
                    : getRecentTrend() === 'up'
                      ? "I can see your confidence improving! This upward trend shows your practice is paying off."
                      : "Remember, confidence is like a muscle - it gets stronger with practice. Keep going!"}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConfidenceTracker;