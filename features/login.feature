@regression
Feature: User sign-in
  Users can access the catalog only with an eligible account.

  @smoke
  Scenario: An active user signs in
    Given the user is signed out
    When the user signs in with the active account
    Then the product catalog is available

  Scenario Outline: The user cannot sign in with an ineligible account
    Given the user is signed out
    When the user signs in with username "<username>" and password "<password>"
    Then the user sees the sign-in error "<message>"
    And the product catalog remains unavailable

    Examples:
      | username        | password     | message                                                                   |
      | standard_user   | wrong_pass   | Epic sadface: Username and password do not match any user in this service |
      | locked_out_user | secret_sauce | Epic sadface: Sorry, this user has been locked out.                       |

  Scenario: A signed-out user cannot return to a previously viewed cart
    Given the user signed out after viewing a cart containing an item
    When the user returns to the cart
    Then the application prompts the user to sign in
    And the cart contents remain unavailable

  @exploratory
  Scenario Outline: The user must provide both credentials to sign in
    Given the user is signed out
    When the user signs in with username "<username>" and password "<password>"
    Then the user sees the sign-in error "<message>"
    And the product catalog remains unavailable

    Examples:
      | username      | password     | message                            |
      |               | secret_sauce | Epic sadface: Username is required |
      | standard_user |              | Epic sadface: Password is required |
      |               |              | Epic sadface: Username is required |

  @exploratory
  Scenario: An active user corrects an invalid password
    Given the user received a sign-in error for an invalid password
    When the user retries with the correct password
    Then the product catalog is available

  @exploratory
  Scenario: A signed-out user opens a bookmarked catalog
    Given the user is signed out
    When the user opens a bookmark to the product catalog
    Then the application prompts the user to sign in
    And the product catalog remains unavailable
