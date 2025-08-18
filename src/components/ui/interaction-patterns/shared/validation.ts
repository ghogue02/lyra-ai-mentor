/**
 * Validation utilities for interaction patterns
 */

export interface ValidationRule {
  id: string;
  type: 'required' | 'minLength' | 'maxLength' | 'pattern' | 'custom' | 'dependency' | 'range';
  message: string;
  condition?: any;
  validator?: (value: any, context?: any) => boolean;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  ruleId: string;
  fieldId: string;
  message: string;
  severity: 'error' | 'warning';
  suggestions?: string[];
}

export interface ValidationWarning {
  ruleId: string;
  fieldId: string;
  message: string;
  recommendation: string;
}

class PatternValidatorService {
  private rules: Map<string, ValidationRule[]> = new Map();

  /**
   * Register validation rules for a pattern type
   */
  registerRules(patternType: string, rules: ValidationRule[]): void {
    this.rules.set(patternType, rules);
  }

  /**
   * Validate data against pattern rules
   */
  validate(patternType: string, data: any, context?: any): ValidationResult {
    const rules = this.rules.get(patternType) || [];
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    rules.forEach(rule => {
      const result = this.validateRule(rule, data, context);
      if (!result.isValid) {
        if (result.error) {
          errors.push(result.error);
        }
        if (result.warning) {
          warnings.push(result.warning);
        }
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Validate a single rule
   */
  private validateRule(rule: ValidationRule, data: any, context?: any): {
    isValid: boolean;
    error?: ValidationError;
    warning?: ValidationWarning;
  } {
    switch (rule.type) {
      case 'required':
        return this.validateRequired(rule, data);
      case 'minLength':
        return this.validateMinLength(rule, data);
      case 'maxLength':
        return this.validateMaxLength(rule, data);
      case 'pattern':
        return this.validatePattern(rule, data);
      case 'custom':
        return this.validateCustom(rule, data, context);
      case 'dependency':
        return this.validateDependency(rule, data, context);
      case 'range':
        return this.validateRange(rule, data);
      default:
        return { isValid: true };
    }
  }

  private validateRequired(rule: ValidationRule, data: any): {
    isValid: boolean;
    error?: ValidationError;
  } {
    const isValid = data !== null && data !== undefined && data !== '';
    
    return {
      isValid,
      error: isValid ? undefined : {
        ruleId: rule.id,
        fieldId: rule.id,
        message: rule.message,
        severity: 'error' as const,
        suggestions: ['This field is required. Please provide a value.']
      }
    };
  }

  private validateMinLength(rule: ValidationRule, data: any): {
    isValid: boolean;
    error?: ValidationError;
  } {
    if (!data || typeof data !== 'string') return { isValid: true };
    
    const isValid = data.length >= rule.condition;
    
    return {
      isValid,
      error: isValid ? undefined : {
        ruleId: rule.id,
        fieldId: rule.id,
        message: rule.message,
        severity: 'error' as const,
        suggestions: [`Please enter at least ${rule.condition} characters.`]
      }
    };
  }

  private validateMaxLength(rule: ValidationRule, data: any): {
    isValid: boolean;
    error?: ValidationError;
  } {
    if (!data || typeof data !== 'string') return { isValid: true };
    
    const isValid = data.length <= rule.condition;
    
    return {
      isValid,
      error: isValid ? undefined : {
        ruleId: rule.id,
        fieldId: rule.id,
        message: rule.message,
        severity: 'error' as const,
        suggestions: [`Please enter no more than ${rule.condition} characters.`]
      }
    };
  }

  private validatePattern(rule: ValidationRule, data: any): {
    isValid: boolean;
    error?: ValidationError;
  } {
    if (!data || typeof data !== 'string') return { isValid: true };
    
    const pattern = new RegExp(rule.condition);
    const isValid = pattern.test(data);
    
    return {
      isValid,
      error: isValid ? undefined : {
        ruleId: rule.id,
        fieldId: rule.id,
        message: rule.message,
        severity: 'error' as const,
        suggestions: ['Please check the format of your input.']
      }
    };
  }

  private validateCustom(rule: ValidationRule, data: any, context?: any): {
    isValid: boolean;
    error?: ValidationError;
    warning?: ValidationWarning;
  } {
    if (!rule.validator) return { isValid: true };
    
    const isValid = rule.validator(data, context);
    
    return {
      isValid,
      error: isValid ? undefined : {
        ruleId: rule.id,
        fieldId: rule.id,
        message: rule.message,
        severity: 'error' as const
      }
    };
  }

  private validateDependency(rule: ValidationRule, data: any, context?: any): {
    isValid: boolean;
    warning?: ValidationWarning;
  } {
    // Dependency validation typically generates warnings rather than errors
    const isValid = rule.validator ? rule.validator(data, context) : true;
    
    return {
      isValid,
      warning: isValid ? undefined : {
        ruleId: rule.id,
        fieldId: rule.id,
        message: rule.message,
        recommendation: 'Consider reviewing the dependencies between your selections.'
      }
    };
  }

  private validateRange(rule: ValidationRule, data: any): {
    isValid: boolean;
    error?: ValidationError;
  } {
    if (typeof data !== 'number') return { isValid: true };
    
    const { min, max } = rule.condition;
    const isValid = data >= min && data <= max;
    
    return {
      isValid,
      error: isValid ? undefined : {
        ruleId: rule.id,
        fieldId: rule.id,
        message: rule.message,
        severity: 'error' as const,
        suggestions: [`Please enter a value between ${min} and ${max}.`]
      }
    };
  }
}

// Export singleton instance
export const patternValidator = new PatternValidatorService();

// Pre-defined validation rules for different pattern types
export const conversationalValidationRules: ValidationRule[] = [
  {
    id: 'required-questions',
    type: 'custom',
    message: 'All required questions must be answered',
    validator: (responses) => {
      return Object.keys(responses).length >= 3; // Minimum 3 responses
    }
  },
  {
    id: 'response-quality',
    type: 'custom',
    message: 'Responses should be meaningful and complete',
    validator: (responses) => {
      return Object.values(responses).every((r: any) => 
        typeof r.value === 'string' ? r.value.length >= 5 : true
      );
    }
  }
];

export const decisionTreeValidationRules: ValidationRule[] = [
  {
    id: 'path-completion',
    type: 'custom',
    message: 'Decision path must reach a conclusion',
    validator: (state) => {
      return state.isComplete && state.decisionPath.length >= 2;
    }
  },
  {
    id: 'logical-consistency',
    type: 'dependency',
    message: 'Some decisions may conflict with previous choices',
    validator: (state, context) => {
      // Check for logical consistency in decision path
      return true; // Simplified for example
    }
  }
];

export const priorityCardValidationRules: ValidationRule[] = [
  {
    id: 'critical-limit',
    type: 'custom',
    message: 'Too many items marked as critical priority',
    validator: (cards) => {
      const criticalCount = cards.filter((c: any) => c.priority <= 2).length;
      return criticalCount <= 3;
    }
  },
  {
    id: 'balanced-distribution',
    type: 'dependency',
    message: 'Priority distribution could be more balanced',
    validator: (cards) => {
      const priorities = cards.map((c: any) => c.priority);
      const distribution = priorities.reduce((acc: any, p: number) => {
        const range = Math.ceil(p / 2) * 2; // Group into ranges
        acc[range] = (acc[range] || 0) + 1;
        return acc;
      }, {});
      
      // Check if distribution is reasonably balanced
      const values = Object.values(distribution) as number[];
      const max = Math.max(...values);
      const min = Math.min(...values);
      return max / min <= 3; // Max should not be more than 3x min
    }
  }
];

export const sliderGridValidationRules: ValidationRule[] = [
  {
    id: 'value-ranges',
    type: 'custom',
    message: 'All slider values must be within valid ranges',
    validator: (values, sliders) => {
      return Object.entries(values).every(([sliderId, value]: [string, any]) => {
        const slider = sliders.find((s: any) => s.id === sliderId);
        return slider && value >= slider.min && value <= slider.max;
      });
    }
  },
  {
    id: 'dependency-conflicts',
    type: 'dependency',
    message: 'Some slider values may conflict with dependencies',
    validator: (values, sliders) => {
      // Check slider dependencies for conflicts
      return true; // Simplified for example
    }
  }
];

export const timelineValidationRules: ValidationRule[] = [
  {
    id: 'timeline-logic',
    type: 'custom',
    message: 'Timeline events must be in logical order',
    validator: (scenarios) => {
      return scenarios.every((scenario: any) => {
        const events = scenario.events.sort((a: any, b: any) => 
          new Date(a.date).getTime() - new Date(b.date).getTime()
        );
        
        // Check for dependency violations
        return events.every((event: any, index: number) => {
          if (!event.dependencies) return true;
          
          return event.dependencies.every((depId: string) => {
            const depIndex = events.findIndex((e: any) => e.id === depId);
            return depIndex >= 0 && depIndex < index;
          });
        });
      });
    }
  },
  {
    id: 'realistic-duration',
    type: 'dependency',
    message: 'Timeline duration may be unrealistic',
    validator: (scenarios) => {
      return scenarios.every((scenario: any) => {
        const totalDuration = scenario.events.reduce((sum: number, event: any) => 
          sum + (event.duration || 1), 0
        );
        return totalDuration <= 365; // Max 1 year
      });
    }
  }
];

// Register validation rules
patternValidator.registerRules('conversational', conversationalValidationRules);
patternValidator.registerRules('decision-tree', decisionTreeValidationRules);
patternValidator.registerRules('priority-cards', priorityCardValidationRules);
patternValidator.registerRules('preference-sliders', sliderGridValidationRules);
patternValidator.registerRules('timeline-scenario', timelineValidationRules);

/**
 * React hook for pattern validation
 */
export function usePatternValidation(patternType: string) {
  const validate = (data: any, context?: any) => {
    return patternValidator.validate(patternType, data, context);
  };

  const validateField = (fieldId: string, value: any, context?: any) => {
    const rules = patternValidator['rules'].get(patternType) || [];
    const fieldRules = rules.filter(rule => rule.id === fieldId);
    
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];
    
    fieldRules.forEach(rule => {
      const result = patternValidator['validateRule'](rule, value, context);
      if (!result.isValid) {
        if (result.error) errors.push(result.error);
        if (result.warning) warnings.push(result.warning);
      }
    });
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  };

  return {
    validate,
    validateField
  };
}