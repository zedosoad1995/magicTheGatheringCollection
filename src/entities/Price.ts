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

    @Column({nullable: true, type: "float"})
    usd: number;

    @Column({nullable: true, type: "float"})
    usdFoil: number;

    @Column({nullable: true, type: "float"})
    usdEtched: number;

    @Column({nullable: true, type: "float"})
    eur: number;

    @Column({nullable: true, type: "float"})
    eurFoil: number;

    @Column({nullable: true, type: "float"})
    tix: number;

	@CreateDateColumn()
	created_at: Date;

	@UpdateDateColumn()
	updated_at: Date;
}