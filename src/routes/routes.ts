import { Router } from 'express';
import { InvoiceRoutes } from '../modules/Invoice/invoice.route';
const router = Router();

const moduleRoutes = [
  {
    path: '/invoice',
    route: InvoiceRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
