Feature: Toolkit Categories Management
  As a user browsing MyToolkit
  I want to see and filter items by categories
  So that I can easily find the resources I need

  Background:
    Given I am logged in as "test@example.com"
    And the following toolkit categories exist:
      | category_key | name             | icon       | gradient                          | order |
      | email        | Email Templates  | Mail       | from-purple-600 to-pink-600       | 1     |
      | grants       | Grant Tools      | FileText   | from-blue-600 to-cyan-600         | 2     |
      | data         | Data Tools       | BarChart   | from-green-600 to-emerald-600     | 3     |
      | social       | Social Media     | Share2     | from-orange-600 to-red-600        | 4     |
      | reports      | Report Templates | FileCheck  | from-indigo-600 to-purple-600     | 5     |

  @display @ui
  Scenario: Display all active categories
    Given I navigate to "/dashboard?tab=toolkit"
    When the toolkit page loads
    Then I should see 5 category cards
    And each category should display:
      | element     | visibility |
      | icon        | visible    |
      | name        | visible    |
      | description | visible    |
      | gradient    | applied    |
    And the categories should be ordered by their order_index

  @filtering @interaction
  Scenario: Filter toolkit items by category
    Given I have the following toolkit items:
      | name                    | category | unlocked |
      | Welcome Email          | email    | true     |
      | Follow-up Template     | email    | true     |
      | Grant Proposal Builder | grants   | false    |
      | Budget Calculator      | data     | true     |
    When I navigate to the toolkit page
    Then I should see all 4 items initially
    When I click on the "Email Templates" category
    Then I should only see 2 items
    And the items should be "Welcome Email" and "Follow-up Template"
    And the "Email Templates" category should be highlighted

  @all-items @default-view
  Scenario: View all items across categories
    Given I have toolkit items in multiple categories
    When I navigate to the toolkit page
    Then the "All Items" filter should be selected by default
    And I should see items from all categories
    And each item should show its category badge
    When I click on a specific category
    And then click "All Items" again
    Then all items should be visible again

  @empty-state @ux
  Scenario: Show empty state for category with no items
    Given the "reports" category has no toolkit items
    When I navigate to the toolkit page
    And I click on the "Report Templates" category
    Then I should see an empty state message
    And the message should say "No report templates available yet"
    And I should see a "Browse other categories" button

  @mobile @responsive
  Scenario: Category display on mobile devices
    Given I am viewing the toolkit on a mobile device
    When I navigate to the toolkit page
    Then the categories should be displayed in a horizontal scroll
    And each category card should be touch-friendly
    And only 2-3 categories should be visible at once
    When I swipe left
    Then more categories should become visible

  @statistics @category-stats
  Scenario: Display category statistics
    Given I have unlocked items in different categories:
      | category | unlocked_count | total_count |
      | email    | 5              | 10          |
      | grants   | 2              | 8           |
      | data     | 0              | 5           |
    When I view the toolkit page
    Then each category should show:
      | category | display_text    |
      | email    | 5/10 unlocked   |
      | grants   | 2/8 unlocked    |
      | data     | 0/5 unlocked    |

  @inactive @visibility
  Scenario: Hide inactive categories
    Given the following category states:
      | category | is_active |
      | email    | true      |
      | grants   | true      |
      | data     | false     |
    When I load the toolkit page
    Then I should only see 2 categories
    And the "Data Tools" category should not be visible
    And inactive categories should not appear in filters

  @search @category-filter
  Scenario: Search within a category
    Given I have selected the "Email Templates" category
    And there are 20 email templates in the toolkit
    When I type "welcome" in the search box
    Then the search should only apply to the email category
    And I should see only email templates containing "welcome"
    And the category filter should remain active

  @new-items @badges
  Scenario: Highlight new items in categories
    Given the following items were recently added:
      | name              | category | days_ago |
      | New Grant Tool    | grants   | 1        |
      | Fresh Email       | email    | 2        |
      | Old Data Tool     | data     | 10       |
    When I view the toolkit
    Then the "Grant Tools" category should show a "NEW" badge
    And the "Email Templates" category should show a "NEW" badge
    But the "Data Tools" category should not show a "NEW" badge

  @premium @access-levels
  Scenario: Display premium category indicators
    Given some categories contain premium-only items:
      | category | premium_count | free_count |
      | email    | 3            | 7          |
      | grants   | 5            | 3          |
      | data     | 0            | 5          |
    When I view the toolkit as a free user
    Then categories with premium items should show a crown icon
    And the category should indicate "3 premium items"
    When I click on a category with premium items
    Then premium items should be clearly marked
    And I should see an upgrade prompt

  @performance @loading
  Scenario: Lazy load category content
    Given there are 100+ items in the email category
    When I navigate to the toolkit
    Then categories should load immediately
    But category item counts should show loading indicators
    When the counts finish loading
    Then actual counts should replace the loaders
    And the UI should not freeze during loading

  @error-handling @resilience
  Scenario: Handle category loading errors
    Given the categories endpoint will fail
    When I navigate to the toolkit page
    Then I should see an error message "Unable to load categories"
    And I should see a "Try Again" button
    When I click "Try Again"
    And the endpoint succeeds
    Then categories should load normally

  @deep-linking @navigation
  Scenario: Support deep linking to categories
    When I navigate to "/dashboard?tab=toolkit&category=grants"
    Then the toolkit tab should be active
    And the "Grant Tools" category should be pre-selected
    And only grant items should be visible
    When I share this URL with another user
    Then they should see the same filtered view