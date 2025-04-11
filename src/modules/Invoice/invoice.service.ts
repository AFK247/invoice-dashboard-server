import DB from '../../config/db';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import axios from 'axios';

interface InvoiceFormData {
  clientName: string;
  email: string;
  dueDate: string;
  amount: number;
  status: 'Draft' | 'Paid';
  description?: string;
}

async function syncInvoiceToQuickBooks(
  invoice: InvoiceFormData,
  accessToken: string,
  realmId: string,
) {
  try {
    // Creating the customer in QuickBooks
    const customerResponse = await axios.post(
      `https://sandbox-quickbooks.api.intuit.com/v3/company/${realmId}/customer`,
      {
        DisplayName: invoice?.clientName,
        PrimaryEmailAddr: invoice?.email
          ? { Address: invoice?.email }
          : undefined,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      },
    );

    const customerId = customerResponse?.data?.Customer?.Id;

    // Creating the invoice with above customer
    const response = await axios.post(
      `https://sandbox-quickbooks.api.intuit.com/v3/company/${realmId}/invoice`,
      {
        Line: [
          {
            Amount: parseFloat(invoice?.amount?.toFixed(2)),
            DetailType: 'SalesItemLineDetail',
            SalesItemLineDetail: {
              ItemRef: {
                value: '1',
              },
            },
            Description: invoice?.description,
          },
        ],
        CustomerRef: {
          value: customerId?.toString(),
        },
        DueDate: invoice?.dueDate,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      },
    );

    const invoiceId = response?.data?.Invoice?.Id;

    return invoiceId;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

async function checkCustomerExists(
  customerName: string,
  accessToken: string,
  realmId: string,
) {
  try {
    // Escape single quotes in customer name to prevent query issues
    const escapedName = customerName.replace(/'/g, "\\'");

    // Query for existing customer by display name
    const queryResponse = await axios.get(
      `https://sandbox-quickbooks.api.intuit.com/v3/company/${realmId}/query`,
      {
        params: {
          query: `SELECT * FROM Customer WHERE DisplayName = '${escapedName}'`,
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      },
    );

    // Check if customer exists
    if (
      queryResponse?.data?.QueryResponse?.Customer &&
      queryResponse?.data?.QueryResponse?.Customer.length > 0
    ) {
      // Return existing customer ID
      return queryResponse.data.QueryResponse.Customer[0].Id;
    }

    return null;
  } catch (error) {
    console.error('Error checking for existing customer:', error);
    throw new Error(`Failed to check for existing customer`);
  }
}

export const getInvoiceDB = async () => {
  const [rows] = await DB.query('SELECT * FROM invoices');

  if (!rows) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to fetch invoices');
  }

  return rows;
};

export const createInvoiceDB = async (
  invoice: InvoiceFormData,
  accessToken: string,
  realmId: string,
) => {
  const { clientName, email, amount, dueDate, status, description } = invoice;

  const doesExist = await checkCustomerExists(clientName, accessToken, realmId);

  if (doesExist) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Customer Name already exist in QuickBooks',
    );
  }

  const query = `
    INSERT INTO invoices (clientName, email, amount, dueDate, status, description)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  const [result] = await DB.execute(query, [
    clientName,
    email,
    amount,
    dueDate,
    status,
    description,
  ]);

  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create invoice');
  }

  const invoiceId = await syncInvoiceToQuickBooks(
    invoice,
    accessToken,
    realmId,
  );
  if (invoiceId) {
    const insertQuery = `
      INSERT INTO invoiceIdTable (invoiceId, clientName)
      VALUES (?, ?)
    `;

    const [insertResult] = await DB.execute(insertQuery, [
      invoiceId,
      clientName,
    ]);

    if (!insertResult) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Failed to insert invoice ID into invoiceIdTable',
      );
    }
  }

  return result;
};

export const InvoiceServices = {
  getInvoiceDB,
  createInvoiceDB,
};
