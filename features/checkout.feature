@regression
Feature: Checkout
  Users can place orders with valid cart contents and customer details.

  Scenario: A user keeps the cart when canceling checkout
    Given the user started checkout with one "Sauce Labs Backpack"
    When the user cancels checkout
    Then the cart contains one "Sauce Labs Backpack"

  Scenario Outline: Checkout requires each customer detail
    Given the user started checkout with one "Sauce Labs Backpack"
    When the user submits otherwise valid details with a blank <field>
    Then the user remains at the customer details step
    And the user sees a validation message stating that <field> is required

    Examples:
      | field       |
      | first name  |
      | last name   |
      | postal code |

  @smoke
  Scenario: A user places a two-product order
    Given the user has one "Sauce Labs Backpack" and one "Sauce Labs Bike Light" in the cart
    And the user started checkout with those products
    When the user submits customer details for "Élodie" "王" with postal code "01234"
    Then the order review shows a subtotal of "$39.98", tax of "$3.20", and a total of "$43.18"
    And the order review contains one "Sauce Labs Backpack" and one "Sauce Labs Bike Light"
    When the user places the order
    Then the user sees an order confirmation
    And the cart is empty

  @exploratory
  Scenario: A user keeps the cart when canceling from order review
    Given the user is reviewing an order for one "Sauce Labs Backpack"
    When the user cancels checkout
    Then the user returns to the product catalog
    When the user reviews the cart
    Then the cart contains one "Sauce Labs Backpack"

  @exploratory
  Scenario: A user can resume checkout after refreshing customer details
    Given the user started checkout with one "Sauce Labs Backpack"
    And the user has entered customer details without submitting them
    When the user refreshes the page
    Then the user remains at the customer details step
    When the user submits valid customer details
    Then the order review still contains one "Sauce Labs Backpack"

  @exploratory
  Scenario: A user can return to the cart from customer details
    Given the user started checkout with one "Sauce Labs Backpack"
    When the user goes back using the browser
    Then the user returns to the cart
    And the cart contains one "Sauce Labs Backpack"

  @exploratory
  Scenario: The order review retains its items and total after a refresh
    Given the user is reviewing an order for one "Sauce Labs Backpack"
    When the user refreshes the page
    Then the order review still contains one "Sauce Labs Backpack"
    And the order review shows a subtotal of "$29.99", tax of "$2.40", and a total of "$32.39"
    When the user places the order
    Then the user sees an order confirmation

  @exploratory
  Scenario: The cart stays empty when the user refreshes the order confirmation
    Given the user completed an order containing one "Sauce Labs Backpack" and one "Sauce Labs Bike Light"
    When the user refreshes the order confirmation
    Then the user still sees the order confirmation
    And the cart is empty
