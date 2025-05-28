
import React, { useState } from 'react';
import { DataInsightsStory } from './DataInsightsStory';

interface FormattedMessageProps {
  content: string;
  onSendMessage: (message: string) => void;
}

export const FormattedMessage: React.FC<FormattedMessageProps> = ({ 
  content, 
  onSendMessage 
}) => {
  const [showDataInsights, setShowDataInsights] = useState(false);

  // Check if this is a data insights trigger message
  const isDataInsightsMessage = content.includes('DATA_INSIGHTS_TRIGGER');

  React.useEffect(() => {
    if (isDataInsightsMessage) {
      setShowDataInsights(true);
    }
  }, [isDataInsightsMessage]);

  const handleAnalyzeData = () => {
    const csvAnalysisPrompt = `Analyze the donor records below to  
 • spot duplicate donors using name + email,  
 • flag rows with missing or malformed emails, and  
 • detect donations whose Amount field is blank, non-numeric, or in a non-USD format;  
then deliver three immediate action items for the user and three hidden insights they may not realize, **formatted as three bold-headed bullet lists in this exact order:**  
 **Patterns Found**, **Action Items**, **Hidden Insights** — nothing else.

Donor,Donation Date,Amount,Campaign,Email
Grace  Brown, 28-06-2025, 6975, Gala Night, g.brown@
Chloé Brown; April 24 2025; USD 8238; New Year's Push; c.brown@example.com
Olivia O'Neal, 2025-09-24, 9399, Veterans Campaign, 
ROBERT HOPPER, April 27 2025, USD 6999, Fashion Forward, robert15.hopper@mailinator.com
"AMELIA PEREZ", 26/10/25, $9877, Veterans Campaign, a.perez@example.org
SARAH O'BRIEN, May 31 2025, USD 5202, Online Giving Day, sarah47.obrien@
Logan  Hernández, 01-08-2025, $8,200, New Year's Push, logan.hernández@
MASON JACKSON; 01.03.2025; $4733; Halloween Fund; mason4.jackson@example.com
Amelia  Garcia, 02/10/25, $2,082.00, Veterans Campaign, amelia.garcia@outlook.com
Maria  Lee, September 07 2025, $1931, Halloween Fund, maria.lee@example.org
LUCY SANTOS; 2025-10-25; $8226; New Year's Push; l68.santos@example.com
John Connor, 12.04.2025, $2,471.00, New Year's Push, j.connor@outlook.com
MILA WILLIAMS, 04/14/25, , Summer Drive, mila.williams@example.com
Isabella Earhart; 07/11/25; 5975.90; Veterans Campaign; isabella77.earhart@mailinator.com
O'Neal, Daniel, 05/22/25, $7,275, Year-End Appeal, daniel.oneal@outlook.com
Mila O'Brien, 2025/10/30, , Annual Luncheon, m.obrien@
Nico Rodriguez, 13/10/25, , Independence Appeal, nico.rodriguez@example.com  # duplicate?
Grace Smith; 11/19/25; USD 4557; Fashion Forward; grace.smith@mailinator.com
Sarah Martinez, October 29 2025, $8,306, Halloween Fund, sarah96.martinez@example.com
"Chang Khan", 08.25.2025, USD 6556, Music Marathon, 
MARIA  SMITH, 2025-06-04, $3667, Annual Luncheon, m.smith@example.com
Olivia Jones, 29/01/25, 8929, New Year's Push, o16.jones@example.com
"Logan Miller", January 06 2025, USD 9381, Fashion Forward, l5.miller@mailinator.com
"MILA DAVIS", 06/03/25, $1,881, Annual Luncheon, m3.davis@example.com
Emma Diaz; 06-09-2025; $2611; New Year's Push; emma.diaz@
Aisha  O'Brien; 10/07/25; $3,545; Online Giving Day; a11.obrien@example.org  # duplicate?
JOHN THOMAS; 16/09/25; USD 8140; New Year's Push; j81.thomas@
Jean  Wilson , 2025-02-13 , 6 775 , Music Marathon , jean_wilson@example.org
SOPHIA GARCIA, Feb 28 2025, $5,302.00, Spring Gala, s.garcia@
Noah  Lopez; 03/15/25; 7400; Online Giving Day; 
Williams, Mason, 2025-03-20, $1,950, Independence Appeal, mason.williams@mailinator.com
Ava Miller, 04/01/25,  , Fashion Forward, ava.miller@example
Isabella Martin; April 18 2025; $8,154; Gala Night; i.martin@example.org
"ETHAN TAYLOR", 2025.04.22, 7201.50, Independence Appeal, ethan.taylor@outlook.com
Harper Moore; 05-05-25; USD 9050; Year-End Appeal; harper_moore@
Lucas Jackson , 2025-05-22 , $2,265 , Summer Drive , l.jackson@example.com
Ella Perez, 05/30/25, $6.607, Online Giving Day, ella_perez@mailinator.com
Mila  Martin, 2025-06-05, USD 0, Online Giving Day, 
MIA JONES, 06-12-25, $3,330 , Year-End Appeal , 
Logan  Brown, 2025/06/18, $4,110 , Fashion Forward, logan.brown@
Lucas Davis; 26/06/25; USD 9,902; New Year's Push; lucasd@example.org
Ella Williams , 07-03-2025 , $7,777 , Veterans Campaign , e.williams@
Mila  Thomas, July 07 2025, 5800, Gala Night, mila.thomas@example.com
Noah  Taylor; 2025/07/15; $1,234; Independence Appeal; 
Liam  Jackson, 2025/07/28, $6 899.00, Halloween Fund, l.jackson@example.com
Sophia  Wilson , 2025-08-02 , USD 10000.00 , Spring Gala , sophia.w@example.com
Miller, Ava, 08.09.2025, USD 1 500, Music Marathon, a.miller@mailinator.com
Harper  Brown , 2025-08-14 , 7444 , Summer Drive , h.brown@example
Lucas  Davis, 2025-08-28,  , Gala Night, lucas_davis@example.com
Ella Thomas; Aug 30 2025; $9,975; Independence Appeal; ella.t@example.org
"Grace  Jackson", 09/06/25, $6,666, Halloween Fund, grace.j@example
Mia  Wilson, 09-12-2025, USD 4455, Year-End Appeal, m.wilson@
Logan Smith; 17-09-25; 5555; Spring Gala; logan.smith@example.com
Ethan  Anderson, 2025/09/25, $8,800 , Fashion Forward, 
Harper Perez, 25/09/25, 9200.25, Independence Appeal, h.perez@example.org
Lucas Martin , 2025-10-04, $4,200 , New Year's Push , lucas.martin@example.com
Ella Brown, 10.10.2025, $7,300.00, Music Marathon, ella_brown@
Mila  Davis; Oct 15 2025; USD 675; Online Giving Day; miladavis@
Noah  Garcia, 18-10-25, $2,345 , Fashion Forward , noah.garcia@example.com
Liam Smith , 2025/10/22 , 6870 , Gala Night , lsmith@example.com
Sophia Davis, 2025/10/29, 7654, Summer Drive, sophia_davis@
Mason  Johnson, Oct 31 2025, USD 1,111, Halloween Fund, mason.j@example
Ava  Wilson; 05/11/25; 8888; Veterans Campaign; ava.wilson@example.org
Isabella Jones , 11-11-25 , $4,567 , Year-End Appeal , 
Ethan  Moore, 12.11.2025, USD 2 702, Music Marathon, ethan.moore@example.com
Harper  Taylor, 14/11/25, , Independence Appeal, harper.taylor@
Lucas  Jackson , 2025-11-21 , $9,999 , Spring Gala , l.jackson@outlook.com
Ella Martin, 2025-11-29, 3050, Veterans Campaign, 
Grace Wilson ; Nov 30 2025 ; 4020 ; Year-End Appeal ; grace.wilson@
Mia  Davis, 2025/12/03, USD 6,003, Online Giving Day, mia.davis@example.org
Logan  Garcia , 04-12-25 , $1,650 , Music Marathon , 
Liam Brown; 12/06/25; USD 730, Spring Gala; liam.brown@example.com
Sophia  Perez, 2025-12-10, $3,400, Online Giving Day, sophia.p@example.org
Mason  Smith , 12/12/25 , $8 220 , Year-End Appeal , m.smith@
Ava  Davis, 13-12-25, $5,500, Halloween Fund, ava.davis@example
Isabella Brown, 2025-12-15, USD 4,440, Spring Gala, 
Ethan  Wilson ; 16-12-25 ; $2,365 ; Music Marathon ; ethanw@example.org
Harper Martin, 2025/12/18, 9575, Fashion Forward, h.martin@example.com
Lucas  Perez , 2025/12/21 , USD 1,275 , Gala Night , 
Ella Wilson, 22-12-25, $6,600, Independence Appeal, ella.wilson@example.org
Mila  Brown, 2025/12/24, USD , Year-End Appeal, milabrown@
Noah  Davis, 2025-12-27, $7 850, New Year's Push, 
Liam  Moore, 2025-12-28, 8808 , Spring Gala , l.moore@example.com
Sophia  Smith , 29-12-25 , $4000 , Online Giving Day , sophiasmith@
Mason  Brown ; 30-12-25 ; $9,001 ; Veterans Campaign ; 
Ava  Thompson, 2025-12-31, $5,555, New Year's Push, ava.t@example.com
John  Smith , 01/05/25, $1,000 , Spring Gala , john.smith@example.com
JOHN SMITH, 2025-01-05, 500 , Spring Gala, jsmith@example.com
Carlos Diaz, Jun 20 2025, 750, Gala Night, carlos.d@example.com
carlos diaz ; 2025/06/20 ; $ ; Gala Night ; carlos_d@example.com
Tamika   Johnson, 2025-12-31 ,  5000.75 , New Year's Push , tamika@@example.com
Tamika Johnson , 12/31/25 , 2500 , New Year's Push , t.johnson@example.com
Chang  Wei ; 2025-05-07 ; 1 250.00 ; Spring Gala ; wei.c@example.com
Wei,Chang,2025-05-07,1500,Spring Gala, wei.c@example.com
Jean-Paul   Gaultier,2025-08-12,$2,000.00, Fashion Forward, jgaultier@example.com
Lucy  Lee,2025-08-31,800,Annual Luncheon,lucy_lee@example
Anonymous , , , , 
 , 2025-06-01 , 400 , Summer Drive , anon@example.com`;

    onSendMessage(csvAnalysisPrompt);
    setShowDataInsights(false);
  };

  if (isDataInsightsMessage) {
    return (
      <DataInsightsStory 
        onAnalyzeData={handleAnalyzeData}
        isVisible={showDataInsights}
      />
    );
  }

  // Handle other message formatting
  const formatContent = (text: string) => {
    // Check for fundraising data export format
    if (text.includes('===FUNDRAISING_DATA_EXPORT===')) {
      return <div className="whitespace-pre-wrap font-mono text-sm">{text}</div>;
    }

    // Split by markdown headers and format
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    
    return (
      <div className="space-y-2">
        {parts.map((part, index) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return (
              <h4 key={index} className="font-semibold text-purple-700 mt-3 mb-1">
                {part.slice(2, -2)}
              </h4>
            );
          }
          
          if (part.trim()) {
            return (
              <div key={index} className="whitespace-pre-wrap">
                {part}
              </div>
            );
          }
          
          return null;
        })}
      </div>
    );
  };

  return <div>{formatContent(content)}</div>;
};
