import { isBefore, parseISO } from 'date-fns';

import { apiRequest } from './httpClient.js';

function withDerivedFields(appointment) {
  const normalized = {
    ...appointment,
    id: appointment.id ?? appointment._id ?? null
  };

  let scheduledIso = null;

  if (typeof normalized.scheduledAt === 'string') {
    scheduledIso = normalized.scheduledAt;
  } else if (normalized.scheduledAt) {
    scheduledIso = new Date(normalized.scheduledAt).toISOString();
  }

  if (scheduledIso) {
    normalized.scheduledAt = scheduledIso;
    normalized.isOverdue = isBefore(parseISO(scheduledIso), new Date()) && normalized.status !== 'completed';
  } else {
    normalized.isOverdue = false;
  }

  return normalized;
}

export const appointmentService = {
  async list(token) {
    const records = await apiRequest('/appointments', { token });
    return records.map(withDerivedFields);
  },

  async create(token, payload) {
    const body = {
      ...payload,
      scheduledAt: payload.scheduledAt ? new Date(payload.scheduledAt).toISOString() : undefined
    };
    const appointment = await apiRequest('/appointments', {
      method: 'POST',
      token,
      body
    });
    return withDerivedFields(appointment);
  },

  async updateStatus(token, id, status) {
    return this.update(token, id, { status });
  },

  async update(token, id, updates) {
    const appointment = await apiRequest(`/appointments/${id}`, {
      method: 'PUT',
      token,
      body: {
        ...updates,
        scheduledAt: updates.scheduledAt ? new Date(updates.scheduledAt).toISOString() : undefined
      }
    });
    return withDerivedFields(appointment);
  },

  async remove(token, id) {
    await apiRequest(`/appointments/${id}`, {
      method: 'DELETE',
      token
    });
  }
};
