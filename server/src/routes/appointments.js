import createError from 'http-errors';
import express from 'express';

import { Appointment } from '../models/Appointment.js';

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const appointments = await Appointment.find()
      .populate('createdBy', 'name email department role')
      .sort({ scheduledAt: 1 });

    res.json(appointments);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  const { patientName, patientId, department, doctor, reason, scheduledAt, status, notes } = req.body;

  if (!patientName || !patientId || !department || !doctor || !reason || !scheduledAt) {
    return next(createError(400, 'Missing required fields'));
  }

  try {
    const appointment = await Appointment.create({
      patientName,
      patientId,
      department,
      doctor,
      reason,
      scheduledAt,
      status: status || 'pending',
      notes: notes || '',
      createdBy: req.user._id
    });

    res.status(201).json(appointment);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return next(createError(404, 'Appointment not found'));
    }

    const isOwner = appointment.createdBy.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== 'admin') {
      return next(createError(403, 'Forbidden'));
    }

    Object.assign(appointment, updates);
    await appointment.save();

    res.json(appointment);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  const { id } = req.params;

  try {
    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return next(createError(404, 'Appointment not found'));
    }

    const isOwner = appointment.createdBy.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== 'admin') {
      return next(createError(403, 'Forbidden'));
    }

    await appointment.deleteOne();
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export { router as appointmentsRouter };
