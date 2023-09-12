import mailer from 'nodemailer';
import { MailTemplate } from '../utils/mail-template';

const HOST = process.env.SMTP_HOST;
const PORT = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : undefined;
const USER = process.env.SMTP_USER;
const PASSWORD = process.env.SMTP_PASSWORD;

const API_URL = process.env.API_URL;
const PROJECT_NAME = process.env.PROJECT_NAME || 'Website';

const mailTemplate = new MailTemplate();

class MailService {
  private transporter;
  constructor() {
    this.transporter = mailer.createTransport({
      host: HOST,
      port: PORT,
      secure: false,
      auth: {
        user: USER,
        pass: PASSWORD,
      },
    });
  }

  async sendActivationMail(recipient: string, activationLink: string) {
    this.transporter.sendMail({
      from: USER,
      to: recipient,
      subject: `[${PROJECT_NAME}] Activation link`,
      text: '',
      html: await mailTemplate.activationLink(PROJECT_NAME, activationLink),
    });
  }
}

export default MailService;
