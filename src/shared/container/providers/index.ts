import DiskStorageProvider from '@shared/container/providers/StorageProvider/implementations/DiskStorageProvider';
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';

import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';
import EtherealMailProvider from '@shared/container/providers/MailProvider/implementations/EtherealMailProvider';

import HandlebarsMailTemplateProvider from '@shared/container/providers/MailTemplateProvider/implementations/HandlebarsMailTemplateProvider';
import IMailTemplateProvider from '@shared/container/providers/MailTemplateProvider/models/IMailTemplateProvider';

// import FnsDateProvider from '@shared/container/providers/DateProvider/implementations/FnsDateProvider';
// import IDateProvider from '@shared/container/providers/DateProvider/models/IDateProvider';

import { container } from 'tsyringe';

container.registerSingleton<IStorageProvider>(
  'StorageProvider',
  DiskStorageProvider,
);

container.registerSingleton<IMailTemplateProvider>(
  'MailTemplateProvider',
  HandlebarsMailTemplateProvider,
);

container.registerInstance<IMailProvider>(
  'MailProvider',
  container.resolve(EtherealMailProvider),
);

// container.registerInstance<IDateProvider>(
//   'DateProvider',
//   container.resolve(FnsDateProvider),
// );
