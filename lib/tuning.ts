/** Shared test data. */

export const CART_PRODUCTS = 4;

export const SEARCH_TERMS = [
  "Pliers",
  "Hammer",
  "Wrench",
  "Screwdriver",
  "Chisel",
  "Sander",
  "Drill",
  "Bolt",
];

export const NO_MATCH_TERM = "zzzznotarealproduct";

export const SORT_CASES = [
  { value: "name,asc", label: "Name (A - Z)", by: "name", direction: "asc" },
  { value: "name,desc", label: "Name (Z - A)", by: "name", direction: "desc" },
  { value: "price,asc", label: "Price (Low - High)", by: "price", direction: "asc" },
  { value: "price,desc", label: "Price (High - Low)", by: "price", direction: "desc" },
] as const;

export const ACCOUNT_PAGES = [
  { path: "/account", heading: "My account" },
  { path: "/account/favorites", heading: "Favorites" },
  { path: "/account/profile", heading: "Profile" },
  { path: "/account/invoices", heading: "Invoices" },
  { path: "/account/messages", heading: "Messages" },
];

export const SHIPPING_ADDRESS = {
  street: "123 Test Street",
  city: "Testville",
  state: "Test",
  postal_code: "12345",
  house_number: "12",
  country: "United States of America (the)",
};

export const CUSTOMER_DISPLAY_NAME = "Jane Doe";
