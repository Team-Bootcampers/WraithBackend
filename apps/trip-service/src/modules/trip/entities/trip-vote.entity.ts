import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';

// Bir kullanıcı bir seyahate sadece bir kez oy verebilir; tekrar oy verirse mevcut kayıt güncellenir.
@Entity('trip_votes')
@Unique(['tripId', 'userId'])
export class TripVoteEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ name: 'trip_id' })
  tripId: string;

  @Index()
  @Column({ name: 'user_id' })
  userId: string;

  @Column({ type: 'int' })
  score: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
