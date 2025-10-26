# Udyam Union Local Storage System

This document describes the local storage system implemented for the Udyam Union application. All user data is stored locally on the device and can be accessed through the website.

## Overview

The storage system provides persistent data storage for:
- User profiles and authentication
- Product listings
- Support tickets
- Referral data
- Notifications
- Onboarding progress

## Storage Structure

### User Profile Storage
```javascript
{
  name: string,
  phone: string,
  email: string,
  region: string,
  city: string,
  village: string,
  categories: string[],
  language: string,
  scale: string,
  capacity: string,
  unionId: string,
  referralCode: string,
  membershipStatus: 'pending' | 'active',
  verificationStatus: 'pending' | 'verified' | 'provisional',
  createdAt: string,
  updatedAt: string
}
```

### Products Storage
```javascript
{
  id: string,
  name: string,
  description: string,
  price: string,
  category: string,
  status: 'active' | 'inactive',
  createdAt: string,
  updatedAt: string
}
```

### Support Tickets Storage
```javascript
{
  id: string,
  subject: string,
  description: string,
  priority: 'low' | 'medium' | 'high' | 'urgent',
  status: 'open' | 'closed' | 'in-progress',
  createdAt: string,
  updatedAt: string
}
```

## Usage Examples

### User Profile Operations
```javascript
import { userProfileStorage } from '../utils/storage'

// Get user profile
const profile = userProfileStorage.getProfile()

// Save user profile
userProfileStorage.saveProfile({
  name: 'John Doe',
  phone: '9876543210',
  email: 'john@example.com'
})

// Update specific fields
userProfileStorage.updateProfile({
  region: 'North',
  city: 'Delhi'
})
```

### Product Operations
```javascript
import { productsStorage } from '../utils/storage'

// Add new product
const newProduct = productsStorage.addProduct({
  name: 'Test Product',
  description: 'A test product',
  price: '1000',
  category: 'Electronics'
})

// Get all products
const products = productsStorage.getProducts()

// Update product
productsStorage.updateProduct(productId, {
  name: 'Updated Product Name'
})

// Delete product
productsStorage.deleteProduct(productId)
```

### Support Ticket Operations
```javascript
import { supportStorage } from '../utils/storage'

// Add support ticket
const ticket = supportStorage.addTicket({
  subject: 'Login Issue',
  description: 'Unable to login to the application',
  priority: 'high'
})

// Get all tickets
const tickets = supportStorage.getTickets()

// Update ticket status
supportStorage.updateTicketStatus(ticketId, 'closed')
```

## Data Persistence

All data is automatically saved to the browser's localStorage. The data persists across:
- Browser sessions
- Page refreshes
- Application restarts

## Data Export/Import

### Export Data
```javascript
// Export all data as JSON
const allData = {
  userProfile: userProfileStorage.getProfile(),
  products: productsStorage.getProducts(),
  supportTickets: supportStorage.getTickets(),
  referrals: referralsStorage.getReferrals(),
  notifications: notificationsStorage.getNotifications()
}

const dataStr = JSON.stringify(allData, null, 2)
// Save to file or send to server
```

### Import Data
```javascript
// Import data from JSON
const importedData = JSON.parse(dataString)

userProfileStorage.saveProfile(importedData.userProfile)
importedData.products.forEach(product => {
  productsStorage.addProduct(product)
})
```

## Testing

Use the built-in test functions to verify storage functionality:

```javascript
// In browser console
testStorage() // Run all storage tests
clearTestData() // Clear all test data
```

## Data Viewer Component

The application includes a DataViewer component that allows you to:
- View all stored data
- Export data as JSON
- Clear all data
- Monitor data changes in real-time

## Storage Keys

The system uses the following localStorage keys:
- `udyam_user_profile` - User profile data
- `udyam_products` - Product listings
- `udyam_onboarding_data` - Onboarding progress
- `udyam_settings` - Application settings
- `udyam_referrals` - Referral data
- `udyam_support_tickets` - Support tickets
- `udyam_notifications` - Notifications

## Error Handling

The storage system includes comprehensive error handling:
- Graceful fallbacks for localStorage errors
- Data validation before saving
- Automatic data recovery
- Clear error messages

## Performance Considerations

- Data is stored as JSON strings in localStorage
- Large datasets are automatically chunked
- Lazy loading for better performance
- Automatic cleanup of old data

## Security Notes

- Data is stored locally on the user's device
- No sensitive information is transmitted
- All data operations are client-side only
- Data can be cleared at any time

## Browser Compatibility

The storage system works with all modern browsers that support:
- localStorage API
- JSON.stringify/parse
- ES6+ features

## Troubleshooting

### Common Issues

1. **Data not persisting**
   - Check if localStorage is enabled
   - Verify browser storage limits
   - Check for JavaScript errors

2. **Data corruption**
   - Use the clear all data function
   - Re-enter data manually
   - Check for invalid JSON

3. **Performance issues**
   - Clear old data regularly
   - Check storage usage
   - Optimize data structure

### Debug Commands

```javascript
// Check storage usage
console.log('Storage usage:', JSON.stringify(localStorage).length)

// View all stored data
console.log('All data:', {
  userProfile: userProfileStorage.getProfile(),
  products: productsStorage.getProducts(),
  supportTickets: supportStorage.getTickets()
})

// Clear specific data
userProfileStorage.clearProfile()
productsStorage.clearProducts()
```

## Future Enhancements

- Data synchronization with backend
- Offline/online data sync
- Data compression
- Advanced search and filtering
- Data analytics and insights
