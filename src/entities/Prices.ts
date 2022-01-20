import {
	Entity,
	Column,
    PrimaryGeneratedColumn,
    BaseEntity,
	CreateDateColumn,
	UpdateDateColumn,
} from 'typeorm';

@Entity('prices')
export class Prices extends BaseEntity {
    @PrimaryGeneratedColumn()
	id: number;

    @Column()
    usd: number;

    @Column()
    usdFoil: number;

    @Column()
    usdEtched: number;

    @Column()
    eur: number;

    @Column()
    eurFol: number;

    @Column()
    tix: number;

	@CreateDateColumn()
	created_at: Date;

	@UpdateDateColumn()
	updated_at: Date;
}