import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AnimatedCheckmark from '@/components/ui/AnimatedCheckmark';
import { BrandedIcon } from '@/components/ui/BrandedIcon';

interface EthicsResult {
  scenarioId: string;
  choice: string;
  ethical: 'good' | 'concerning' | 'problematic';
  principle: string;
}

interface EthicsScoreProps {
  results: EthicsResult[];
  showDetails?: boolean;
  className?: string;
}

export const EthicsScorecard: React.FC<EthicsScoreProps> = ({
  results,
  showDetails = true,
  className = ''
}) => {
  const goodChoices = results.filter(r => r.ethical === 'good').length;
  const concerningChoices = results.filter(r => r.ethical === 'concerning').length;
  const problematicChoices = results.filter(r => r.ethical === 'problematic').length;
  
  const totalScenarios = results.length;
  const ethicsScore = Math.round((goodChoices / totalScenarios) * 100);
  
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return 'achievement';
    if (score >= 60) return 'learning';
    return 'ethics';
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BrandedIcon 
            type={getScoreIcon(ethicsScore)} 
            variant="animated" 
            size="md"
            context="ui"
          />
          Your Ethics Scorecard
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Overall Score */}
          <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
            <div className={`text-3xl font-bold ${getScoreColor(ethicsScore)}`}>
              {ethicsScore}%
            </div>
            <p className="text-sm text-gray-600">Ethics Score</p>
            {ethicsScore >= 80 && (
              <p className="text-green-600 font-medium mt-2">🎉 Excellent ethical reasoning!</p>
            )}
            {ethicsScore >= 60 && ethicsScore < 80 && (
              <p className="text-yellow-600 font-medium mt-2">⚡ Good foundation, room to grow!</p>
            )}
            {ethicsScore < 60 && (
              <p className="text-red-600 font-medium mt-2">📚 Keep learning and practicing!</p>
            )}
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-3 bg-green-50 rounded-lg border border-green-200"
            >
              <div className="text-lg font-bold text-green-600">{goodChoices}</div>
              <div className="text-xs text-green-700">Ethical</div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-3 bg-yellow-50 rounded-lg border border-yellow-200"
            >
              <div className="text-lg font-bold text-yellow-600">{concerningChoices}</div>
              <div className="text-xs text-yellow-700">Concerning</div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="p-3 bg-red-50 rounded-lg border border-red-200"
            >
              <div className="text-lg font-bold text-red-600">{problematicChoices}</div>
              <div className="text-xs text-red-700">Problematic</div>
            </motion.div>
          </div>

          {/* Detailed Results */}
          {showDetails && (
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">Scenario Results:</h4>
              <div className="grid grid-cols-1 gap-2">
                {results.map((result, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + (index * 0.1) }}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <AnimatedCheckmark
                        isCompleted={result.ethical === 'good'}
                        size="sm"
                        showAnimation={true}
                      />
                      <div>
                        <div className="text-sm font-medium">Scenario {index + 1}</div>
                        <div className="text-xs text-gray-600">{result.principle}</div>
                      </div>
                    </div>
                    <Badge variant={
                      result.ethical === 'good' ? 'default' :
                      result.ethical === 'concerning' ? 'secondary' : 'destructive'
                    }>
                      {result.ethical === 'good' ? 'Ethical' :
                       result.ethical === 'concerning' ? 'Concerning' : 'Problematic'}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Ethics Principles Reinforcement */}
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
            <h4 className="font-medium text-purple-900 mb-2">Key Ethics Principles:</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2">
                <BrandedIcon type="mission" size="sm" />
                <span>Human-Centered Impact</span>
              </div>
              <div className="flex items-center gap-2">
                <BrandedIcon type="network" size="sm" />
                <span>Fairness & Inclusion</span>
              </div>
              <div className="flex items-center gap-2">
                <BrandedIcon type="communication" size="sm" />
                <span>Transparency & Honesty</span>
              </div>
              <div className="flex items-center gap-2">
                <BrandedIcon type="ethics" size="sm" />
                <span>Privacy & Security</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};