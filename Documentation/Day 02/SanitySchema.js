export default {
    name: 'default',
    title: 'Whole System',
    types: [
      // Product Schema
      {
        name: 'product',
        title: 'Product',
        type: 'document',
        fields: [
          {
            name: 'name',
            title: 'Product Name',
            type: 'string',
          },
          {
            name: 'sizes',
            title: 'Size',
            type: 'string',
          },
          {
            name: 'images',
            title: 'Images',
            type: 'array',
            of: [{ type: 'image' }],
          },
          {
            name: 'description',
            title: 'Description',
            type: 'text',
          },
        ],
      },
  
      // Order Schema
      {
        name: 'order',
        title: 'Order',
        type: 'document',
        fields: [
          {
            name: 'orderId',
            title: 'Order ID',
            type: 'string',
          },
          {
            name: 'productId',
            title: 'Product ID',
            type: 'reference',
            to: [{ type: 'product' }],
          },
          {
            name: 'totalPrice',
            title: 'Total Price',
            type: 'number',
          },
          {
            name: 'paymentStatus',
            title: 'Payment Status',
            type: 'string',
            options: {
              list: [
                { title: 'Pending', value: 'pending' },
                { title: 'Paid', value: 'paid' },
                { title: 'Failed', value: 'failed' },
              ],
            },
          },
        ],
      },
  
      // Customer Schema
      {
        name: 'customer',
        title: 'Customer',
        type: 'document',
        fields: [
          {
            name: 'customerId',
            title: 'Customer ID',
            type: 'string',
          },
          {
            name: 'firstName',
            title: 'First Name',
            type: 'string',
          },
          {
            name: 'lastName',
            title: 'Last Name',
            type: 'string',
          },
          {
            name: 'address',
            title: 'Address',
            type: 'string',
          },
          {
            name: 'email',
            title: 'Email',
            type: 'string',
          },
          {
            name: 'phoneNumber',
            title: 'Phone Number',
            type: 'string',
          },
          {
            name: 'dateOfBirth',
            title: 'Date of Birth',
            type: 'date',
          },
          {
            name: 'accountCreationDate',
            title: 'Account Creation Date',
            type: 'datetime',
          },
        ],
      },
  
      // Payment Schema
      {
        name: 'payment',
        title: 'Payment',
        type: 'document',
        fields: [
          {
            name: 'paymentId',
            title: 'Payment ID',
            type: 'string',
          },
          {
            name: 'orderId',
            title: 'Order ID',
            type: 'reference',
            to: [{ type: 'order' }],
          },
          {
            name: 'paymentDate',
            title: 'Payment Date',
            type: 'datetime',
          },
          {
            name: 'paymentAmount',
            title: 'Payment Amount',
            type: 'number',
          },
          {
            name: 'paymentMethod',
            title: 'Payment Method',
            type: 'string',
            options: {
              list: [
                { title: 'Credit Card', value: 'credit_card' },
                { title: 'Paypal', value: 'paypal' },
                { title: 'Bank Transfer', value: 'bank_transfer' },
              ],
            },
          },
          {
            name: 'cardNumber',
            title: 'Card Number',
            type: 'string',
          },
        ],
      },
    ],
  };
  