
// Import controller functions
const {
  displayAllToDo,
  filterOneToDo,
  createToDo,
  deleteToDo,
  updateToDo,
  getTaskAlerts,
  loginMember,
  createMember,
  verifyMember,
  resendPin,
  displayName,
  report,
  feedback,
  updateAccount,
  requestPasswordReset,
  verifyResetPin,
  resetPassword,
  updatePassword,
  resendResetPin,
  changePassword


  // validate_token
} = require('../controller/ToDoController');

const {authMiddleware} = require('../middlerware/authMiddleware');
// Define routes
const ToDo = (app) => {
  app.get('/ToDo/remindme/displayAll', authMiddleware, displayAllToDo);
  app.get('/ToDo/remindme/filter/:id', authMiddleware, filterOneToDo);
  app.post('/ToDo/remindme/create', authMiddleware, createToDo);
  app.post('/ToDo/remindme/report', authMiddleware, report);
  app.post('/ToDo/remindme/feedback', authMiddleware, feedback);
  app.put('/ToDo/remindme/update/:id', authMiddleware, updateToDo);
  app.delete('/ToDo/remindme/delete/:id', authMiddleware, deleteToDo);
  app.post('/ToDo/remindme/getTaskAlerts', authMiddleware, getTaskAlerts);
  app.post('/ToDo/remindme/verify', authMiddleware, verifyMember);
  app.post('/ToDo/remindme/resend-pin', authMiddleware, resendPin);
  app.get('/ToDo/remindme/profile', authMiddleware, (req, res) => {
    res.json({ message: "This is a protected profile", user: req.user });
  });
  app.get('/ToDo/remindme/name', authMiddleware, displayName);
  app.post('/ToDo/remindme/register', createMember);
  app.post('/ToDo/remindme/login', loginMember);
  app.put('/ToDo/remindme/updateAccount', authMiddleware, updateAccount);
  app.post('/ToDo/remindme/requestPasswordReset', requestPasswordReset);
  app.post('/ToDo/remindme/verifyResetPin', verifyResetPin);
  app.put('/ToDo/remindme/resetPassword', resetPassword);
  app.put('/ToDo/remindme/updatePassword', updatePassword);
  app.post('/ToDo/remindme/resendresetpin', resendResetPin);
  app.put('/ToDo/remindme/changepassword', authMiddleware, changePassword);

};

// Export the function to be used in index.js
module.exports = {ToDo};
