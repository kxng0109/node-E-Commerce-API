const timestamp = Date.now();

export const API = {
  PRODUCTS: "/api/v1/products/",
  PRODUCT: "/api/v1/product/",
  AUTH_REGISTER: "/api/v1/auth/register/",
  AUTH_LOGIN: "/api/v1/auth/login/",
  CART: "/api/v1/cart/"
};

export const TEST_ADMIN = {
  email: `jesttest+${timestamp}@jest.com`,
  password: "randoM@123",
  first_name: "Test",
  last_name: "Jest",
  role: "admin",
};

export const TEST_USER = {
  email: `jesttest+${timestamp}@jest.com`,
  password: "randoM@123",
  first_name: "Test",
  last_name: "Jest",
}

export const SAMPLE_PRODUCT = {
  name: `A test name+${timestamp}`,
  brand: "A brand name",
  description: "A product description",
  image_url: ["https://example.com/img.jpg"],
  price: 9999.99,
  stock_quantity: 10,
  available: "yes",
};
