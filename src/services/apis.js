const BASE_URL = import.meta.env.VITE_API_URL;

export const authEndpoints = {
  login: `${BASE_URL}/auth/login-admin`,
};
export const adminEndpoints = {
  getUsers: `${BASE_URL}/admin/users`,
  getEvents: `${BASE_URL}/event/all`,
  approve: `${BASE_URL}/event_requests/approve`,
  reject: `${BASE_URL}/event_requests/reject`,
  approveAll: `${BASE_URL}/admin/approveAll`,
  approveDay0: `${BASE_URL}/admin/approveDay0`,
  approve10x: `${BASE_URL}/admin/approve10x`,
  approve100x: `${BASE_URL}/admin/approve100x`,
  rejectAll: `${BASE_URL}/admin/rejectAll`,
};

export const eventEndpoints = {
  getEventRequests: `${BASE_URL}/event_requests/requests`,
  getEventApproved: `${BASE_URL}/event_requests/approved`,
  getEventAttendees: `${BASE_URL}/event_requests/attendees`,
  getEventRequestsByEventId: `${BASE_URL}/event_requests/requests/:eventId`,
  addEvent: `${BASE_URL}/event/add`,
  getEventById: `${BASE_URL}/event/getSingle/`,
  updateEvent: `${BASE_URL}/event/update/`,
  deleteEvent: `${BASE_URL}/event/delete`,
  fetchUser: `${BASE_URL}/auth/show`,
};

export const ticketEndpoints = {
  fetchAll: `${BASE_URL}/ticket/all`,
  fetchOne: `${BASE_URL}/ticket`,
  reply: `${BASE_URL}/ticket/reply`,
  close: `${BASE_URL}/ticket/close`,
};
export const blogEndpoints = {
  fetchAll: `${BASE_URL}/blog/all`,
  fetchOne: `${BASE_URL}/blog/fetchById`,
  create: `${BASE_URL}/blog/create`,
  delete: `${BASE_URL}/blog/delete`,
};

export const newsletterEndpoints = {
  ALL: `${BASE_URL}/newsletter/all`,
};
