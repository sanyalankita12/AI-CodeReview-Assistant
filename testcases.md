# Sample Test Cases

## 1. User Registration
**Input:** name: "Test User", email: "test@example.com", password: "test123"
**Expected:** Account created successfully, redirected to login
**Result:** ✅ Pass

## 2. User Registration — Duplicate Email
**Input:** Same email as an existing account
**Expected:** Error message "User already exists"
**Result:** ✅ Pass

## 3. User Login
**Input:** Valid registered email + correct password
**Expected:** JWT token issued, redirected to dashboard
**Result:** ✅ Pass

## 4. User Login — Wrong Password
**Input:** Valid email + incorrect password
**Expected:** Error message "Invalid email or password"
**Result:** ✅ Pass

## 5. Code Submission — Valid Code
**Input:** JavaScript function with an unused variable and missing semicolons
**Expected:** Code saved, static analysis flags unused variable, AI review generates bug/style suggestions
**Result:** ✅ Pass

## 6. Code Submission — Empty/Invalid Input
**Input:** Random text like "asdasd" with no code syntax
**Expected:** Frontend validation blocks submission with error message
**Result:** ✅ Pass

## 7. Code Submission — File Upload
**Input:** A `.js` file uploaded via the Upload tab
**Expected:** File content read, code saved, review generated
**Result:** ✅ Pass

## 8. Review History
**Input:** Click on a past submission in the History tab
**Expected:** Navigates to detail page showing original code and full AI review
**Result:** ✅ Pass

## 9. Protected Routes
**Input:** API request to `/api/projects` without a JWT token
**Expected:** 401 Unauthorized response
**Result:** ✅ Pass

## 10. Dashboard Stats
**Input:** Multiple code submissions from the same user
**Expected:** Dashboard shows correct total submissions, reviews generated, and languages used count
**Result:** ✅ Pass