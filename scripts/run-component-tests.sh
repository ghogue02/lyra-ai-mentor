#!/bin/bash

# Component Testing Automation Script
# This script runs comprehensive tests for all 35 direct import components

set -e

echo "🧪 Starting Component Test Suite for Object-to-Primitive Regression Prevention"
echo "=================================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from the project root."
    exit 1
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    print_status "Installing dependencies..."
    npm install
fi

# Create test reports directory
mkdir -p test-reports

print_status "Running TypeScript type checking..."
npm run typecheck
if [ $? -eq 0 ]; then
    print_success "TypeScript type checking passed"
else
    print_error "TypeScript type checking failed"
    exit 1
fi

print_status "Running ESLint..."
npm run lint
if [ $? -eq 0 ]; then
    print_success "ESLint passed"
else
    print_warning "ESLint found issues (continuing with tests)"
fi

# Core component tests
print_status "Running Core Component Tests..."
npx vitest run src/components/interactive/__tests__/core/ --reporter=verbose --reporter=json --outputFile=test-reports/core-components.json
CORE_EXIT_CODE=$?

# Maya component tests
print_status "Running Maya Component Tests..."
npx vitest run src/components/interactive/__tests__/maya/ --reporter=verbose --reporter=json --outputFile=test-reports/maya-components.json
MAYA_EXIT_CODE=$?

# Sofia component tests
print_status "Running Sofia Component Tests..."
npx vitest run src/components/interactive/__tests__/sofia/ --reporter=verbose --reporter=json --outputFile=test-reports/sofia-components.json
SOFIA_EXIT_CODE=$?

# David component tests
print_status "Running David Component Tests..."
npx vitest run src/components/interactive/__tests__/david/ --reporter=verbose --reporter=json --outputFile=test-reports/david-components.json
DAVID_EXIT_CODE=$?

# Rachel component tests
print_status "Running Rachel Component Tests..."
npx vitest run src/components/interactive/__tests__/rachel/ --reporter=verbose --reporter=json --outputFile=test-reports/rachel-components.json
RACHEL_EXIT_CODE=$?

# Alex component tests
print_status "Running Alex Component Tests..."
npx vitest run src/components/interactive/__tests__/alex/ --reporter=verbose --reporter=json --outputFile=test-reports/alex-components.json
ALEX_EXIT_CODE=$?

# Testing component tests
print_status "Running Testing Component Tests..."
npx vitest run src/components/interactive/__tests__/testing/ --reporter=verbose --reporter=json --outputFile=test-reports/testing-components.json
TESTING_EXIT_CODE=$?

# Integration tests
print_status "Running Integration Tests..."
npx vitest run tests/integration/ --reporter=verbose --reporter=json --outputFile=test-reports/integration-tests.json
INTEGRATION_EXIT_CODE=$?

# Performance regression tests
print_status "Running Performance Regression Tests..."
npx vitest run tests/performance/ --reporter=verbose --reporter=json --outputFile=test-reports/performance-tests.json
PERFORMANCE_EXIT_CODE=$?

# Object-to-primitive specific tests
print_status "Running Object-to-Primitive Regression Tests (CRITICAL)..."
npx vitest run tests/performance/regression/object-to-primitive-regression.test.tsx --reporter=verbose --reporter=json --outputFile=test-reports/object-to-primitive-tests.json
OBJECT_PRIMITIVE_EXIT_CODE=$?

# Bundle size tests
print_status "Running Bundle Size Regression Tests..."
npx vitest run tests/performance/regression/bundle-size-regression.test.ts --reporter=verbose --reporter=json --outputFile=test-reports/bundle-size-tests.json
BUNDLE_SIZE_EXIT_CODE=$?

# Generate coverage report
print_status "Generating test coverage report..."
npx vitest run --coverage --reporter=json --outputFile=test-reports/coverage.json
COVERAGE_EXIT_CODE=$?

# Summary
echo "=================================================================="
echo "🧪 Test Suite Summary"
echo "=================================================================="

# Check individual test suite results
if [ $CORE_EXIT_CODE -eq 0 ]; then
    print_success "Core Components: PASSED"
else
    print_error "Core Components: FAILED"
fi

if [ $MAYA_EXIT_CODE -eq 0 ]; then
    print_success "Maya Components: PASSED"
else
    print_error "Maya Components: FAILED"
fi

if [ $SOFIA_EXIT_CODE -eq 0 ]; then
    print_success "Sofia Components: PASSED"
else
    print_error "Sofia Components: FAILED"
fi

if [ $DAVID_EXIT_CODE -eq 0 ]; then
    print_success "David Components: PASSED"
else
    print_error "David Components: FAILED"
fi

if [ $RACHEL_EXIT_CODE -eq 0 ]; then
    print_success "Rachel Components: PASSED"
else
    print_error "Rachel Components: FAILED"
fi

if [ $ALEX_EXIT_CODE -eq 0 ]; then
    print_success "Alex Components: PASSED"
else
    print_error "Alex Components: FAILED"
fi

if [ $TESTING_EXIT_CODE -eq 0 ]; then
    print_success "Testing Components: PASSED"
else
    print_error "Testing Components: FAILED"
fi

if [ $INTEGRATION_EXIT_CODE -eq 0 ]; then
    print_success "Integration Tests: PASSED"
else
    print_error "Integration Tests: FAILED"
fi

if [ $PERFORMANCE_EXIT_CODE -eq 0 ]; then
    print_success "Performance Tests: PASSED"
else
    print_error "Performance Tests: FAILED"
fi

if [ $OBJECT_PRIMITIVE_EXIT_CODE -eq 0 ]; then
    print_success "Object-to-Primitive Tests: PASSED (CRITICAL)"
else
    print_error "Object-to-Primitive Tests: FAILED (CRITICAL)"
fi

if [ $BUNDLE_SIZE_EXIT_CODE -eq 0 ]; then
    print_success "Bundle Size Tests: PASSED"
else
    print_error "Bundle Size Tests: FAILED"
fi

# Check coverage
if [ $COVERAGE_EXIT_CODE -eq 0 ]; then
    print_success "Coverage Report: GENERATED"
else
    print_warning "Coverage Report: GENERATION FAILED"
fi

# Calculate overall result
TOTAL_FAILURES=$((
    (CORE_EXIT_CODE != 0) + 
    (MAYA_EXIT_CODE != 0) + 
    (SOFIA_EXIT_CODE != 0) + 
    (DAVID_EXIT_CODE != 0) + 
    (RACHEL_EXIT_CODE != 0) + 
    (ALEX_EXIT_CODE != 0) + 
    (TESTING_EXIT_CODE != 0) + 
    (INTEGRATION_EXIT_CODE != 0) + 
    (PERFORMANCE_EXIT_CODE != 0) + 
    (OBJECT_PRIMITIVE_EXIT_CODE != 0) + 
    (BUNDLE_SIZE_EXIT_CODE != 0)
))

echo "=================================================================="
if [ $TOTAL_FAILURES -eq 0 ]; then
    print_success "🎉 ALL TESTS PASSED! Object-to-primitive regression prevention is working correctly."
    echo ""
    print_status "✅ All 35 direct import components tested successfully"
    print_status "✅ No object-to-primitive errors detected"
    print_status "✅ Performance thresholds maintained"
    print_status "✅ Bundle size under control"
    echo ""
    print_status "Test reports saved to: test-reports/"
    exit 0
else
    print_error "❌ $TOTAL_FAILURES test suite(s) failed"
    echo ""
    print_error "CRITICAL: Object-to-primitive regression tests must pass!"
    print_status "Check individual test reports in: test-reports/"
    echo ""
    print_status "Next steps:"
    print_status "1. Review failed test reports"
    print_status "2. Fix any object-to-primitive issues immediately"
    print_status "3. Ensure all components handle props safely"
    print_status "4. Re-run tests until all pass"
    exit 1
fi