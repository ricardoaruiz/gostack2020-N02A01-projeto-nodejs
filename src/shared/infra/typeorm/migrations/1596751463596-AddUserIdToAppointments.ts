import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export default class AddUserIdToAppointments1596751463596
  implements MigrationInterface {
  private readonly TABLE = 'appointments';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      this.TABLE,
      new TableColumn({
        name: 'customer_id',
        type: 'uuid',
        isNullable: true,
      }),
    );
    await queryRunner.createForeignKey(
      this.TABLE,
      new TableForeignKey({
        name: 'appointment_fk_customer',
        columnNames: ['customer_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(this.TABLE, 'appointment_fk_customer');
    await queryRunner.dropColumn(this.TABLE, 'customer_id');
  }
}
