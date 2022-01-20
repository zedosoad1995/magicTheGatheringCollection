import {
	Entity,
	Column,
    PrimaryGeneratedColumn,
    BaseEntity,
	CreateDateColumn,
	UpdateDateColumn,
    OneToMany,
} from 'typeorm';
import { Cards } from './Cards';

@Entity('prices')
export class Decks extends BaseEntity {
    @PrimaryGeneratedColumn()
	id: number;

    @Column()
    code: string;

    @Column()
    name: string;

    @Column({ type: 'date' })
    releasedAt: string;

    @Column()
    cardCount: number;

    @Column()
    isDigital: boolean;

    @Column()
    iconUrl: string;

    @OneToMany(
		() => Cards,
		(cards) => cards.deck
	)
	cards: Cards[];

	@CreateDateColumn()
	created_at: Date;

	@UpdateDateColumn()
	updated_at: Date;
}