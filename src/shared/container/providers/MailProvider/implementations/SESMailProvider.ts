import mailConfig from '@config/mail';
import ISendMailDTO from '@shared/container/providers/MailProvider/dtos/ISendMailDTO';
import IMailTemplateProvider from '@shared/container/providers/MailTemplateProvider/models/IMailTemplateProvider';
import nodemailer, { Transporter } from 'nodemailer';
import aws from 'aws-sdk';
import { inject, injectable } from 'tsyringe';

import IMailProvider from '../models/IMailProvider';

@injectable()
export default class SESMailProvider implements IMailProvider {
  private mailClient: Transporter;

  constructor(
    @inject('MailTemplateProvider')
    private mailTemplateProvider: IMailTemplateProvider,
  ) {
    this.mailClient = nodemailer.createTransport({
      SES: new aws.SES({
        apiVersion: '2010-12-01',
      }),
    });
  }

  public async sendMail(data: ISendMailDTO): Promise<void> {
    const { name, email } = mailConfig.defaults.from;
    const { from, to, subject, templateData } = data;
    const { file, variables } = templateData;

    const message = {
      from: {
        name: from?.name || name,
        address: from?.email || email,
      },
      to: {
        name: to.name,
        address: to.email,
      },
      subject,
      html: await this.mailTemplateProvider.parse({
        file,
        variables,
      }),
    };

    this.mailClient
      .sendMail(message)
      .then(() => {
        console.log('Message successfuly sent');
      })
      .catch(err => {
        console.log(`Error occurred. ${err.message}`);
        return process.exit(1);
      });
  }
}
