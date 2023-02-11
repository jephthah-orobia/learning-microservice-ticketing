import {
  DatabaseValidationError,
  NotFoundError,
} from '@sirjhep/ticketing-common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { Ticket } from '../models/ticket';

const router = express.Router();

router.get('/api/tickets/:id', async (req, res) => {
  const { id } = req.params;
  const ticket = await Ticket.findById(id);

  if (ticket) res.json(ticket);
  else throw new NotFoundError();
});


router.get('/api/tickets', async (req, res) => {
  const tickets = await Ticket.find({});

  if (tickets.length > 0) res.json(tickets);
  else res.json([]);
});

export default router;
