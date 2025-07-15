Feature: Save PACE Email to MyToolkit
  As a user who has generated a PACE email
  I want to save it to my toolkit
  So that I can access it later and build my personal resource library

  Background:
    Given the toolkit categories are properly initialized
    And the following categories exist:
      | category_key | name           | description                          |
      | email        | Email Templates| Pre-written email templates          |
      | grants       | Grant Tools    | Grant writing resources              |
      | data         | Data Tools     | Data visualization templates         |

  @authentication @happy-path
  Scenario: Successfully save email to toolkit when logged in
    Given I am logged in as "test@example.com"
    And I have generated a PACE email with:
      | purpose   | solve_problems                     |
      | audience  | Friend or Family Member            |
      | framework | Empathy Bridge                     |
      | content   | I understand you're worried about... |
    When I click the "Save to MyToolkit" button
    Then the button should show a loading spinner with text "Saving..."
    And the email should be saved in the "email" category
    And I should see a success notification "Email saved to your toolkit!"
    And the notification should have an action button "View Toolkit"
    And the button should change to show "Saved to Toolkit" with a check icon
    And the button should be disabled

  @authentication @redirect
  Scenario: Redirect to login when not authenticated
    Given I am not logged in
    And I have generated a PACE email for "help someone who's worried"
    When I click the "Save to MyToolkit" button
    Then I should see an error notification "Please sign in to save to your toolkit"
    And I should be redirected to "/auth/login?redirect=/lyra-maya-demo"
    And the email content should be preserved after login

  @validation @error-handling
  Scenario: Handle missing data gracefully
    Given I am logged in as "test@example.com"
    And I am on the PACE email composer page
    But no email has been generated yet
    When I click the "Save to MyToolkit" button
    Then I should see an error notification "Missing required data to save"
    And the button should remain enabled
    And no database operations should be performed

  @database @category-missing
  Scenario: Handle missing email category
    Given I am logged in as "test@example.com"
    And I have generated a PACE email
    But the "email" category does not exist in the database
    When I click the "Save to MyToolkit" button
    Then I should see an error notification "Failed to save to toolkit"
    And the error should be logged with message "Could not find email category"
    And the button should return to its original state

  @duplicate-handling
  Scenario: Handle saving the same email multiple times
    Given I am logged in as "test@example.com"
    And I have generated a PACE email with purpose "inform_educate" for "Team member"
    And I have already saved this email to my toolkit
    When I generate the same email configuration again
    And I click the "Save to MyToolkit" button
    Then the existing toolkit item should be reused
    And I should still see a success notification
    And my unlock count should not increase
    But the button should still show "Saved to Toolkit"

  @metadata @storage
  Scenario: Save complete PACE metadata with email
    Given I am logged in as "test@example.com"
    And I have generated a PACE email with:
      | purpose       | build_relationships                    |
      | audience      | Mentor or Coach                        |
      | framework     | Story Arc                              |
      | prompt        | Help me write an email to my mentor... |
      | emailContent  | Dear Sarah, I wanted to share...      |
    When I click the "Save to MyToolkit" button
    Then the toolkit item should be created with:
      | name          | Build a stronger connection - Mentor or Coach |
      | category_id   | [email category id]                           |
      | description   | PACE email template: build_relationships for Mentor or Coach |
      | file_type     | pace_email                                    |
      | is_new        | true                                          |
    And the metadata should contain:
      | pace_data.purpose      | build_relationships              |
      | pace_data.audience     | {label: "Mentor or Coach", ...}  |
      | pace_data.framework    | {name: "Story Arc", ...}          |
      | pace_data.email_content| Dear Sarah, I wanted to share... |
      | pace_data.created_at   | [current timestamp]               |

  @achievements @gamification
  Scenario: Unlock achievement after first save
    Given I am logged in as "test@example.com"
    And I have never saved any toolkit items before
    And there is an achievement "First Toolkit Save" with criteria_type "unlock_count" and value 1
    When I generate a PACE email
    And I click the "Save to MyToolkit" button
    Then the email should be saved successfully
    And I should see an achievement notification "Achievement Unlocked: First Toolkit Save!"
    And the achievement notification should show for 5 seconds
    And my achievement progress should be updated

  @achievements @milestone
  Scenario: Unlock milestone achievement
    Given I am logged in as "test@example.com"
    And I have saved 4 toolkit items
    And there is an achievement "Toolkit Collector" with criteria_type "unlock_count" and value 5
    When I generate a new PACE email
    And I click the "Save to MyToolkit" button
    Then the email should be saved successfully
    And I should see an achievement notification "Achievement Unlocked: Toolkit Collector!"
    And the achievement should be marked as unlocked in the database

  @navigation @user-flow
  Scenario: Navigate to toolkit after saving
    Given I am logged in as "test@example.com"
    And I have generated a PACE email
    When I click the "Save to MyToolkit" button
    And I see the success notification
    And I click the "View Toolkit" action button in the notification
    Then I should be navigated to "/dashboard?tab=toolkit"
    And I should see my newly saved email in the toolkit
    And the email category should be selected
    And the saved item should show as "NEW"

  @error-recovery
  Scenario: Recover from network error during save
    Given I am logged in as "test@example.com"
    And I have generated a PACE email
    And the network will fail on the next request
    When I click the "Save to MyToolkit" button
    Then I should see an error notification "Failed to save to toolkit"
    And the button should return to show "Save to MyToolkit"
    And the button should be enabled for retry
    When the network is restored
    And I click the "Save to MyToolkit" button again
    Then the email should be saved successfully

  @formatting @display
  Scenario: Format purpose display correctly
    Given I am logged in as "test@example.com"
    And I have generated emails for different purposes:
      | purpose_key        | expected_display            |
      | inform_educate     | Share important news        |
      | persuade_convince  | Invite someone to support   |
      | build_relationships| Build a stronger connection |
      | solve_problems     | Help someone who's worried  |
      | request_support    | Ask for help you need       |
      | inspire_motivate   | Share exciting progress     |
      | establish_authority| Establish expertise         |
      | create_engagement  | Create engagement           |
    When I save each email to my toolkit
    Then each toolkit item name should start with the expected display text
    And the name should include the audience label