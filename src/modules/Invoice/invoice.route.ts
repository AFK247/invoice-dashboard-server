import { Router } from 'express';
import { InvoiceControllers } from './invoice.controller';

const router = Router();

router.get('/', InvoiceControllers.getInvoice);

router.post('/create', InvoiceControllers.createInvoice);

export const InvoiceRoutes = router;
