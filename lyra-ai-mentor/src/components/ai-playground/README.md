# Synthetic Nonprofit Data Builder

An AI-powered tool for generating realistic synthetic nonprofit data through an interactive Q&A interface with Lyra.

## Features

### Interactive Q&A Flow
- **Step-by-step questions** guide users through data generation
- **Smart validation** ensures data consistency
- **Progress tracking** shows completion status
- **Contextual help** provides guidance for each question

### Comprehensive Data Types
- **Organization Details**: Name, mission, budget, staff size
- **Donor Records**: Individual, corporate, foundation donors with giving history
- **Volunteer Database**: Skills, availability, hours contributed
- **Program Information**: Services, outcomes, impact metrics
- **Financial Transactions**: Income and expenses with proper categorization
- **Grant Applications**: Funding sources, status, reporting requirements
- **Event Data**: Fundraising events, attendance, revenue
- **Board Members**: Leadership profiles with skills and committees
- **Staff Directory**: Organizational structure with reporting relationships

### Intelligent Generation
- **Industry-specific patterns**: Realistic data based on nonprofit sector
- **Relationship mapping**: Connected data across different types
- **Budget-aware scaling**: Data scales appropriately with organization size
- **Geographic relevance**: Location-based data generation

### Export Options
- **JSON format**: Complete structured data for applications
- **CSV format**: Individual files for each data type
- **Profile saving**: Save and reuse organization profiles
- **Batch generation**: Generate multiple datasets efficiently

## Usage

### Basic Integration
```tsx
import { SyntheticDataBuilder } from '@/components/ai-playground';

function MyComponent() {
  return <SyntheticDataBuilder />;
}
```

### Programmatic Generation
```typescript
import { generateSyntheticData } from '@/services/syntheticDataService';

const data = await generateSyntheticData({
  organizationType: 'education',
  budgetRange: 'medium',
  staffSize: 'small',
  geographicScope: 'city',
  programDescription: 'After-school tutoring, STEM workshops',
  donorTypes: ['individuals', 'foundations'],
  dataTypes: ['donors', 'programs', 'volunteers']
});
```

### Profile Management
```typescript
import { saveSyntheticProfile, loadSyntheticProfile } from '@/services/syntheticDataService';

// Save a profile
saveSyntheticProfile({
  id: 'unique-id',
  name: 'Education Nonprofit Template',
  options: generationOptions,
  createdAt: new Date().toISOString()
});

// Load profiles
const profiles = loadSyntheticProfile();
```

## Data Schema

### Organization
```typescript
{
  id: string;
  name: string;
  type: string;
  mission: string;
  founded: number;
  ein: string;
  address: Address;
  website: string;
  email: string;
  phone: string;
  annualBudget: number;
  staffCount: number;
  volunteerCount: number;
  programCount: number;
}
```

### Donor
```typescript
{
  id: string;
  type: 'individual' | 'foundation' | 'corporate' | 'government';
  name: string;
  email?: string;
  phone?: string;
  address?: Address;
  firstGiftDate: string;
  lastGiftDate: string;
  totalGiving: number;
  giftCount: number;
  averageGift: number;
  donorLevel: string;
  interests: string[];
  communicationPreference: string;
  retentionRisk: 'low' | 'medium' | 'high';
}
```

### Program
```typescript
{
  id: string;
  name: string;
  description: string;
  category: string;
  startDate: string;
  endDate?: string;
  budget: number;
  participantCount: number;
  outcomes: string[];
  staffLead: string;
  volunteers: number;
  impactMetrics: {
    metric: string;
    value: number;
    unit: string;
  }[];
}
```

## Configuration Options

### Organization Types
- Arts & Culture
- Education
- Health Services
- Human Services
- Environment & Animals
- International
- Public & Societal Benefit
- Religion Related
- Mutual/Membership Benefit

### Budget Ranges
- Micro: Under $50,000
- Small: $50,000 - $250,000
- Medium: $250,000 - $1 million
- Large: $1 million - $10 million
- Major: $10 million - $50 million
- Enterprise: Over $50 million

### Geographic Scopes
- Neighborhood/Local Community
- City/Municipality
- County/Region
- State/Province
- National
- International

## Best Practices

1. **Start with organization type**: This determines many default patterns
2. **Match budget to staff size**: Keep realistic ratios
3. **Consider geographic scope**: Affects donor and program patterns
4. **Use descriptive programs**: Better descriptions generate more relevant data
5. **Save successful profiles**: Reuse for consistent testing data

## Database Integration

The generated data is designed to work with standard nonprofit CRM schemas. Example integration:

```sql
-- Example: Import donors
INSERT INTO donors (name, email, type, total_giving, donor_level)
SELECT name, email, type, totalGiving, donorLevel
FROM json_data;

-- Example: Import programs
INSERT INTO programs (name, description, budget, participant_count)
SELECT name, description, budget, participantCount
FROM json_data;
```

## Customization

To add new organization types or modify generation patterns:

```typescript
// In syntheticDataService.ts
const orgTypeTemplates = {
  yourNewType: {
    programs: ['Program 1', 'Program 2'],
    donorInterests: ['Interest 1', 'Interest 2'],
    missionKeywords: ['keyword1', 'keyword2']
  }
};
```

## Performance Considerations

- **Batch size**: Large datasets (>1000 records) may take a few seconds
- **Memory usage**: Generated data is held in memory before export
- **Storage**: Saved profiles use localStorage (5MB limit)

## Future Enhancements

- [ ] Multi-language support for international nonprofits
- [ ] Custom field mapping for specific CRM systems
- [ ] API endpoint for server-side generation
- [ ] Bulk generation with variations
- [ ] Data validation against real nonprofit patterns
- [ ] Integration with existing databases for seeding