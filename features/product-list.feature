@regression
Feature: Product list
  Users can sort the catalog by name or price.

  Scenario: A user sorts products by ascending price
    Given the user is signed in and the product catalog is available
    When the user sorts products from lowest to highest price
    Then the catalog lists all six products from lowest to highest price

  @exploratory
  Scenario: The catalog opens in alphabetical name order
    Given the user is signed in and the product catalog is available
    Then the catalog lists all six products by name from A to Z

  @exploratory
  Scenario: A user reverses and restores alphabetical name order
    Given the user is signed in and the product catalog is available
    When the user sorts products by name from Z to A
    Then the catalog lists all six products by name from Z to A
    When the user sorts products by name from A to Z
    Then the catalog lists all six products by name from A to Z

  @exploratory
  Scenario: The catalog retains products with the same price when sorted from highest to lowest
    Given the user is signed in and the product catalog is available
    When the user sorts products from highest to lowest price
    Then the catalog lists all six products from highest to lowest price
    And "Sauce Labs Bolt T-Shirt" and "Test.allTheThings() T-Shirt (Red)" each appear once at $15.99

  @exploratory
  Scenario: The catalog restores alphabetical order after viewing product details
    Given the user is viewing the product catalog from lowest to highest price
    When the user views the "Sauce Labs Onesie" details
    And the user returns to the catalog
    Then the catalog lists all six products by name from A to Z

  @exploratory
  Scenario: The catalog restores alphabetical order after a reload
    Given the user is viewing the product catalog from highest to lowest price
    When the user reloads the catalog
    Then the catalog lists all six products by name from A to Z
