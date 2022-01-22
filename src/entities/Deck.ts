import {
	Entity,
	Column,
    BaseEntity,
	CreateDateColumn,
	UpdateDateColumn,
    OneToMany,
    PrimaryColumn,
    Unique,
} from 'typeorm';
import { Card } from './Card';

@Entity('deck')
export class Deck extends BaseEntity {
    @PrimaryColumn()
    code: string;

    @Column()
    name: string;

    @Column({ type: 'date' })
    releasedAt: string;

    @Column()
    cardCount: number;

    @Column({nullable: true})
    isDigital: boolean;

    @Column()
    url: string;
    
    @Column()
    iconUrl: string;

    @Column({nullable: true})
    type: string;

    @OneToMany(
		() => Card,
		(cards) => cards.deck
	)
	cards: Card[];

	@CreateDateColumn()
	created_at: Date;

	@UpdateDateColumn()
	updated_at: Date;
}