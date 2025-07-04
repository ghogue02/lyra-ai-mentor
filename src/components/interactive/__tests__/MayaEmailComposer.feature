Feature: Maya's Email Composer Enhancement
  As a nonprofit professional like Maya
  I want to compose emails quickly using AI assistance
  So that I can spend more time on program work instead of email writing

  Background:
    Given I am on the AI Email Composer interactive element
    And Maya's story about spending 32 minutes on one email is displayed

  Scenario: First-time user experiences Maya's struggle
    When I view the introduction phase
    Then I should see Maya's specific pain points
    And I should see "Finding the right tone" as a challenge
    And I should see "Starting from scratch" as a challenge
    And I should see "Second-guessing every word" as a challenge
    And I should feel motivated to help Maya solve this problem

  Scenario: Building an email recipe with three layers
    Given I click "Help Maya Master Email Writing"
    When I am in the Email Recipe Builder phase
    Then I should see "0/3 layers selected" progress indicator
    When I select "Warm & Understanding 🤗" as the tone
    Then I should see "1/3 layers selected"
    And I should see Layer 2 recipient options appear
    When I select "Concerned Parent" as the recipient
    Then I should see "2/3 layers selected"
    And I should see Layer 3 purpose options appear
    When I select "Address Concern" as the purpose
    Then I should see "3/3 layers selected"
    And the "Generate Email" button should be enabled

  Scenario: Viewing email quality indicators
    Given I have completed all three recipe layers
    When I click "Generate Email"
    Then I should see a professional email addressing the parent's concern
    And I should see "Tone Match: 95%" indicator
    And I should see "Clarity Score: High" indicator
    And I should see "Empathy Level: Strong" indicator
    And I should be able to copy the email to clipboard

  Scenario: Understanding time transformation impact
    Given I have generated an email successfully
    When I click "See My Transformation"
    Then I should see "Before: 32 minutes" crossed out
    And I should see "After: 5 minutes" in green
    And I should see "Time Saved: 27 minutes per email"
    And I should see "Weekly: 2.25 hours saved"
    And I should see "Annual: 117 hours saved"
    And I should see Maya's testimonial about the transformation

  Scenario: Trying different email combinations
    Given I have generated one email
    When I click "Try Different Recipe"
    Then I should return to the recipe builder
    And my previous selections should be cleared
    And I can create a new email recipe
    And the system should track multiple recipes created

  Scenario: Applying learning to my own work
    Given I have completed the full email composer journey
    When I see the success phase
    Then I should understand how to apply this to my own emails
    And I should see a prompt to "Create Your Own Email Recipe"
    And I should feel confident about using AI for email writing

  Scenario: Accessibility for keyboard users
    Given I am using only keyboard navigation
    When I press Tab key
    Then I should focus on the "Help Maya" button
    When I press Enter
    Then I should enter the recipe builder phase
    And all tone options should be keyboard accessible
    And I should hear phase changes announced

  Scenario: Mobile responsive experience
    Given I am using a mobile device
    When I interact with the email composer
    Then all buttons should be at least 44px touch targets
    And the layout should stack vertically
    And text should remain readable
    And all functionality should work with touch

  Scenario: Engagement tracking
    Given I start the email composer
    When I complete the full journey
    Then the system should track:
      | Metric                  | Value    |
      | Time spent              | >2 min   |
      | Recipes created         | >=1      |
      | Transformation viewed   | true     |
      | Copy actions            | tracked  |
    And completion should be marked in the database