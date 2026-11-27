@regression
Feature: Shopping cart
  Users can review their selected products.

  Scenario: Cart contents survive a page reload
    Given the user added a "Sauce Labs Bike Light" from its product details
    When the user reloads the cart
    Then the cart contains one "Sauce Labs Bike Light"

  @exploratory
  Scenario: The cart count increases as the user adds distinct products
    Given the user is signed in with an empty cart
    Then the cart indicator shows no item count
    When the user adds a "Sauce Labs Bike Light" from the catalog
    Then the cart count is 1
    When the user adds a "Sauce Labs Backpack" from the catalog
    Then the cart count is 2
    When the user reviews the cart
    Then the cart contains one "Sauce Labs Bike Light" and one "Sauce Labs Backpack"
    And the cart count is 2

  @exploratory
  Scenario: The cart count decreases as the user removes products
    Given the user is reviewing a cart with one "Sauce Labs Bike Light" and one "Sauce Labs Backpack"
    When the user removes the "Sauce Labs Bike Light" from the cart
    Then the cart contains only one "Sauce Labs Backpack"
    And the cart count is 1
    When the user removes the "Sauce Labs Backpack" from the cart
    Then the cart is empty
    And the cart indicator shows no item count

  @exploratory
  Scenario: The cart retains its products when the user continues shopping
    Given the user is reviewing a cart with one "Sauce Labs Bike Light"
    When the user continues shopping
    Then the user returns to the product catalog
    And the catalog shows the "Sauce Labs Bike Light" as selected
    And the cart count is 1
    When the user adds a "Sauce Labs Bolt T-Shirt" from the catalog
    Then the cart count is 2
    When the user reviews the cart
    Then the cart contains one "Sauce Labs Bike Light" and one "Sauce Labs Bolt T-Shirt"
    And the cart count is 2

  @exploratory
  Scenario: The user sees the updated cart after returning from the catalog
    Given the user is reviewing a cart with one "Sauce Labs Bike Light" and one "Sauce Labs Backpack"
    When the user continues shopping
    And the user removes the "Sauce Labs Bike Light" from the catalog
    And the user goes back using the browser
    Then the user returns to the cart
    And the cart contains only one "Sauce Labs Backpack"
    And the cart count is 1

  @exploratory
  Scenario: The catalog reflects cart changes after a reload
    Given the user has one "Sauce Labs Bike Light" and one "Sauce Labs Backpack" in the cart
    When the user removes the "Sauce Labs Bike Light" from the catalog
    And the user reloads the catalog
    Then the catalog lets the user add the "Sauce Labs Bike Light"
    And the catalog shows the "Sauce Labs Backpack" as selected
    And the cart count is 1

  @exploratory
  Scenario: The cart reflects removals from another tab after a reload
    Given the user is reviewing a cart with one "Sauce Labs Bike Light" in two tabs
    Then the second tab cart contains one "Sauce Labs Bike Light"
    When the user removes the "Sauce Labs Bike Light" in one tab
    And the user reloads the cart in the other tab
    Then the reloaded cart is empty
    And the cart indicator in the reloaded tab shows no item count
