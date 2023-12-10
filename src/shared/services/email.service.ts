import nodemailer from "nodemailer";
import config from "../../../config";
import { EmailInterface } from "../models/email";

export class EmailsService {
  private transporter!: nodemailer.Transporter;

  constructor() {}

  private async createConnection() {
    this.transporter = nodemailer.createTransport({
      host: config.SMTP_HOST,
      port: config.SMTP_PORT,
      secure: false,
      auth: {
        user: config.SMTP_USER_NAME,
        pass: config.SMTP_PASSWORD,
      },
    });
  }

  async sendMail(options: EmailInterface) {
    await this.createConnection();

    return await this.transporter.sendMail({
      from: `${config.SMTP_SENDER}`,
      to: options.to,
      cc: options.cc,
      bcc: options.bcc,
      subject: options.subject,
      text: options.text,
      html: options.html,
    });
  }

  async verifyConnection() {
    return this.transporter.verify();
  }

  getTransporter() {
    return this.transporter;
  }
}
