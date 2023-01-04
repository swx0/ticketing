const sendgrid = require('@sendgrid/mail');

sendgrid.setApiKey(process.env.SENDGRID_KEY);

export { sendgrid };
