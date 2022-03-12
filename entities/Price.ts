import {
	Entity,
	Column,
    PrimaryGeneratedColumn,
    BaseEntity,
	CreateDateColumn,
	UpdateDateColumn,
    JoinColumn,
    OneToOne,
    OneToMany,
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

    @OneToMany(
        () => Card,
        (cards) => cards.deck
    )
    cards: Card[];

	@CreateDateColumn({ type: 'timestamptz' })
	created_at: Date;

	@UpdateDateColumn({ type: 'timestamptz' })
	updated_at: Date;
}