import fs from 'fs/promises';
import path from 'path';

export class MailTemplate {
  async activationLink(projectName: string, link: string): Promise<string> {
    let template = await fs.readFile(path.join(__dirname, 'mail-templates/activationLink.html'), {
      encoding: 'utf-8',
    });
    template = template.replace(/\%\{PROJECT_NAME\}/gim, projectName);
    template = template.replace(/\%\{LINK\}/gim, link);

    return template;
  }
}
