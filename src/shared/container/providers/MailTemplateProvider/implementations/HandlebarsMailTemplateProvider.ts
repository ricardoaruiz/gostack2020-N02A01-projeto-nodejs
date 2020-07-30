import handlebars from 'handlebars';
import IMailTemplateProvider from '../models/IMailTemplateProvider';
import IParseMailTemplateDTO from '../dtos/IParseMailTemplateDTO';

export default class HandlebarsMailTemplateProvider
  implements IMailTemplateProvider {
  public async parse(data: IParseMailTemplateDTO): Promise<string> {
    const { template, variables } = data;
    const parsedTemplate = handlebars.compile(template);
    return parsedTemplate(variables);
  }
}
