import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export default class AlterProviderFieldToProviderId1593285868570
  implements MigrationInterface {
  private readonly TABLE = 'appointments';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn(this.TABLE, 'provider');
    await queryRunner.addColumn(
      this.TABLE,
      new TableColumn({
        name: 'provider_id',
        type: 'uuid',
        isNullable: true,
      }),
    );
    await queryRunner.createForeignKey(
      this.TABLE,
      new TableForeignKey({
        name: 'appointment_fk_user',
        columnNames: ['provider_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(this.TABLE, 'appointment_fk_user');
    await queryRunner.dropColumn(this.TABLE, 'provider_id');
    await queryRunner.addColumn(
      this.TABLE,
      new TableColumn({
        name: 'provider',
        type: 'varchar',
        isNullable: false,
      }),
    );
  }
}
