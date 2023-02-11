import { requireAuth, validateRequest } from '@sirjhep/ticketing-common';
import express, {Request, Response} from 'express';
import {body} from 'express-validator';


const router = express.Router();


// create charge
router.post('/api/payments',
    requireAuth,
    [
        body('token')
            .not().isEmpty(),
        body('orderId')
            .not().isEmpty()
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        
    }
);

export default router;