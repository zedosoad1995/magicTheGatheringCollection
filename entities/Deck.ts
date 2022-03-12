import {
    Entity,
    Column,
    BaseEntity,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
    Unique,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Card } from './Card';

@Entity('deck')
@Unique('UQ_CODE', ['code'])
export class Deck extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    code: string;

    @Column()
    name: string;

    @Column({ type: 'date' })
    releasedAt: string;

    @Column()
    cardCount: number;

    @Column({ nullable: true })
    isDigital: boolean;

    @Column()
    url: string;

    @Column()
    iconUrl: string;

    @Column({ nullable: true })
    type: string;

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