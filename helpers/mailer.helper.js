const nodemailer = require('nodemailer');
const logger = require('../helpers/logger.helper');

const Email = require('email-templates');

class Mailer {
  static async sendEmail(mailData) {
    try {
      const mail = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE,
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
      });

      const email = new Email({
        message: {
          from: process.env.EMAIL_USERNAME,
        },
        transport: mail,
        textOnly: false,
        htmlToText: false,
        send: true,
        preview: false,
        views: {
          options: {
            extension: 'handlebars',
          },
        },
      });
      const result = await email.send(mailData);
      if (
        (result.rejected && result.rejected.length === 0) ||
        (result && result.length && result[0].statusMessage === 'Accepted') ||
        result.response === 'test success'
      ) {
        return true;
      }
      return false;
    } catch (error) {
      logger.error('From mailer helper error', { errorMsg: error });
      return false;
    }
  }
}

module.exports = Mailer;
