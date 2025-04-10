import { Request, Response } from 'express';
import { InvoiceServices } from './invoice.service';
import catchAsync from '../../utils/catchAsync';
import httpStatus from 'http-status';
import sendResponse from '../../utils/sendResponse';

const getInvoice = catchAsync(async (req: Request, res: Response) => {
  const result = await InvoiceServices.getInvoiceDB();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Invoice fetched successfully!',
    data: result,
  });
});

const createInvoice = catchAsync(async (req: Request, res: Response) => {
  const accessToken = req.headers.authorization?.split(' ')[1] || '';
  const realmId = req.headers['realmid'] as string;

  const invoice = await InvoiceServices.createInvoiceDB(
    req.body,
    accessToken,
    realmId,
  );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Invoice created successfully!',
    data: invoice,
  });
});

export const InvoiceControllers = {
  getInvoice,
  createInvoice,
};
