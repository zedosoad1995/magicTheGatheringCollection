import {
	Entity,
	Column,
    PrimaryGeneratedColumn,
    BaseEntity,
	CreateDateColumn,
	UpdateDateColumn,
} from 'typeorm';

@Entity('price')
export class Price extends BaseEntity {
    @PrimaryGeneratedColumn()
	id: number;

    @Column({nullable: true})
    usd: number;

    @Column({nullable: true})
    usdFoil: number;

    @Column({nullable: true})
    usdEtched: number;

    @Column({nullable: true})
    eur: number;

    @Column({nullable: true})
    eurFoil: number;

    @Column({nullable: true})
    tix: number;

	@CreateDateColumn()
	created_at: Date;

	@UpdateDateColumn()
	updated_at: Date;
}