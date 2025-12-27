// This runs BEFORE jest-expo's setup to ensure required objects exist
// Fix for: "Object.defineProperty called on non-object" error

// Ensure React Native mocks are initialized
if (typeof global !== 'undefined') {
  // Initialize UIManager mock before jest-expo tries to use it
  if (!global.__UIManagerMock) {
    global.__UIManagerMock = {}
  }
}
