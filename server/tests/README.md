# Cephadex API Test Suite Documentation

This directory contains comprehensive test suites for all Cephadex API endpoints. The tests are designed to ensure API reliability, security, and functionality across all application features.

## Test Architecture

### Database Testing
- **SQLite In-Memory Database**: Tests use SQLite for fast, isolated testing
- **Async Support**: Full async/await support with `aiosqlite`
- **Database Isolation**: Each test gets a fresh database instance
- **Test Data Population**: Consistent test data loaded via `populate_db()`

### Redis Testing
- **FakeRedis**: Uses `fakeredis[json]` for Redis mocking
- **JSON Support**: Full RedisJSON command support for testing
- **Game Data Preloading**: Game-related data preloaded for multiplayer tests

### Authentication Testing
- **Mocked Authentication**: All tests run with mocked user authentication
- **User Overrides**: Current user set to test user "Radagast"
- **OAuth Mocking**: Google, Discord, Microsoft OAuth flows mocked

### External Service Mocking
- **AI Services**: OpenAI and Anthropic API calls mocked
- **S3 Storage**: AWS S3 operations mocked for file testing
- **Stripe Integration**: Payment processing mocked for subscription tests
- **Email Services**: SendGrid and other email services mocked

## Test File Organization

### User Management Tests
- `test_user_auth.py` - Authentication, OAuth, registration, login
- `test_user_account.py` - Account management, profile, settings
- `test_user_settings.py` - User preferences, search, notifications

### Content Management Tests
- `test_deck_crud.py` - Deck creation, editing, deletion, favorites
- `test_quiz_crud.py` - Quiz management, questions, sharing

### Learning System Tests
- `test_study_system.py` - Spaced repetition, card due calculations

### AI Integration Tests
- `test_ai_endpoints.py` - Ask Ceph chatbot, content creation

### Supporting Files
- `test_working_example.py` - Working examples showing proper test patterns
- `test_simple_example.py` - Basic infrastructure validation

## Test Data Structure

### User Test Data (`tests/test_api/data/test_users.py`)
- Multiple test users with different roles and permissions
- Primary test user: "RadagastTheBrown" with comprehensive profile

### Content Test Data (`tests/test_api/data/test_*.py`)
- `test_decks.py` - Sample deck configurations
- `test_cards.py` - Flashcard examples with various formats
- `test_data.py` - Comprehensive test data for all models

### Database Population
- `populate_db.py` - Seeds test database with consistent data
- `populate_redis.py` - Preloads Redis with game and cache data

## Running Tests

### Prerequisites
```bash
# Install test dependencies (already configured with uv)
uv add --dev pytest pytest-asyncio httpx aiosqlite fakeredis[json]
```

### Running All Tests
```bash
# Run all API tests
uv run pytest tests/test_api/ -v

# Run with coverage
uv run pytest tests/test_api/ -v --cov=routes --cov-report=html

# Run specific test file
uv run pytest tests/test_api/test_user_auth.py -v

# Run specific test
uv run pytest tests/test_api/test_user_auth.py::test_create_guest_account -v
```

### Test Output Options
```bash
# Short traceback format
uv run pytest tests/test_api/ -v --tb=short

# Show all output (including print statements)
uv run pytest tests/test_api/ -v -s

# Stop on first failure
uv run pytest tests/test_api/ -v -x

# Run tests in parallel
uv run pytest tests/test_api/ -v -n auto
```

## Writing New Tests

### Basic Test Structure
```python
"""
Test module docstring describing what routes are tested.
"""

import pytest
import httpx


@pytest.mark.asyncio
async def test_example_endpoint(mocked_app):
    \"\"\"Test description with expected behavior.\"\"\"
    transport = httpx.ASGITransport(app=mocked_app)

    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/example/endpoint")
        assert response.status_code == 200
        response_data = response.json()
        assert "expected_key" in response_data
```

### Test Categories to Include
1. **Success Cases** - Normal operation with valid data
2. **Validation Tests** - Invalid input handling and error responses
3. **Authorization Tests** - Access control and permissions
4. **Edge Cases** - Boundary conditions and unusual scenarios
5. **Error Handling** - Service failures and recovery
6. **Data Consistency** - Database integrity and relationships

### Mocking External Services
```python
from unittest.mock import AsyncMock, Mock, patch

@pytest.mark.asyncio
async def test_with_external_service(mocked_app):
    transport = httpx.ASGITransport(app=mocked_app)

    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        with patch("module.external_service_call") as mock_service:
            mock_service.return_value = {"expected": "data"}
            response = await client.post("/endpoint", json={"test": "data"})
            assert response.status_code == 200
```

## Test Configuration

### Pytest Configuration (`pytest.ini`)
```ini
[pytest]
log_cli = true
log_cli_level = WARNING
log_format = %(asctime)s [%(levelname)8s] %(message)s (%(filename)s:%(lineno)s)
log_date_format = %Y-%m-%d %H:%M:%S
asyncio_mode = auto
```

### Available Test Fixtures
- `mocked_app` - Full FastAPI app with mocked dependencies (async routes)
- `sync_mocked_app` - FastAPI app for sync routes (create endpoints)

### Environment Variables
Tests automatically use test environment settings:
- SQLite in-memory database
- Fake Redis instance
- Mocked external services
- Test-specific logging levels

## Coverage and Quality

### Current Test Coverage
- **User Authentication**: ✅ Comprehensive
- **User Account Management**: ✅ Comprehensive
- **User Settings & Search**: ✅ Comprehensive
- **Deck CRUD Operations**: ✅ Comprehensive
- **Quiz Management**: ✅ Comprehensive
- **Study System**: ✅ Comprehensive
- **AI Endpoints**: ✅ Comprehensive
- **Game System**: 🚧 Partial (WebSocket testing complex)
- **Group Management**: 📋 Planned
- **Admin Functions**: 📋 Planned
- **File Operations**: 📋 Planned

### Quality Standards
- All tests must be documented with clear docstrings
- Test names should be descriptive and specific
- Each endpoint should have positive and negative test cases
- External dependencies must be mocked
- Database operations should be tested for consistency
- Authentication and authorization must be verified

## Continuous Integration

### GitHub Actions Integration
Tests are designed to run in CI/CD pipelines:
- No external service dependencies
- Fast execution with in-memory databases
- Comprehensive coverage reporting
- Failure notifications and logging

### Pre-commit Hooks
- Ruff linting (configured to skip test files)
- Test execution on modified files
- Coverage threshold enforcement

## Troubleshooting

### Common Issues

#### 1. AsyncClient Type Errors
**Error**: `TypeError: AsyncClient.__init__() got an unexpected keyword argument 'app'`
**Solution**: Use `httpx.ASGITransport` pattern:
```python
transport = httpx.ASGITransport(app=mocked_app)
async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
    # test code
```

#### 2. Redis JSON Command Errors
**Error**: `ResponseError: unknown command 'json.get'`
**Solution**: Ensure `fakeredis[json]` is installed and imported properly

#### 3. Database Connection Issues
**Error**: Event loop errors with SQLite
**Solution**: Use the provided `mocked_app` fixture which handles async database setup

#### 4. Import Path Issues
**Error**: `ModuleNotFoundError` for test modules
**Solution**: Use relative imports from `tests.test_api` package

### Debug Tips
1. Use `pytest -v -s` to see print output
2. Check database population in `populate_db.py`
3. Verify mock setup in `conftest.py`
4. Test individual endpoints first before batch testing

## Future Enhancements

### Planned Improvements
1. **Performance Testing** - Response time benchmarks
2. **Load Testing** - Concurrent request handling
3. **Security Testing** - SQL injection, XSS prevention
4. **Integration Testing** - End-to-end workflow tests
5. **Snapshot Testing** - API response format validation

### Additional Test Categories
1. **WebSocket Testing** - Real-time game functionality
2. **File Upload Testing** - Large file handling
3. **Subscription Testing** - Stripe webhook integration
4. **Email Testing** - Notification delivery
5. **Mobile API Testing** - Device-specific endpoints