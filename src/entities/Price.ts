import {
	Entity,
	Column,
    PrimaryGeneratedColumn,
    BaseEntity,
	CreateDateColumn,
	UpdateDateColumn,
    JoinColumn,
    OneToOne,
} from 'typeorm';
import { Card } from './Card';

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

    @OneToOne(() => Card, {nullable: false, cascade: true, eager: true})
    @JoinColumn()
    card: Card;

	@CreateDateColumn({ type: 'timestamptz' })
	created_at: Date;

	@UpdateDateColumn({ type: 'timestamptz' })
	updated_at: Date;
}