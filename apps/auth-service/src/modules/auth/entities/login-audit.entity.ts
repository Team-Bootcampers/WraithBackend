import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('login_audit')
export class LoginAuditEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'firebase_uid', nullable: true })
  firebaseUid?: string;

  @Column()
  email: string;

  @Column()
  success: boolean;

  @Column({ name: 'failure_reason', nullable: true })
  failureReason?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
